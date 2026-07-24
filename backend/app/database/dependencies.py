from collections.abc import AsyncIterator

from motor.motor_asyncio import AsyncIOMotorDatabase

from app.database.mongodb import get_database


async def database_dependency() -> AsyncIterator[AsyncIOMotorDatabase]:
    """Provide a MongoDB database instance through FastAPI dependency injection."""

    yield get_database()
