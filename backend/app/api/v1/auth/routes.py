from fastapi import APIRouter, Depends, Request, status
from fastapi.responses import JSONResponse
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.auth import current_user, login_rate_limit_key
from app.core.logging import logger
from app.core.rate_limit import login_rate_limiter
from app.database.dependencies import database_dependency
from app.schemas.auth import UserLogin, UserResponse
from app.services.auth_service import AuthService
from app.utils.response import success_response

router = APIRouter(prefix="/auth", tags=["Authentication"])


def get_auth_service(database: AsyncIOMotorDatabase = Depends(database_dependency)) -> AuthService:
    return AuthService(database)


@router.post(
    "/login",
    status_code=status.HTTP_200_OK,
    summary="Admin login",
    description=(
        "Validates admin credentials, verifies bcrypt password hash, and returns a signed "
        "JWT access token."
    ),
)
async def login(
    payload: UserLogin,
    request: Request,
    auth_service: AuthService = Depends(get_auth_service),
) -> JSONResponse:
    login_rate_limiter.check(login_rate_limit_key(request))
    session = await auth_service.login(payload)
    return success_response(
        message="Login successful.",
        data=session.model_dump(mode="json"),
    )


@router.get(
    "/me",
    status_code=status.HTTP_200_OK,
    summary="Current user",
    description="Validates the bearer token and returns the authenticated user.",
)
async def me(user: UserResponse = Depends(current_user)) -> JSONResponse:
    return success_response(message="Authenticated user loaded.", data=user.model_dump(mode="json"))


@router.post(
    "/logout",
    status_code=status.HTTP_200_OK,
    summary="Logout",
    description="Stateless logout acknowledgement. Clients must delete their stored token.",
)
async def logout(user: UserResponse = Depends(current_user)) -> JSONResponse:
    logger.info("Logout user_id=%s", user.id)
    return success_response(message="Logout successful.", data={"logged_out": True})
