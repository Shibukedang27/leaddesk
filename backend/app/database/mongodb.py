from dataclasses import dataclass

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from pymongo.errors import PyMongoError, ServerSelectionTimeoutError

from app.core.config import Settings, get_settings
from app.core.logging import logger
from app.database.indexes import create_indexes
from app.database.seed import ensure_admin_account
from app.utils.exceptions import DatabaseError


@dataclass(slots=True)
class DatabaseState:
    client: AsyncIOMotorClient | None = None
    status: str = "disconnected"
    last_error: str | None = None


class MongoConnectionManager:
    """Manage MongoDB connection lifecycle and health checks."""

    def __init__(self, settings: Settings) -> None:
        self.settings = settings
        self.state = DatabaseState()

    async def connect(self) -> None:
        """Create a MongoDB client and verify connectivity."""

        try:
            self.state.client = AsyncIOMotorClient(
                self.settings.mongodb_uri.get_secret_value(),
                maxPoolSize=50,
                minPoolSize=1,
                serverSelectionTimeoutMS=5000,
                connectTimeoutMS=5000,
                socketTimeoutMS=10000,
                retryWrites=True,
            )
            await self.state.client.admin.command("ping")
            database = self.state.client[self.settings.database_name]
            await create_indexes(database)
            await ensure_admin_account(database)
            self.state.status = "connected"
            self.state.last_error = None
            logger.info("Database connection established")
        except (PyMongoError, ServerSelectionTimeoutError) as exc:
            self.state.client = None
            self.state.status = "unavailable"
            self.state.last_error = exc.__class__.__name__
            logger.error("Database connection failed: %s", exc.__class__.__name__)

    async def disconnect(self) -> None:
        """Close MongoDB connections gracefully."""

        if self.state.client is not None:
            self.state.client.close()
        self.state.client = None
        self.state.status = "disconnected"
        logger.info("Database connection closed")

    async def health_check(self) -> str:
        """Return current database health and attempt one lightweight reconnect if needed."""

        if self.state.client is None:
            await self.connect()
            return self.state.status

        try:
            await self.state.client.admin.command("ping")
            self.state.status = "connected"
            self.state.last_error = None
        except PyMongoError as exc:
            self.state.status = "unavailable"
            self.state.last_error = exc.__class__.__name__
            logger.error("Database health check failed: %s", exc.__class__.__name__)
        return self.state.status

    def database(self) -> AsyncIOMotorDatabase:
        """Return the configured database or raise a safe service error."""

        if self.state.client is None:
            raise DatabaseError()
        return self.state.client[self.settings.database_name]


mongo_manager = MongoConnectionManager(get_settings())


async def connect_to_mongodb() -> None:
    await mongo_manager.connect()


async def close_mongodb_connection() -> None:
    await mongo_manager.disconnect()


async def check_database() -> str:
    return await mongo_manager.health_check()


def get_database() -> AsyncIOMotorDatabase:
    return mongo_manager.database()


def get_database_status() -> str:
    return mongo_manager.state.status
