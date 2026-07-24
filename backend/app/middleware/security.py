from collections.abc import Awaitable, Callable

from fastapi import Request, Response


class SecurityHeadersMiddleware:
    """Apply secure response headers across the API."""

    def __init__(self, app: Callable[[Request], Awaitable[Response]]) -> None:
        self.app = app

    async def __call__(self, scope: dict, receive: Callable, send: Callable) -> None:
        async def send_with_headers(message: dict) -> None:
            if message["type"] == "http.response.start":
                headers = message.setdefault("headers", [])
                headers.extend(
                    [
                        (b"x-content-type-options", b"nosniff"),
                        (b"x-frame-options", b"DENY"),
                        (b"strict-transport-security", b"max-age=31536000; includeSubDomains"),
                        (b"referrer-policy", b"strict-origin-when-cross-origin"),
                        (b"permissions-policy", b"camera=(), microphone=(), geolocation=()"),
                        (b"cross-origin-opener-policy", b"same-origin"),
                    ]
                )
            await send(message)

        await self.app(scope, receive, send_with_headers)
