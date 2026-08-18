"""
According to my AI Agent, I need three things in my Online __init__ file

- A Redis Connection
- A write_feature that stores a value with TTL
- A get_feature function that reads a value

"""

import os

import redis
from dotenv import load_dotenv

load_dotenv()

r = redis.from_url(os.getenv('REDIS_URL', 'redis://localhost:6379/0'))
redis_client = r

# Redis command to set a key

# r.set(key, value, ex=ttl)

# Write a materialization job function

def write_feature(entity_type=None, entity_id=None, feature_name=None, value=None, ttl=None, **kwargs):
    if feature_name is None and 'feature_name' in kwargs:
        feature_name = kwargs['feature_name']
    if entity_id is None and 'entity_id' in kwargs:
        entity_id = kwargs['entity_id']
    if value is None and 'value' in kwargs:
        value = kwargs['value']
    if ttl is None and 'ttl' in kwargs:
        ttl = kwargs['ttl']
    if entity_type is None:
        entity_type = kwargs.get('entity_type', 'user')

    if entity_type is None or entity_id is None or feature_name is None or value is None or ttl is None:
        raise TypeError("write_feature requires entity_type, entity_id, feature_name, value, and ttl.")

    k = f'{entity_type}:{entity_id}:{feature_name}'
    r.set(k, value, ex=ttl)
    return True

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

    try:
        result = r.get(key)
        if result is None:
            return None
        return float(result)
    except redis.ConnectionError:
        return None
    