from locust import HttpUser, task, between

class FeatureHubUser(HttpUser):
    wait_time = between(1, 3)

    @task
    def get_feature(self):
        self.client.get("/features/user/u1/user_age")

    @task
    def write_feature(self):
        self.client.post("/features", json={
            "entity_type": "user",
            "entity_id": "u1",
            "feature_name": "user_age",
            "value": 25,
            "ttl": 3600
        })