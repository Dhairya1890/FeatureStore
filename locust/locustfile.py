from locust import HttpUser, task, between

class FeatureHubUser(HttpUser):
    wait_time = between(1, 3)

    @task(3)
    def get_online_features(self):
        self.client.post("/features/online", json={
            "entity_type": "user",
            "entity_id": "u1",
            "feature_names": ["user_age"]
        })

    @task(1)
    def get_historical_features(self):
        self.client.post("/features/historical", json={
            "entity_type": "user",
            "entity_id": "u1",
            "feature_names": ["user_age"],
            "timestamp": "2024-01-01T00:00:00"
        })

    @task(1)
    def health_check(self):
        self.client.get("/")