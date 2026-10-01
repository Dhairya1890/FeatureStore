# features.py
# single source where all features are defined
from registry import feature

@feature(entity="user", ttl=3600, description="Age of the user", data_type="int", version="0.0.1", owner="user")
def user_age(entity_ids: list[str]) -> dict:
    return {entity_id: 25 for entity_id in entity_ids}

@feature(entity="user", ttl=3600, description="Account balance", data_type="float",  version="0.0.1", owner="user")
def account_balance(entity_ids: list[str]) -> dict:
    return {entity_id: 1000.0 for entity_id in entity_ids}

@feature(entity="user", ttl=3600, description="score of user", data_type="int",  version="0.0.1", owner="user")
def user_score(entity_ids : list[str]) -> dict:
    return {entity_id: 100 for entity_id in entity_ids}