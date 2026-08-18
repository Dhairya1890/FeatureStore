import logging
from datetime import datetime, timezone

from registry import get, list_all
from offline import get_historical_features as offline_get_historical
from online import get_feature as online_get_feature

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Internal helpers
# ---------------------------------------------------------------------------

def _validate_feature_names(feature_names: list[str]) -> None:
    """Raise ValueError for any feature_name not in the registry."""
    for name in feature_names:
        try:
            registry_entry = get(name)
        except KeyError:
            registry_entry = None
        if registry_entry is None:
            raise ValueError(
                f"[FeatureHub SDK] Feature '{name}' is not registered. "
                f"Available features: {list_all()}"
            )


def _empty_result(entity_ids: list[str], feature_names: list[str]) -> dict:
    """Scaffold a result dict with None for every cell."""
    return {
        entity_id: {name: None for name in feature_names}
        for entity_id in entity_ids
    }


# ---------------------------------------------------------------------------
# Public SDK
# ---------------------------------------------------------------------------

def get_online_features(
    entity_ids: list[str],
    feature_names: list[str],
) -> dict[str, dict[str, object]]:
    """Fetch latest feature values from the online store (Redis).

    Falls back to the offline store (as of now) for any missing value.
    Use at inference time.

    Args:
        entity_ids:    Entities to fetch for.
        feature_names: Features to fetch.

    Returns:
        {entity_id: {feature_name: value}}
        Missing values that could not be recovered are None.
    """
    _validate_feature_names(feature_names)

    result = _empty_result(entity_ids, feature_names)
    fallback_needed: list[tuple[str, str]] = []  # (entity_id, feature_name)

    # Primary: Redis
    for entity_id in entity_ids:
        for feature_name in feature_names:
            feature_record = get(feature_name)
            entity_type = feature_record.entity_type if feature_record is not None else "user"
            value = online_get_feature(entity_type, entity_id, feature_name)
            if value is not None:
                result[entity_id][feature_name] = value
            else:
                fallback_needed.append((entity_id, feature_name))

    # Fallback: offline store as of now
    if fallback_needed:
        as_of = datetime.now(timezone.utc)
        logger.warning(
            "[FeatureHub SDK] Online miss — falling back to offline | "
            "pairs=%d as_of=%s",
            len(fallback_needed), as_of.isoformat(),
        )
        for entity_id, feature_name in fallback_needed:
            rows = offline_get_historical(
                entity_ids=[entity_id],
                feature_names=[feature_name],
                as_of=as_of,
            )
            # rows: {entity_id: {feature_name: value}}
            value = rows.get(entity_id, {}).get(feature_name)
            if value is None:
                logger.error(
                    "[FeatureHub SDK] Fallback miss | "
                    "feature=%s entity=%s — returning None.",
                    feature_name, entity_id,
                )
            result[entity_id][feature_name] = value

    return result


def get_historical_features(
    entity_ids: list[str],
    feature_names: list[str],
    as_of: datetime,
) -> dict[str, dict[str, object]]:
    """Fetch point-in-time correct feature values from the offline store.

    Use at training time. The as_of timestamp is applied strictly --
    no value computed after as_of will be returned, preventing data leakage.

    Args:
        entity_ids:    Entities to fetch for.
        feature_names: Features to fetch.
        as_of:         Point-in-time cutoff. Must be timezone-aware.

    Returns:
        {entity_id: {feature_name: value}}
        Missing values are None.
    """
    if as_of.tzinfo is None:
        raise ValueError(
            "[FeatureHub SDK] as_of must be timezone-aware. "
            "Use datetime.now(timezone.utc) or attach tzinfo explicitly."
        )

    _validate_feature_names(feature_names)

    rows = offline_get_historical(
        entity_ids=entity_ids,
        feature_names=feature_names,
        as_of=as_of,
    )

    # Scaffold missing entities/features as None so callers
    # always get a complete matrix regardless of store gaps.
    result = _empty_result(entity_ids, feature_names)
    for entity_id in entity_ids:
        for feature_name in feature_names:
            value = rows.get(entity_id, {}).get(feature_name)
            if value is None:
                logger.warning(
                    "[FeatureHub SDK] Historical miss | "
                    "feature=%s entity=%s as_of=%s — returning None.",
                    feature_name, entity_id, as_of.isoformat(),
                )
            result[entity_id][feature_name] = value

    return result