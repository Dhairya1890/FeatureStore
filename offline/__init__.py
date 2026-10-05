from sqlalchemy import Column, String, Float, DateTime, Index, Integer
from sqlalchemy.orm import declarative_base

Base = declarative_base()


# schema for postgres table FeatureValue
class FeatureValue(Base):
    # Defining Columns of Table feature_store
    __tablename__ = "feature_store"
    id = Column(Integer, primary_key=True, autoincrement=True)
    entity_type = Column(String, default="user")
    entity_id = Column(String)
    feature_name = Column(String)
    value = Column(Float)
    computed_at = Column(DateTime(timezone=True))

    __table_args__ = (
        Index("ix_entity_feature_time", "entity_id", "feature_name", "computed_at"),
    )


from sqlalchemy import create_engine
from dotenv import load_dotenv, find_dotenv
import os

load_dotenv(find_dotenv())

# Connection to SQLAlchemy's connection to the database
postgres_url = (
    os.getenv("POSTGRES_URL")
    or os.getenv("POSTGRESQL_URL")
    or os.getenv("DATABASE_URL")
    or "postgresql://featurehub:featurehub@localhost:5432/featurehub"
)
if postgres_url.startswith("postgres://"):
    postgres_url = postgres_url.replace("postgres://", "postgresql://", 1)

engine = create_engine(postgres_url)


def init_db():
    Base.metadata.create_all(engine)


# metadata is SQLAlchemy's internal registry of all table definations attached to Base

from sqlalchemy.orm import sessionmaker
from sqlalchemy import text

Session = sessionmaker(bind=engine)


# Writing to Offline Store


def write_feature(entity_id, feature_name, value, computed_at, entity_type="user"):

    session = Session()

    try:
        new_value = FeatureValue(
            entity_type=entity_type,
            entity_id=entity_id,
            feature_name=feature_name,
            value=value,
            computed_at=computed_at,
        )

        session.add(new_value)
        session.commit()
    except Exception as e:
        session.rollback()
        raise e
    finally:
        session.close()


def write_features_batch(records: list[dict]):
    """Batch write multiple feature values to the offline store in a single transaction."""
    if not records:
        return
    session = Session()
    try:
        objects = [
            FeatureValue(
                entity_type=rec.get("entity_type", "user"),
                entity_id=rec["entity_id"],
                feature_name=rec["feature_name"],
                value=rec["value"],
                computed_at=rec["computed_at"],
            )
            for rec in records
        ]
        session.bulk_save_objects(objects)
        session.commit()
    except Exception as e:
        session.rollback()
        raise e
    finally:
        session.close()


# Function returning feature value of required params


def get_historical_features(
    entity_ids=None,
    feature_names=None,
    as_of=None,
    *,
    entity_id=None,
    feature_name=None,
    as_of_timestamp=None
):
    if as_of is None:
        as_of = as_of_timestamp
    if isinstance(entity_ids, str):
        entity_ids = [entity_ids]
    if isinstance(feature_names, str):
        feature_names = [feature_names]
    if entity_id is not None:
        entity_ids = [entity_id]
    if feature_name is not None:
        feature_names = [feature_name]
    if entity_ids is None:
        entity_ids = []
    if feature_names is None:
        feature_names = []

    if not entity_ids or not feature_names:
        return {eid: {} for eid in entity_ids}

    session = Session()
    try:
        result = {eid: {} for eid in entity_ids}
        rows = session.execute(
            text("""
                SELECT DISTINCT ON (entity_id, feature_name)
                       entity_id, feature_name, value
                FROM feature_store
                WHERE entity_id = ANY(:entity_ids)
                  AND feature_name = ANY(:feature_names)
                  AND computed_at <= :as_of
                ORDER BY entity_id, feature_name, computed_at DESC
            """),
            {
                "entity_ids": entity_ids,
                "feature_names": feature_names,
                "as_of": as_of,
            },
        ).fetchall()
        for row in rows:
            result.setdefault(row[0], {})[row[1]] = row[2]
        # Fill in None for missing feature values
        for eid in entity_ids:
            for fname in feature_names:
                result[eid].setdefault(fname, None)
        return result
    finally:
        session.close()
