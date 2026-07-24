from enum import StrEnum

from motor.motor_asyncio import AsyncIOMotorCollection, AsyncIOMotorDatabase


class CollectionName(StrEnum):
    """MongoDB collections used by LeadDesk Mini."""

    users = "users"
    leads = "leads"


def get_collection(database: AsyncIOMotorDatabase, name: CollectionName) -> AsyncIOMotorCollection:
    """Return a typed MongoDB collection handle.

    Keeping collection access centralized makes future renames, multi-tenant
    routing, or collection-level instrumentation easier to introduce.
    """

    return database[name.value]
