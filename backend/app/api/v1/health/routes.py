from time import perf_counter

from fastapi import APIRouter, status
from fastapi.responses import JSONResponse

from app.core.config import get_settings
from app.database.mongodb import check_database
from app.utils.response import success_response

router = APIRouter(prefix="/health", tags=["System"])


@router.get(
    "",
    status_code=status.HTTP_200_OK,
    summary="Versioned health check",
    description=(
        "Returns server status, MongoDB status, application version, environment, and "
        "response time."
    ),
)
async def health_check_v1() -> JSONResponse:
    started = perf_counter()
    settings = get_settings()
    database_status = await check_database()
    status_code = (
        status.HTTP_200_OK
        if database_status == "connected"
        else status.HTTP_503_SERVICE_UNAVAILABLE
    )
    response_time_ms = round((perf_counter() - started) * 1000, 2)

    return success_response(
        message="Health check completed.",
        data={
            "server": "ok",
            "database": database_status,
            "version": settings.app_version,
            "environment": settings.environment,
            "response_time_ms": response_time_ms,
        },
        status_code=status_code,
    )
