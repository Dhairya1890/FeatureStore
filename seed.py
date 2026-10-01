# seed.py
import features
from online import write_feature
from offline import write_feature as offline_write
from datetime import datetime
# Pre-populate Redis for 1000 entities
for i in range(1000):
    time = datetime.now()
    write_feature(entity_type="user", entity_id=f"u{i}", feature_name="user_age", value=25, ttl=3600)
    write_feature(entity_type="user", entity_id=f"u{i}", feature_name="account_balance", value=1000.0, ttl=3600)
    offline_write(entity_id=f"u{i}", feature_name="user_age", value=20, computed_at=time)
    offline_write(entity_id=f"u{i}", feature_name="account_balance", value=1000, computed_at=time)
print("Seeded 1000 entities.")