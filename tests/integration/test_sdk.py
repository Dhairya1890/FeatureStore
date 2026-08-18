from datetime import datetime, timedelta, timezone

import pytest
from sqlalchemy import text

import offline
import registry
from online import r as redis_client
from sdk import get_historical_features, get_online_features


@pytest.fixture(autouse=True)
def reset_state():
    redis_client.flushdb()
    with offline.engine.begin() as conn:
        conn.execute(text("DELETE FROM feature_store"))
    registry._registry.clear()
    yield
    redis_client.flushdb()
    with offline.engine.begin() as conn:
        conn.execute(text("DELETE FROM feature_store"))
    registry._registry.clear()


def _register_feature(name: str):
    registry._registry[name] = type(
        "FeatureStub",
        (),
        {"name": name, "entity_type": "user", "ttl": 3600},
    )()


def test_get_online_happy_path():
    redis_client.set("user:u123:user_age", 25)
    redis_client.set("user:u123:account_balance", 1000)
    _register_feature("user_age")
    _register_feature("account_balance")

    result = get_online_features(["u123"], ["user_age", "account_balance"])

    assert result == {"u123": {"user_age": 25, "account_balance": 1000}}


def test_get_online_fallback_to_offline():
    offline.write_feature(
        entity_id="u123",
        feature_name="user_age",
        value=42,
        computed_at=datetime.now(timezone.utc),
    )
    _register_feature("user_age")

    result = get_online_features(["u123"], ["user_age"])

    assert result["u123"]["user_age"] == 42


def test_get_online_double_miss():
    _register_feature("user_age")

    result = get_online_features(["u123"], ["user_age"])

    assert result["u123"]["user_age"] is None


def test_get_online_invalid_feature_raises():
    with pytest.raises(ValueError):
        get_online_features(["u123"], ["nonexistent"])


def test_get_historical_happy_path():
    now = datetime.now(timezone.utc)
    offline.write_feature(
        entity_id="u123",
        feature_name="user_age",
        value=25,
        computed_at=now - timedelta(hours=1),
    )
    _register_feature("user_age")

    result = get_historical_features(["u123"], ["user_age"], as_of=now)

    assert result["u123"]["user_age"] == 25


def test_get_historical_point_in_time_correct():
    now = datetime.now(timezone.utc)
    offline.write_feature(
        entity_id="u123",
        feature_name="user_age",
        value=25,
        computed_at=now - timedelta(hours=2),
    )
    offline.write_feature(
        entity_id="u123",
        feature_name="user_age",
        value=30,
        computed_at=now - timedelta(minutes=30),
    )
    _register_feature("user_age")

    result = get_historical_features(["u123"], ["user_age"], as_of=now - timedelta(hours=1))

    assert result["u123"]["user_age"] == 25


def test_get_historical_naive_datetime_raises():
    with pytest.raises(ValueError):
        get_historical_features(["u123"], ["user_age"], as_of=datetime.now())


def test_result_matrix_always_complete():
    now = datetime.now(timezone.utc)
    offline.write_feature(
        entity_id="u123",
        feature_name="user_age",
        value=25,
        computed_at=now - timedelta(hours=1),
    )
    _register_feature("user_age")
    _register_feature("account_balance")

    result = get_historical_features(
        ["u123"],
        ["user_age", "account_balance"],
        as_of=now,
    )

    assert result["u123"]["user_age"] == 25
    assert result["u123"]["account_balance"] is None
