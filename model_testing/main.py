import sys
from pathlib import Path

# Add project root to sys.path
root_dir = Path(__file__).resolve().parent.parent
if str(root_dir) not in sys.path:
    sys.path.insert(0, str(root_dir))

import sdk

print("Registered Features in FeatureStore:")
for name, record in sdk.list_all().items():
    print(f" - {name} ({record.data_type}): {record.description}")