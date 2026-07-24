from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from pymongo.errors import PyMongoError
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.api.v1.router import api_v1_router
from app.core.config import get_settings
from app.core.logging import configure_logging, logger
from app.database.mongodb import (
    check_database,
    close_mongodb_connection,
    connect_to_mongodb,
    get_database_status,
)
from app.middleware.auth import AuthenticationContextMiddleware
from app.middleware.cors import configure_cors
from app.middleware.request_logging import RequestLoggingMiddleware
from app.middleware.security import SecurityHeadersMiddleware
from app.middleware.timeout import RequestTimeoutMiddleware
from app.utils.exceptions import (
    ApplicationError,
    application_error_handler,
    database_exception_handler,
    http_exception_handler,
    unhandled_exception_handler,
    validation_exception_handler,
)
from app.utils.response import success_response

configure_logging()
settings = get_settings()


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncIterator[None]:
    logger.info(
        "Application startup started name=%s version=%s", settings.app_name, settings.app_version
    )
    settings.validate_startup()
    await connect_to_mongodb()
    logger.info("Application startup completed database_status=%s", get_database_status())
    yield
    logger.info("Application shutdown started")
    await close_mongodb_connection()
    logger.info("Application shutdown completed")


app = FastAPI(
    title=settings.app_name,
    description=(
        "Scalable FastAPI backend foundation for LeadDesk Mini, a modern lead management CRM."
    ),
    version=settings.app_version,
    lifespan=lifespan,
    openapi_url="/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_tags=[
        {"name": "System", "description": "Application and infrastructure health endpoints."},
        {
            "name": "Authentication",
            "description": "Admin login, session inspection, and logout endpoints.",
        },
        {"name": "Leads", "description": "Lead capture and protected lead management endpoints."},
        {
            "name": "Dashboard",
            "description": "Authenticated lead analytics and activity endpoints.",
        },
    ],
)

configure_cors(app, settings)
app.add_middleware(TrustedHostMiddleware, allowed_hosts=settings.trusted_host_list)
app.add_middleware(GZipMiddleware, minimum_size=1000)
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(AuthenticationContextMiddleware)
app.add_middleware(RequestTimeoutMiddleware, timeout_seconds=settings.request_timeout_seconds)
app.add_middleware(RequestLoggingMiddleware)

app.add_exception_handler(ApplicationError, application_error_handler)
app.add_exception_handler(StarletteHTTPException, http_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(PyMongoError, database_exception_handler)
app.add_exception_handler(Exception, unhandled_exception_handler)

app.include_router(api_v1_router)


@app.get(
    "/",
    tags=["System"],
    summary="API root",
    description="Returns API metadata using the standard response envelope.",
)
async def root() -> JSONResponse:
    return success_response(
        message="LeadDesk Mini API is running.",
        data={
            "name": settings.app_name,
            "version": settings.app_version,
            "environment": settings.environment,
            "api_version": "v1",
        },
    )


@app.get(
    "/health",
    tags=["System"],
    summary="Health check",
    description="Returns application health and MongoDB connectivity status.",
)
async def health_check() -> JSONResponse:
    from time import perf_counter

    started = perf_counter()
    database_status = await check_database()
    status_code = 200 if database_status == "connected" else 503
    return success_response(
        message="Health check completed.",
        data={
            "server": "ok",
            "database": database_status,
            "version": settings.app_version,
            "environment": settings.environment,
            "response_time_ms": round((perf_counter() - started) * 1000, 2),
        },
        status_code=status_code,
    )
