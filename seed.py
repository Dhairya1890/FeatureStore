# seed.py
from datetime import datetime, timezone
import features
from online import write_feature
from offline import write_features_batch, init_db

# Ensure tables exist
init_db()

# Pre-populate entities (both u0..u999 and frontend demo entities user_001..user_003)
entity_ids = ["user_001", "user_002", "user_003"] + [f"u{i}" for i in range(1000)]
now = datetime.now(timezone.utc)
offline_records = []

for eid in entity_ids:
    # Redis online writes
    write_feature(entity_type="user", entity_id=eid, feature_name="user_age", value=25.0, ttl=3600)
    write_feature(entity_type="user", entity_id=eid, feature_name="account_balance", value=1000.0, ttl=3600)
    write_feature(entity_type="user", entity_id=eid, feature_name="user_score", value=100.0, ttl=3600)

    # Prepare offline records
    offline_records.append({"entity_type": "user", "entity_id": eid, "feature_name": "user_age", "value": 25.0, "computed_at": now})
    offline_records.append({"entity_type": "user", "entity_id": eid, "feature_name": "account_balance", "value": 1000.0, "computed_at": now})
    offline_records.append({"entity_type": "user", "entity_id": eid, "feature_name": "user_score", "value": 100.0, "computed_at": now})

# Fast single-transaction batch write to PostgreSQL
write_features_batch(offline_records)

print(f"Seeded {len(entity_ids)} entities ({len(offline_records)} feature records) into Redis and PostgreSQL.")