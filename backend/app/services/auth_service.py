from datetime import UTC, datetime

from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.config import get_settings
from app.core.logging import logger
from app.core.security import create_access_token, verify_password
from app.schemas.auth import JWTResponse, UserLogin
from app.services.user_service import UserService
from app.utils.exceptions import AuthenticationError


class AuthService:
    """Authentication business service.

    Credentials are verified server-side against bcrypt hashes. Responses are
    intentionally generic on failure to avoid leaking whether an email exists.
    """

    def __init__(self, database: AsyncIOMotorDatabase) -> None:
        self.user_service = UserService(database)
        self.settings = get_settings()

    async def login(self, payload: UserLogin) -> JWTResponse:
        user_document = await self.user_service.get_auth_document_by_email(str(payload.email))
        if user_document is None:
            self.log_authentication_failure(str(payload.email))
            raise AuthenticationError("Email or password is incorrect.")

        if not verify_password(payload.password, user_document["password_hash"]):
            self.log_authentication_failure(str(payload.email))
            raise AuthenticationError("Email or password is incorrect.")

        if not user_document.get("is_active", False):
            logger.warning("Inactive account login blocked user_id=%s", str(user_document["_id"]))
            raise AuthenticationError("This account is inactive.")

        user_id = str(user_document["_id"])
        role = str(user_document["role"])
        token = create_access_token(subject=user_id, additional_claims={"role": role})
        await self.user_service.update_last_login(user_id, datetime.now(UTC))
        logger.info("Successful login user_id=%s role=%s", user_id, role)

        return JWTResponse(
            access_token=token,
            token_type="bearer",
            expires_in=self.settings.access_token_expire_minutes * 60,
            user=self.user_service.to_response(user_document),
        )

    def log_authentication_failure(self, email: str) -> None:
        logger.warning("Failed login email=%s", email.lower())
