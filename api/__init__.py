import logging
import os
from contextlib import asynccontextmanager
from datetime import datetime

import redis
import sqlalchemy
from fastapi import FastAPI, Header, HTTPException, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel, field_validator

from sdk import get_online_features, get_historical_features
from online import redis_client
from offline import engine

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Auth
# ---------------------------------------------------------------------------
FEATUREHUB_API_KEY = os.getenv("FEATUREHUB_API_KEY", "")

if not FEATUREHUB_API_KEY:
    raise RuntimeError(
        "FEATUREHUB_API_KEY env variable is not set. "
        "Set it before starting the server."
    )


async def verify_api_key(x_api_key: str = Header(...)) -> None:
    if x_api_key != FEATUREHUB_API_KEY:
        raise HTTPException(status_code=401, detail="Invalid or missing API key.")


# ---------------------------------------------------------------------------
# Lifespan — connectivity checks on startup
# ---------------------------------------------------------------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Postgres
    try:
        with engine.connect() as conn:
            conn.execute(sqlalchemy.text("SELECT 1"))
        logger.info("[FeatureHub API] Postgres connection OK.")
    except Exception as exc:
        logger.error("[FeatureHub API] Postgres connection FAILED: %s", exc)
        raise RuntimeError("Cannot connect to Postgres on startup.") from exc

    # Redis
    try:
        redis_client.ping()
        logger.info("[FeatureHub API] Redis connection OK.")
    except Exception as exc:
        logger.error("[FeatureHub API] Redis connection FAILED: %s", exc)
        raise RuntimeError("Cannot connect to Redis on startup.") from exc

    yield  # server runs here

    logger.info("[FeatureHub API] Shutting down.")


# ---------------------------------------------------------------------------
# App
# ---------------------------------------------------------------------------
app = FastAPI(
    title="FeatureHub",
    description="Production-grade ML feature store API.",
    version="0.1.0",
    lifespan=lifespan,
)


# ---------------------------------------------------------------------------
# Global exception handlers
# ---------------------------------------------------------------------------
@app.exception_handler(ValueError)
async def value_error_handler(request: Request, exc: ValueError) -> JSONResponse:
    logger.warning("[FeatureHub API] Validation error: %s", exc)
    return JSONResponse(status_code=422, content={"detail": str(exc)})


@app.exception_handler(redis.ConnectionError)
async def redis_error_handler(request: Request, exc: redis.ConnectionError) -> JSONResponse:
    logger.error("[FeatureHub API] Redis unavailable: %s", exc)
    return JSONResponse(
        status_code=503,
        content={"detail": "Online store (Redis) is currently unavailable."},
    )


@app.exception_handler(sqlalchemy.exc.OperationalError)
async def postgres_error_handler(
    request: Request, exc: sqlalchemy.exc.OperationalError
) -> JSONResponse:
    logger.error("[FeatureHub API] Postgres unavailable: %s", exc)
    return JSONResponse(
        status_code=503,
        content={"detail": "Offline store (Postgres) is currently unavailable."},
    )


@app.exception_handler(Exception)
async def generic_error_handler(request: Request, exc: Exception) -> JSONResponse:
    logger.exception("[FeatureHub API] Unexpected error: %s", exc)
    return JSONResponse(
        status_code=500,
        content={"detail": "An unexpected error occurred. Check server logs."},
    )


# ---------------------------------------------------------------------------
# Request / Response models
# ---------------------------------------------------------------------------
class OnlineRequest(BaseModel):
    entity_ids: list[str]
    feature_names: list[str]

    @field_validator("entity_ids", "feature_names")
    @classmethod
    def must_not_be_empty(cls, v: list[str]) -> list[str]:
        if not v:
            raise ValueError("entity_ids and feature_names must not be empty.")
        return v


class HistoricalRequest(BaseModel):
    entity_ids: list[str]
    feature_names: list[str]
    as_of: datetime  # FastAPI parses ISO 8601 string automatically

    @field_validator("entity_ids", "feature_names")
    @classmethod
    def must_not_be_empty(cls, v: list[str]) -> list[str]:
        if not v:
            raise ValueError("entity_ids and feature_names must not be empty.")
        return v

    @field_validator("as_of")
    @classmethod
    def must_be_timezone_aware(cls, v: datetime) -> datetime:
        if v.tzinfo is None:
            raise ValueError(
                "as_of must be timezone-aware (e.g. '2024-01-01T00:00:00Z')."
            )
        return v


class FeatureResponse(BaseModel):
    data: dict[str, dict[str, object]]


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------
@app.post(
    "/features/online",
    response_model=FeatureResponse,
    summary="Fetch latest feature values from the online store (Redis).",
    status_code=200,
)
async def online_features(
    body: OnlineRequest,
    x_api_key: str = Header(...),
) -> FeatureResponse:
    await verify_api_key(x_api_key)
    data = get_online_features(
        entity_ids=body.entity_ids,
        feature_names=body.feature_names,
    )
    return FeatureResponse(data=data)


@app.post(
    "/features/historical",
    response_model=FeatureResponse,
    summary="Fetch point-in-time correct feature values from the offline store (Postgres).",
    status_code=200,
)
async def historical_features(
    body: HistoricalRequest,
    x_api_key: str = Header(...),
) -> FeatureResponse:
    await verify_api_key(x_api_key)
    data = get_historical_features(
        entity_ids=body.entity_ids,
        feature_names=body.feature_names,
        as_of=body.as_of,
    )
    return FeatureResponse(data=data)


# ---------------------------------------------------------------------------
# Health check (no auth — for load balancers / k8s probes)
# ---------------------------------------------------------------------------
@app.get("/health", include_in_schema=False)
async def health() -> dict:
    return {"status": "ok"}