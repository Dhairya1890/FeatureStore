from locust import HttpUser, task, between
from datetime import datetime, timezone

API_KEY = "featurehub"

class FeatureHubUser(HttpUser):
    wait_time = between(1, 3)

    @task(3)
    def get_online_features(self):
        self.client.post("/features/online", json={
            "entity_id": "u1",
            "entity_ids": ["u1", "u2", "u3"],
            "feature_names": ["user_age", "user_score", "purchase_count"]
        },
        headers={"x-api-key" : API_KEY}
        )

    @task(1)
    def get_historical_features(self):
        self.client.post("/features/historical", json={
            "entity_ids": ["u1", "u2", "u3"],
            "feature_names": ["user_age", "user_score", "purchase_count"],
            "as_of": datetime.now(timezone.utc).isoformat()
        },
        headers={"x-api-key" : API_KEY}
        )

    @task(1)
    def health_check(self):
        self.client.get("/")