# seed.py
import features
from online import write_feature

# Pre-populate Redis for 1000 entities
for i in range(1000):
    # write_feature("user_age", f"u{i}", 25, ttl=3600)
    # write_feature("account_balance", f"u{i}", 1000.0, ttl=3600)
    write_feature(entity_type="user", entity_id=f"u{i}", feature_name="user_age", value=25, ttl=3600)
    write_feature(entity_type="user", entity_id=f"u{i}", feature_name="account_balance", value=1000.0, ttl=3600)

print("Seeded 1000 entities.")