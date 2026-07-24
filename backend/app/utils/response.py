from datetime import UTC, datetime
from typing import Any

from fastapi.responses import JSONResponse


def utc_timestamp() -> str:
    return datetime.now(UTC).isoformat()


def success_response(
    message: str,
    data: Any = None,
    pagination: Any = None,
    status_code: int = 200,
) -> JSONResponse:
    content = {
        "success": True,
        "message": message,
        "data": data,
        "timestamp": utc_timestamp(),
    }
    if pagination is not None:
        content["pagination"] = pagination
    return JSONResponse(
        status_code=status_code,
        content=content,
    )


def error_response(
    message: str,
    errors: Any = None,
    status_code: int = 500,
) -> JSONResponse:
    return JSONResponse(
        status_code=status_code,
        content={
            "success": False,
            "message": message,
            "errors": errors,
            "timestamp": utc_timestamp(),
        },
    )
