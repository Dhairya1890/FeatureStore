from prometheus_client import Counter, Histogram


MATERIALIZATION_RUNS = Counter(
    "featurehub_materialization_runs_total",
    "Materialization task outcomes by feature.",
    ("feature", "entity_type", "status"),
)
MATERIALIZATION_ENTITIES = Counter(
    "featurehub_materialization_entities_total",
    "Entities received by materialization tasks.",
    ("feature", "entity_type"),
)
MATERIALIZATION_WRITES = Counter(
    "featurehub_materialization_writes_total",
    "Feature values written by materialization.",
    ("feature", "entity_type"),
)
MATERIALIZATION_SKIPS = Counter(
    "featurehub_materialization_skips_total",
    "Feature values skipped during materialization.",
    ("feature", "entity_type", "reason"),
)
MATERIALIZATION_DURATION = Histogram(
    "featurehub_materialization_duration_seconds",
    "Materialization task duration in seconds.",
    ("feature", "entity_type"),
)

ONLINE_READS = Counter(
    "featurehub_online_reads_total",
    "Online feature read outcomes.",
    ("feature", "entity_type", "status"),
)
ONLINE_WRITES = Counter(
    "featurehub_online_writes_total",
    "Online feature write outcomes.",
    ("feature", "entity_type", "status"),
)
ONLINE_READ_DURATION = Histogram(
    "featurehub_online_read_duration_seconds",
    "Online feature read duration in seconds.",
    ("feature", "entity_type"),
)
ONLINE_FALLBACKS = Counter(
    "featurehub_online_fallbacks_total",
    "Online misses that required offline fallback.",
    ("feature", "status"),
)
ONLINE_FALLBACK_MISSES = Counter(
    "featurehub_online_fallback_misses_total",
    "Offline fallback misses after an online miss.",
    ("feature",),
)
