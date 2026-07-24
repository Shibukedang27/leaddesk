from collections.abc import Iterable

from fastapi import Depends, Request
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.logging import logger
from app.core.security import decode_access_token
from app.database.dependencies import database_dependency
from app.models.user import UserRole
from app.schemas.auth import UserResponse
from app.services.user_service import UserService
from app.utils.exceptions import AuthenticationError, AuthorizationError

bearer_scheme = HTTPBearer(auto_error=False)


async def current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    database: AsyncIOMotorDatabase = Depends(database_dependency),
) -> UserResponse:
    """Validate bearer token and return the authenticated user."""

    if credentials is None or credentials.scheme.lower() != "bearer":
        raise AuthenticationError("Authentication is required.")

    payload = decode_access_token(credentials.credentials)
    user = await UserService(database).get_response_by_id(payload["sub"])
    if not user.is_active:
        raise AuthenticationError("This account is inactive.")
    return user


def require_roles(allowed_roles: Iterable[UserRole]):
    """Create a reusable role guard dependency."""

    allowed = {role.value for role in allowed_roles}

    async def role_guard(user: UserResponse = Depends(current_user)) -> UserResponse:
        if user.role not in allowed:
            logger.warning("Forbidden access user_id=%s role=%s", user.id, user.role)
            raise AuthorizationError()
        return user

    return role_guard


async def require_admin(
    user: UserResponse = Depends(require_roles([UserRole.admin])),
) -> UserResponse:
    return user


def login_rate_limit_key(request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"
