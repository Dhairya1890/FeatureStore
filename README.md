# FeatureStore

FeatureStore is a lightweight ML feature store built to reduce training-serving skew and prevent data leakage. It keeps one source of truth for feature definitions, stores historical values in an offline store, and serves the latest values from Redis for online inference.

## Why this project exists

This project solves two common production problems:

- Training-serving skew: the feature logic used in training and serving should be identical.
- Data leakage: historical feature queries should respect the point-in-time cutoff, not return future values.

## Core idea

The system separates features into three layers:

1. Registry: feature definitions live in one place.
2. Offline store: historical values are stored with timestamps for point-in-time queries.
3. Online store: latest values are cached in Redis for fast reads.

## Architecture

### Feature registry
The registry stores feature metadata and the compute function used to generate values. Features are registered through a decorator and are available to materialization and SDK code.

### Offline store
Historical rows are persisted with entity_id, feature_name, value, and computed_at. Point-in-time queries select the latest value at or before a requested timestamp.

### Online store
Latest feature values are stored in Redis with TTL. This makes fast online serving possible with a simple key lookup.

### Materialization
A Celery task computes values for a feature across a set of entity IDs and writes them to the online store for serving.

### SDK
The SDK provides a unified interface for reading online or historical features without exposing storage internals to application code.

## Tech stack

- Python
- Redis
- PostgreSQL
- SQLAlchemy
- Celery
- FastAPI
- pytest

## Project structure

```text
FeatureStore/
├── api/
├── materialization/
├── offline/
├── online/
├── registry/
├── sdk/
├── tests/
├── .env
├── .gitignore
├── context.md
├── docker-compose.yml
├── requirements.txt
├── README.md
├── test.py
├── test_db.py
└── test_materialization.py
```

## Environment setup

1. Create a Python virtual environment.
2. Activate it.
3. Install dependencies:

```bash
pip install -r requirements.txt
```

Example environment variables:

```env
POSTGRES_URL=postgresql://featurehub:featurehub@localhost:5432/featurehub
REDIS_URL=redis://localhost:6379/0
CELERY_BROKER_URL=redis://localhost:6379/1
FEATUREHUB_API_KEY=changeme
```

## Running the project

Start the services defined in docker-compose:

```bash
docker-compose up -d
```

Then run the Python app or API as needed.

## Running tests

From the project root:

```bash
python -m pytest
```

Run a single file:

```bash
python -m pytest tests/integration/test_materialization.py -q
```

## Example usage

```python
from registry import feature

@feature(entity="user", ttl=3600)
def user_age(user_id: str):
    return 25
```

## Current status

This repository is a working foundation for a feature store with:

- registry-based feature definitions
- Redis online reads and writes
- historical offline feature storage
- materialization task flow
- SDK access layer
- integration tests for primary feature-store workflows

## Future improvements

- Add robust scheduling for background materialization
- Add stronger Redis and Postgres error handling
- Add API authentication and rate limiting
- Add metrics and observability
- Expand test coverage for edge cases and failure modes

## License

This project is for learning and experimentation. Add a license if you want to distribute it publicly.
