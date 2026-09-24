# locustfile.py
import random
from locust import HttpUser, task, between
from dotenv import load_dotenv
import os

load_dotenv()

ENTITY_IDS = [f"u{i}" for i in range(1000)]
HEADERS = {"X-API-Key": os.getenv('FEATUREHUB_API_KEY')}


class FeatureHubUser(HttpUser):
    wait_time = between(0.001, 0.005)

    @task(4)
    def online_features(self):
        self.client.post(
            "/features/online",
            json={
                "entity_ids": random.sample(ENTITY_IDS, 10),
                "feature_names": ["user_age", "account_balance"],
            },
            headers=HEADERS,
        )

    @task(1)
    def historical_features(self):
        self.client.post(
            "/features/historical",
            json={
                "entity_ids": random.sample(ENTITY_IDS, 5),
                "feature_names": ["user_age"],
                "as_of": "2025-01-01T00:00:00Z",
            },
            headers=HEADERS,
        )