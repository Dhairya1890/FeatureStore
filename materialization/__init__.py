import logging
import random
import os
from celery import Celery
from celery.utils.log import get_task_logger

from registry import get, list_all
from online import write_feature as write_online

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------
logger = get_task_logger(__name__)

# ---------------------------------------------------------------------------
# Celery app
# ---------------------------------------------------------------------------
CELERY_BROKER_URL = os.getenv("CELERY_BROKER_URL", "redis://localhost:6379/1")

celery_app = Celery(
    "featurehub",
    broker=CELERY_BROKER_URL,
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    timezone="UTC",
    enable_utc=True,
)

# ---------------------------------------------------------------------------
# Retry config
# ---------------------------------------------------------------------------
BASE_DELAY    = 2    # seconds
MAX_DELAY     = 60   # seconds — retry limit reached when backoff saturates here
JITTER_CAP    = 5    # seconds
MAX_RETRIES   = 5    # attempts 1-5 retry; attempt 6 gives up


def _backoff_delay(attempt: int) -> float:
    """Exponential backoff with jitter.

    delay = min(base * 2^attempt, max_delay) + uniform(0, jitter_cap)
    """
    exponential = BASE_DELAY * (2 ** attempt)
    capped      = min(exponential, MAX_DELAY)
    jitter      = random.uniform(0, JITTER_CAP)
    return round(capped + jitter, 2)


# ---------------------------------------------------------------------------
# Failure notification
# ---------------------------------------------------------------------------
def _notify_failure(feature_name: str, exc: Exception) -> None:
    """Called after all retries are exhausted for a feature.

    Currently logs at ERROR level. Replace / extend with webhook,
    PagerDuty, Slack, etc. without touching the task itself.
    """
    logger.error(
        "[FeatureHub] Materialization FAILED permanently | "
        "feature=%s | error=%s: %s",
        feature_name,
        type(exc).__name__,
        exc,
    )
    # TODO: send to alerting system (webhook / Slack / PagerDuty)


# ---------------------------------------------------------------------------
# Per-feature Celery task
# ---------------------------------------------------------------------------
@celery_app.task(
    bind=True,
    max_retries=MAX_RETRIES,
    name="featurehub.materialize_feature",
)
def materialize_feature(self, feature_name: str, entity_ids: list[str]) -> dict:
    """Compute and write one feature for all given entities to the online store.

    Args:
        feature_name: Name of the registered feature.
        entity_ids:   List of entity IDs to materialize for.

    Returns:
        dict with keys 'feature', 'written', 'skipped' for observability.
    """
    record = get(feature_name)
    if record is None:
        # Feature was removed from registry between scheduling and execution.
        # Not a transient error — don't retry, just warn.
        logger.warning(
            "[FeatureHub] Feature '%s' not found in registry — skipping.",
            feature_name,
        )
        return {"feature": feature_name, "written": 0, "skipped": len(entity_ids)}

    written = 0
    skipped = 0

    try:
        # Batch compute: one call, dict back
        values: dict = record.compute_fn(entity_ids)

        for entity_id in entity_ids:
            value = values.get(entity_id)
            if value is None:
                logger.warning(
                    "[FeatureHub] compute_fn returned no value | "
                    "feature=%s entity=%s — skipping.",
                    feature_name, entity_id,
                )
                skipped += 1
                continue

            write_online(
                entity_type=record.entity_type,
                feature_name=feature_name,
                entity_id=entity_id,
                value=value,
                ttl=record.ttl,
            )
            written += 1

        logger.info(
            "[FeatureHub] Materialized | feature=%s written=%d skipped=%d",
            feature_name, written, skipped,
        )
        return {"feature": feature_name, "written": written, "skipped": skipped}

    except Exception as exc:
        attempt  = self.request.retries          # 0-indexed
        delay    = _backoff_delay(attempt)

        if self.request.retries < MAX_RETRIES:
            logger.warning(
                "[FeatureHub] Transient failure | feature=%s attempt=%d/%d "
                "retrying in %.1fs | error=%s: %s",
                feature_name, attempt + 1, MAX_RETRIES,
                delay, type(exc).__name__, exc,
            )
            raise self.retry(exc=exc, countdown=delay)

        # All retries exhausted
        _notify_failure(feature_name, exc)
        raise  # re-raise so Celery marks task as FAILURE


# ---------------------------------------------------------------------------
# Coordinator — called by scheduler or upstream trigger
# ---------------------------------------------------------------------------
def run_materialization(entity_ids: list[str]) -> list:
    """Fire one materialize_feature task per registered feature.

    Args:
        entity_ids: Caller-supplied list — materialization does NOT
                    decide who is active (separation of concerns).

    Returns:
        List of AsyncResult objects (one per feature) for the caller
        to monitor if needed.
    """
    if not entity_ids:
        logger.warning("[FeatureHub] run_materialization called with empty entity_ids — no-op.")
        return []

    features = list_all()
    if not features:
        logger.warning("[FeatureHub] No features registered — nothing to materialize.")
        return []

    results = []
    for feature_name in features:
        async_result = materialize_feature.delay(feature_name, entity_ids)
        logger.info(
            "[FeatureHub] Dispatched task | feature=%s task_id=%s",
            feature_name, async_result.id,
        )
        results.append(async_result)

    logger.info(
        "[FeatureHub] Dispatched %d materialization tasks for %d entities.",
        len(results), len(entity_ids),
    )
    return results