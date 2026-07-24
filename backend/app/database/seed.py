from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.config import get_settings
from app.core.logging import logger
from app.core.security import hash_password
from app.services.user_service import UserService


async def ensure_admin_account(database: AsyncIOMotorDatabase) -> None:
    """Seed the single required admin account from environment variables.

    No credentials are hardcoded. Production deployments must provide
    ADMIN_EMAIL and ADMIN_PASSWORD; when absent, startup continues without
    creating an account so secrets are never invented in code.
    """

    settings = get_settings()
    if settings.admin_email is None or settings.admin_password is None:
        logger.warning("Admin account not seeded because ADMIN_EMAIL or ADMIN_PASSWORD is missing")
        return

    await UserService(database).ensure_admin_user(
        email=settings.admin_email,
        password_hash=hash_password(settings.admin_password.get_secret_value()),
        full_name=settings.admin_full_name,
    )
    logger.info("Admin account ensured")
