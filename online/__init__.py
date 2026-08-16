"""
According to my AI Agent, I need three things in my Online __init__ file
- A Redis Connection
- A write_feature that stores a value with TTL
- A get_feature function that reads a value

Let's find out - I will not trust the AI blindly, Nor did I asked to brainstorm what needs to be in this particular module

"""

import redis
import os
from dotenv import load_dotenv

load_dotenv()

r = redis.from_url(os.getenv('REDIS_URL'))

# Redis command to set a key

# r.set(key, value, ex=ttl)

# Write a materialization job function

def write_feature(entity_type, entity_id, feature_name, value, ttl):
    k = f'{entity_type}:{entity_id}:{feature_name}'
    r.set(k, value, ex=ttl)

# The read function that reads the value back

# Redis provides r.get(key) for reading

def get_feature(entity_type, entity_id, feature_name):

    k = f'{entity_type}:{entity_id}:{feature_name}'
    try:
        result = r.get(k)
        if result is None:
            return None
        return float(result)
    except redis.ConnectionError as e:
        return None
    