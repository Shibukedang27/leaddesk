from fastapi import Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pymongo.errors import PyMongoError
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.core.logging import logger
from app.utils.response import error_response


class ApplicationError(Exception):
    """Base application exception with a safe public message."""

    def __init__(
        self, message: str, status_code: int = status.HTTP_400_BAD_REQUEST, errors: object = None
    ) -> None:
        self.message = message
        self.status_code = status_code
        self.errors = errors
        super().__init__(message)


class AuthenticationError(ApplicationError):
    """Raised when authentication cannot be completed."""

    def __init__(self, message: str = "Authentication failed.") -> None:
        super().__init__(message=message, status_code=status.HTTP_401_UNAUTHORIZED)


class AuthorizationError(ApplicationError):
    """Raised when an authenticated user lacks required permissions."""

    def __init__(
        self, message: str = "You do not have permission to access this resource."
    ) -> None:
        super().__init__(message=message, status_code=status.HTTP_403_FORBIDDEN)


class DatabaseError(ApplicationError):
    """Raised when the database is unavailable."""

    def __init__(self, message: str = "Database is unavailable.") -> None:
        super().__init__(message=message, status_code=status.HTTP_503_SERVICE_UNAVAILABLE)


class NotFoundError(ApplicationError):
    """Raised when a requested resource does not exist."""

    def __init__(self, message: str = "Resource not found.") -> None:
        super().__init__(message=message, status_code=status.HTTP_404_NOT_FOUND)


class ConflictError(ApplicationError):
    """Raised when a request conflicts with persisted data."""

    def __init__(self, message: str = "Resource already exists.") -> None:
        super().__init__(message=message, status_code=status.HTTP_409_CONFLICT)


async def application_error_handler(_: Request, exc: ApplicationError) -> JSONResponse:
    logger.warning("Application error: %s", exc.message)
    return error_response(message=exc.message, errors=exc.errors, status_code=exc.status_code)


async def http_exception_handler(_: Request, exc: StarletteHTTPException) -> JSONResponse:
    message = str(exc.detail) if exc.detail else "Request failed."
    return error_response(message=message, errors=None, status_code=exc.status_code)


async def validation_exception_handler(_: Request, exc: RequestValidationError) -> JSONResponse:
    safe_errors = []
    for error in exc.errors():
        safe_error = {
            "type": error.get("type"),
            "loc": error.get("loc"),
            "msg": error.get("msg"),
        }
        safe_errors.append(safe_error)

    return error_response(
        message="Validation failed.",
        errors=safe_errors,
        status_code=422,
    )


async def database_exception_handler(_: Request, exc: PyMongoError) -> JSONResponse:
    logger.error("Database error: %s", exc.__class__.__name__)
    return error_response(
        message="Database operation failed.",
        errors=None,
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
    )


async def unhandled_exception_handler(_: Request, exc: Exception) -> JSONResponse:
    logger.exception("Unhandled server error: %s", exc.__class__.__name__)
    return error_response(
        message="Internal server error.",
        errors=None,
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
    )
