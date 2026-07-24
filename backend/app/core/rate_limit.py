from dataclasses import dataclass, field
from time import monotonic

from app.utils.exceptions import ApplicationError


@dataclass
class RateLimitBucket:
    attempts: list[float] = field(default_factory=list)


class InMemoryRateLimiter:
    """Small per-process rate limiter for sensitive endpoints.

    This protects local and single-instance deployments. A shared store such as
    Redis can replace this interface for multi-instance production deployments.
    """

    def __init__(self, max_attempts: int, window_seconds: int, message: str) -> None:
        self.max_attempts = max_attempts
        self.window_seconds = window_seconds
        self.message = message
        self.buckets: dict[str, RateLimitBucket] = {}

    def check(self, key: str) -> None:
        now = monotonic()
        bucket = self.buckets.setdefault(key, RateLimitBucket())
        bucket.attempts = [
            attempt for attempt in bucket.attempts if now - attempt <= self.window_seconds
        ]
        if len(bucket.attempts) >= self.max_attempts:
            raise ApplicationError(self.message, status_code=429)
        bucket.attempts.append(now)


login_rate_limiter = InMemoryRateLimiter(
    max_attempts=8,
    window_seconds=60,
    message="Too many login attempts. Please try again later.",
)
public_lead_rate_limiter = InMemoryRateLimiter(
    max_attempts=5,
    window_seconds=60,
    message="Too many lead requests. Please try again later.",
)
