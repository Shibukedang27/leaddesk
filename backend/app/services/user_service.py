from datetime import datetime
from typing import Any

from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorCollection, AsyncIOMotorDatabase
from pymongo.errors import DuplicateKeyError, PyMongoError

from app.core.logging import logger
from app.database.collections import CollectionName, get_collection
from app.models.user import UserRole
from app.schemas.auth import UserResponse
from app.utils.exceptions import ConflictError, DatabaseError, NotFoundError
from app.utils.mongo import now_utc, parse_object_id, serialize_document

USER_PUBLIC_PROJECTION = {
    "email": 1,
    "full_name": 1,
    "role": 1,
    "is_active": 1,
}

USER_AUTH_PROJECTION = {
    "email": 1,
    "password_hash": 1,
    "full_name": 1,
    "role": 1,
    "is_active": 1,
}


class UserService:
    """Business service for user persistence and safe user serialization."""

    def __init__(self, database: AsyncIOMotorDatabase) -> None:
        self.collection: AsyncIOMotorCollection = get_collection(database, CollectionName.users)

    async def get_response_by_id(self, user_id: str) -> UserResponse:
        document = await self._find_public_by_id(parse_object_id(user_id))
        if document is None:
            raise NotFoundError("User not found.")
        return self.to_response(document)

    async def get_auth_document_by_email(self, email: str) -> dict[str, Any] | None:
        try:
            return await self.collection.find_one({"email": email.lower()}, USER_AUTH_PROJECTION)
        except PyMongoError as exc:
            logger.error("Database failure while loading auth user: %s", exc.__class__.__name__)
            raise DatabaseError("Could not validate credentials.") from exc

    async def update_last_login(self, user_id: str, login_time: datetime | None = None) -> None:
        try:
            await self.collection.update_one(
                {"_id": parse_object_id(user_id)},
                {"$set": {"last_login": login_time or now_utc(), "updated_at": now_utc()}},
            )
        except PyMongoError as exc:
            logger.error("Database failure while updating last login: %s", exc.__class__.__name__)
            raise DatabaseError("Could not update login metadata.") from exc

    async def ensure_admin_user(self, email: str, password_hash: str, full_name: str) -> None:
        """Create the environment-provided admin account if it does not exist."""

        now = now_utc()
        document = {
            "email": email.lower(),
            "password_hash": password_hash,
            "full_name": full_name,
            "role": UserRole.admin,
            "is_active": True,
            "created_at": now,
            "updated_at": now,
            "last_login": None,
        }
        try:
            await self.collection.update_one(
                {"email": document["email"]},
                {"$setOnInsert": document},
                upsert=True,
            )
        except DuplicateKeyError as exc:
            raise self.translate_duplicate_email(exc) from exc
        except PyMongoError as exc:
            logger.error("Database failure while ensuring admin user: %s", exc.__class__.__name__)
            raise DatabaseError("Could not prepare admin account.") from exc

    async def ensure_unique_email(self, email: str) -> None:
        try:
            existing = await self.collection.find_one({"email": email.lower()}, {"_id": 1})
        except PyMongoError as exc:
            logger.error("Database failure while checking user email: %s", exc.__class__.__name__)
            raise DatabaseError("Could not validate user email.") from exc

        if existing is not None:
            raise ConflictError("A user with this email already exists.")

    def to_response(self, document: dict[str, Any]) -> UserResponse:
        return UserResponse(**serialize_document(document))

    def translate_duplicate_email(self, _: DuplicateKeyError) -> ConflictError:
        logger.warning("Duplicate user email rejected")
        return ConflictError("A user with this email already exists.")

    async def _find_public_by_id(self, user_id: ObjectId) -> dict[str, Any] | None:
        try:
            return await self.collection.find_one({"_id": user_id}, USER_PUBLIC_PROJECTION)
        except PyMongoError as exc:
            logger.error("Database failure while loading user: %s", exc.__class__.__name__)
            raise DatabaseError("Could not load user.") from exc
