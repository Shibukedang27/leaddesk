import asyncio

from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.requests import Request
from starlette.responses import Response

from app.utils.response import error_response


class RequestTimeoutMiddleware(BaseHTTPMiddleware):
    """Bound request execution time so slow dependencies fail predictably."""

    def __init__(self, app, timeout_seconds: int) -> None:
        super().__init__(app)
        self.timeout_seconds = timeout_seconds

    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        try:
            return await asyncio.wait_for(call_next(request), timeout=self.timeout_seconds)
        except TimeoutError:
            return error_response(
                message="Request timed out. Please try again.",
                errors=None,
                status_code=504,
            )
