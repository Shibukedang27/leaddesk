from datetime import UTC, datetime, timedelta
from typing import Any

import jwt
from passlib.context import CryptContext

from app.core.config import get_settings
from app.core.logging import logger
from app.utils.exceptions import AuthenticationError

password_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    """Hash a password using bcrypt. Callers must never log the input."""

    return password_context.hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    """Verify a plaintext password against a bcrypt hash."""

    return password_context.verify(password, password_hash)


def create_access_token(subject: str, additional_claims: dict[str, Any] | None = None) -> str:
    """Create a signed JWT access token.

    JWT keeps the API stateless and scales well for distributed deployments.
    Bcrypt is used for passwords because it is intentionally slow, salted, and
    battle-tested against brute-force attacks.
    """

    settings = get_settings()
    issued_at = datetime.now(UTC)
    expires_at = issued_at + timedelta(minutes=settings.access_token_expire_minutes)
    payload: dict[str, Any] = {
        "sub": subject,
        "exp": expires_at,
        "iat": issued_at,
        "type": "access",
    }
    if additional_claims:
        payload.update(additional_claims)
    return jwt.encode(
        payload,
        settings.jwt_secret.get_secret_value(),
        algorithm=settings.jwt_algorithm,
    )


def decode_access_token(token: str) -> dict[str, Any]:
    """Decode and validate a JWT access token."""

    settings = get_settings()
    try:
        payload = jwt.decode(
            token,
            settings.jwt_secret.get_secret_value(),
            algorithms=[settings.jwt_algorithm],
        )
    except jwt.ExpiredSignatureError as exc:
        logger.warning("Expired token rejected")
        raise AuthenticationError("Your session has expired. Please sign in again.") from exc
    except jwt.InvalidTokenError as exc:
        logger.warning("Invalid token rejected")
        raise AuthenticationError("Invalid authentication token.") from exc

    if not isinstance(payload.get("sub"), str) or not payload["sub"]:
        logger.warning("Token rejected because subject is invalid")
        raise AuthenticationError("Invalid token subject.")
    if payload.get("type") != "access":
        logger.warning("Token rejected because type is invalid")
        raise AuthenticationError("Invalid token type.")
    if not isinstance(payload.get("role"), str) or not payload["role"]:
        logger.warning("Token rejected because role is invalid")
        raise AuthenticationError("Invalid token role.")
    return payload
