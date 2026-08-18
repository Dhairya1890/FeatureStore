from types import SimpleNamespace

import pytest

import registry
from materialization import materialize_feature, run_materialization
from online import r as redis_client


@pytest.fixture(autouse=True)
def reset_state():
    redis_client.flushdb()
    registry._registry.clear()
    yield
    redis_client.flushdb()
    registry._registry.clear()


def _register_feature(name: str, value_map: dict[str, float], ttl: int = 3600):
    registry._registry[name] = SimpleNamespace(
        name=name,
        entity_type="user",
        ttl=ttl,
        compute_fn=lambda entity_ids, value_map=value_map: value_map,
    )


def test_happy_path():
    _register_feature("user_age", {"u123": 25, "u456": 31})

    result = materialize_feature.run("user_age", ["u123", "u456"])

    assert result["written"] == 2
    assert result["skipped"] == 0
    assert float(redis_client.get("user:u123:user_age")) == 25
    assert float(redis_client.get("user:u456:user_age")) == 31


def test_unregistered_feature():
    result = materialize_feature.run("nonexistent", ["u123"])

    assert result["written"] == 0
    assert result["skipped"] == 1
    assert redis_client.keys("*") == []


def test_missing_entity_in_compute_fn_output():
    registry._registry["user_age"] = SimpleNamespace(
        name="user_age",
        entity_type="user",
        ttl=3600,
        compute_fn=lambda entity_ids: {"u123": 25},
    )

    result = materialize_feature.run("user_age", ["u123", "u456"])

    assert result["written"] == 1
    assert result["skipped"] == 1
    assert float(redis_client.get("user:u123:user_age")) == 25
    assert redis_client.get("user:u456:user_age") is None


def test_empty_entity_ids_to_coordinator():
    assert run_materialization([]) == []
    assert redis_client.keys("*") == []


def test_coordinator_dispatches_one_task_per_feature(monkeypatch):
    for name in ["user_age", "account_balance", "country_code"]:
        _register_feature(name, {"u123": 1})

    dispatched = []

    def fake_delay(feature_name, entity_ids):
        result = SimpleNamespace(id=f"task-{feature_name}")
        dispatched.append(result)
        return result

    monkeypatch.setattr(materialize_feature, "delay", fake_delay)

    result = run_materialization(["u123"])

    assert len(result) == 3
    assert len(dispatched) == 3
