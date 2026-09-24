export const CONFIG = {
  apiBase: import.meta.env.VITE_API_BASE || "http://localhost:8000",
  apiKey : import.meta.env.VITE_API_KEY || "featurehub",
  grafanaUrl: import.meta.env.VITE_GRAFANA_URL || "http://localhost:3000",
  flowerUrl: import.meta.env.VITE_FLOWER_URL || "http://localhost:5555",
  locustUrl: import.meta.env.VITE_LOCUST_URL || "http://localhost:8089",
  docsUrl: import.meta.env.VITE_API_BASE ? `${import.meta.env.VITE_API_BASE}/docs` : "http://localhost:8000/docs",
  entities: ["user_001", "user_002", "user_003"],
  features: ["user_age", "account_balance"],
};

export default CONFIG;
