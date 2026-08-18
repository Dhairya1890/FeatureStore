from sqlalchemy import Column, String, Float, DateTime, Index, Integer
from sqlalchemy.orm import declarative_base

Base = declarative_base()


class FeatureValue(Base):
    # Defining Columns of Table feature_store
    __tablename__ = "feature_store"
    id = Column(Integer, primary_key=True, autoincrement=True)
    entity_id = Column(String)
    feature_name = Column(String)
    value = Column(Float)
    computed_at = Column(DateTime)

    __table_args__ = (Index("entity_id", "feature_name"),)


from sqlalchemy import create_engine
from dotenv import load_dotenv
import os

load_dotenv()

# Connection to SQLAlchemy's connection to the database
engine = create_engine(os.getenv("POSTGRES_URL"))


def init_db():
    Base.metadata.create_all(engine)


# metadata is SQLAlchemy's internal registry of all table definations attached to Base

from sqlalchemy.orm import sessionmaker
from sqlalchemy import text

Session = sessionmaker(bind=engine)


# Writing to Offline Store


def write_feature(entity_id, feature_name, value, computed_at):

    session = Session()

    try:
        new_value = FeatureValue(
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


# Function returning feature value of required params


def get_historical_features(entity_ids=None, feature_names=None, as_of=None, *, entity_id=None, feature_name=None, as_of_timestamp=None):
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

    session = Session()
    try:
        result = {entity_id_value: {} for entity_id_value in entity_ids}
        for entity_id_value in entity_ids:
            for feature_name_value in feature_names:
                row = session.execute(
                    text("""
                        SELECT value
                        FROM feature_store f
                        WHERE f.entity_id = :entity_id
                        AND f.feature_name = :feature_name
                        AND f.computed_at <= :computed_at
                        ORDER by computed_at DESC
                        LIMIT 1
                    """),
                    {
                        "entity_id": entity_id_value,
                        "feature_name": feature_name_value,
                        "computed_at": as_of,
                    },
                ).fetchone()
                result.setdefault(entity_id_value, {})[feature_name_value] = row[0] if row else None
        return result
    finally:
        session.close()
