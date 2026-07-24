from motor.motor_asyncio import AsyncIOMotorDatabase
from pymongo import ASCENDING, DESCENDING, IndexModel

from app.core.logging import logger
from app.database.collections import CollectionName, get_collection


async def create_indexes(database: AsyncIOMotorDatabase) -> None:
    """Create MongoDB indexes required for scale and query performance.

    Users need a unique email index for account identity and a role index for
    future authorization screens. Leads need email, status, and created_at
    indexes because these fields drive lookup, dashboard counts, and list
    sorting. A full_name index supports search without changing the clean
    document schema.
    """

    users = get_collection(database, CollectionName.users)
    leads = get_collection(database, CollectionName.leads)
    existing_lead_indexes = await leads.index_information()
    legacy_email_index = existing_lead_indexes.get("leads_email_idx")
    if legacy_email_index is not None and not legacy_email_index.get("unique", False):
        await leads.drop_index("leads_email_idx")

    await users.create_indexes(
        [
            IndexModel([("email", ASCENDING)], unique=True, name="users_email_unique"),
            IndexModel([("role", ASCENDING)], name="users_role_idx"),
        ]
    )

    await leads.create_indexes(
        [
            IndexModel([("email", ASCENDING)], unique=True, name="leads_email_unique"),
            IndexModel([("full_name", ASCENDING)], name="leads_full_name_idx"),
            IndexModel([("status", ASCENDING)], name="leads_status_idx"),
            IndexModel([("created_at", DESCENDING)], name="leads_created_at_idx"),
            IndexModel(
                [("status", ASCENDING), ("created_at", DESCENDING)],
                name="leads_status_created_at_idx",
            ),
        ]
    )

    logger.info("Database indexes ensured")
