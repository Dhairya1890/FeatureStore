# features.py
from registry import feature

@feature(entity="user", ttl=3600, description="Age of the user", data_type="int")
def user_age(entity_ids: list[str]) -> dict:
    return {entity_id: 25 for entity_id in entity_ids}

@feature(entity="user", ttl=3600, description="Account balance", data_type="float")
def account_balance(entity_ids: list[str]) -> dict:
    return {entity_id: 1000.0 for entity_id in entity_ids}