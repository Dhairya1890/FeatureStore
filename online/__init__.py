"""

- A Redis Connection
- A write_feature that stores a value with TTL
- A get_feature function that reads a value

"""

import os
import redis
from dotenv import load_dotenv
from time import perf_counter

from monitoring.metrics import ONLINE_READ_DURATION, ONLINE_READS, ONLINE_WRITES

load_dotenv()

raw_redis = os.getenv('REDIS_URL', 'redis://localhost:6379/0').strip().strip('"\'')
if not raw_redis.startswith(("redis://", "rediss://", "unix://")):
    if "://" not in raw_redis:
        raw_redis = f"redis://{raw_redis}"

r = redis.from_url(raw_redis)
redis_client = r

# Redis command to set a key

# r.set(key, value, ex=ttl)

# Write a materialization job function

def write_feature(entity_type, entity_id, feature_name, value, ttl):
    if any(arg is None for arg in (entity_type, entity_id, feature_name, value, ttl)):
        raise TypeError("write_feature requires entity_type, entity_id, feature_name, value, and ttl.")

    k = f'{entity_type}:{entity_id}:{feature_name}'
    try:
        r.set(k, value, ex=ttl)
        ONLINE_WRITES.labels(
            feature=feature_name, entity_type=entity_type, status='success'
        ).inc()
        return True
    except redis.ConnectionError:
        ONLINE_WRITES.labels(
            feature=feature_name, entity_type=entity_type, status='error'
        ).inc()
        raise

# The read function that reads the value back

# Redis provides r.get(key) for reading

def get_feature(entity_type_or_feature_name, entity_id=None, feature_name=None):
    if feature_name is None and entity_id is not None:
        feature_name = entity_type_or_feature_name
        entity_id_value = entity_id
        entity_type = 'user'
        key = f'{entity_type}:{entity_id_value}:{feature_name}'
    else:
        entity_type = entity_type_or_feature_name
        entity_id_value = entity_id
        key = f'{entity_type}:{entity_id_value}:{feature_name}'

    started_at = perf_counter()
    try:
        result = r.get(key)
        if result is None:
            ONLINE_READS.labels(
                feature=feature_name, entity_type=entity_type, status='miss'
            ).inc()
            return None
        ONLINE_READS.labels(
            feature=feature_name, entity_type=entity_type, status='hit'
        ).inc()
        return float(result)
    except redis.ConnectionError:
        ONLINE_READS.labels(
            feature=feature_name, entity_type=entity_type, status='error'
        ).inc()
        return None
    finally:
        ONLINE_READ_DURATION.labels(
            feature=feature_name, entity_type=entity_type
        ).observe(perf_counter() - started_at)
    