from collections.abc import Awaitable, Callable

from fastapi import Request, Response


class AuthenticationContextMiddleware:
    """Reserve request authentication context without implementing auth behavior."""

    def __init__(self, app: Callable[[Request], Awaitable[Response]]) -> None:
        self.app = app

    async def __call__(self, scope: dict, receive: Callable, send: Callable) -> None:
        if scope["type"] == "http":
            scope.setdefault("state", {})
        await self.app(scope, receive, send)
