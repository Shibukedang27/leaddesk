import math
import re
from typing import Any

from motor.motor_asyncio import AsyncIOMotorCollection, AsyncIOMotorDatabase
from pymongo import ASCENDING, DESCENDING, ReturnDocument
from pymongo.errors import DuplicateKeyError, ExecutionTimeout, PyMongoError

from app.core.logging import logger
from app.database.collections import CollectionName, get_collection
from app.models.lead import LeadStatus
from app.schemas.dashboard import DashboardResponse, LatestActivity
from app.schemas.lead import (
    LeadCreate,
    LeadListResponse,
    LeadResponse,
    LeadSort,
    LeadUpdate,
    PaginationMeta,
)
from app.utils.exceptions import ApplicationError, ConflictError, DatabaseError, NotFoundError
from app.utils.mongo import now_utc, parse_object_id, serialize_document

LEAD_PROJECTION = {
    "full_name": 1,
    "email": 1,
    "budget": 1,
    "message": 1,
    "status": 1,
    "source": 1,
    "notes": 1,
    "created_at": 1,
    "updated_at": 1,
}


class LeadService:
    """Business service for lead lifecycle operations.

    Routes delegate to this service so validation, persistence, pagination,
    search, sorting, logging, and error translation stay in one maintainable
    layer. All database work is async to avoid blocking FastAPI workers.
    """

    def __init__(self, database: AsyncIOMotorDatabase) -> None:
        self.collection: AsyncIOMotorCollection = get_collection(database, CollectionName.leads)

    async def create_lead(self, payload: LeadCreate) -> LeadResponse:
        now = now_utc()
        document = {
            "full_name": payload.full_name,
            "email": str(payload.email).lower(),
            "budget": payload.budget,
            "message": payload.message,
            "status": LeadStatus.new,
            "source": payload.source,
            "notes": payload.notes,
            "created_at": now,
            "updated_at": now,
        }

        try:
            result = await self.collection.insert_one(document)
            created = await self.collection.find_one({"_id": result.inserted_id}, LEAD_PROJECTION)
        except DuplicateKeyError as exc:
            raise ConflictError("A record with this email already exists.") from exc
        except (ExecutionTimeout, PyMongoError) as exc:
            logger.error("Database failure while creating lead: %s", exc.__class__.__name__)
            raise DatabaseError("Could not create lead at this time.") from exc

        if created is None:
            raise DatabaseError("Lead was created but could not be loaded.")

        logger.info("Lead created lead_id=%s", str(result.inserted_id))
        return self._to_response(created)

    async def get_all_leads(
        self,
        page: int,
        limit: int,
        search: str | None = None,
        status: LeadStatus | None = None,
        sort: LeadSort = LeadSort.newest,
    ) -> LeadListResponse:
        filters = self._build_filters(search=search, status=status)
        skip = (page - 1) * limit

        try:
            total = await self.collection.count_documents(filters)
            cursor = (
                self.collection.find(filters, LEAD_PROJECTION)
                .sort(self._sort_expression(sort))
                .skip(skip)
                .limit(limit)
            )
            items = [self._to_response(document) async for document in cursor]
        except (ExecutionTimeout, PyMongoError) as exc:
            logger.error("Database failure while listing leads: %s", exc.__class__.__name__)
            raise DatabaseError("Could not load leads.") from exc

        if search:
            logger.info("Lead search executed has_query=true result_count=%s", total)

        return LeadListResponse(
            items=items,
            pagination=self._pagination(page=page, limit=limit, total=total),
        )

    async def get_lead(self, lead_id: str) -> LeadResponse:
        object_id = parse_object_id(lead_id)
        try:
            document = await self.collection.find_one({"_id": object_id}, LEAD_PROJECTION)
        except PyMongoError as exc:
            logger.error("Database failure while loading lead: %s", exc.__class__.__name__)
            raise DatabaseError("Could not load lead.") from exc

        if document is None:
            raise NotFoundError("Lead not found.")
        return self._to_response(document)

    async def update_status(self, lead_id: str, payload: LeadUpdate) -> LeadResponse:
        object_id = parse_object_id(lead_id)
        update_fields: dict[str, Any] = {"updated_at": now_utc()}
        if payload.status is not None:
            update_fields["status"] = payload.status
        if payload.notes is not None:
            update_fields["notes"] = payload.notes

        if len(update_fields) == 1:
            raise ApplicationError("No lead update fields were provided.", status_code=400)

        try:
            document = await self.collection.find_one_and_update(
                {"_id": object_id},
                {"$set": update_fields},
                projection=LEAD_PROJECTION,
                return_document=ReturnDocument.AFTER,
            )
        except PyMongoError as exc:
            logger.error("Database failure while updating lead: %s", exc.__class__.__name__)
            raise DatabaseError("Could not update lead.") from exc

        if document is None:
            raise NotFoundError("Lead not found.")

        logger.info("Lead updated lead_id=%s", lead_id)
        return self._to_response(document)

    async def count_leads(self, status: LeadStatus | None = None) -> int:
        filters = {"status": status} if status else {}
        try:
            return await self.collection.count_documents(filters)
        except PyMongoError as exc:
            logger.error("Database failure while counting leads: %s", exc.__class__.__name__)
            raise DatabaseError("Could not count leads.") from exc

    async def dashboard_summary(self) -> DashboardResponse:
        try:
            total_leads = await self.collection.count_documents({})
            new_leads = await self.collection.count_documents({"status": LeadStatus.new})
            contacted = await self.collection.count_documents({"status": LeadStatus.contacted})
            closed = await self.collection.count_documents({"status": LeadStatus.closed})

            recent_cursor = (
                self.collection.find({}, LEAD_PROJECTION).sort("created_at", DESCENDING).limit(5)
            )
            activity_cursor = (
                self.collection.find({}, LEAD_PROJECTION).sort("updated_at", DESCENDING).limit(5)
            )

            recent_leads = [self._to_response(document) async for document in recent_cursor]
            latest_activity = [
                LatestActivity(
                    lead_id=str(document["_id"]),
                    full_name=document["full_name"],
                    status=document["status"],
                    occurred_at=document["updated_at"],
                )
                async for document in activity_cursor
            ]
        except PyMongoError as exc:
            logger.error("Database failure while building dashboard: %s", exc.__class__.__name__)
            raise DatabaseError("Could not load dashboard summary.") from exc

        return DashboardResponse(
            total_leads=total_leads,
            new_leads=new_leads,
            contacted=contacted,
            closed=closed,
            recent_leads=recent_leads,
            latest_activity=latest_activity,
        )

    def _build_filters(self, search: str | None, status: LeadStatus | None) -> dict[str, Any]:
        filters: dict[str, Any] = {}
        if status is not None:
            filters["status"] = status
        if search:
            escaped = re.escape(search.strip())
            if escaped:
                filters["$or"] = [
                    {"full_name": {"$regex": escaped, "$options": "i"}},
                    {"email": {"$regex": escaped, "$options": "i"}},
                ]
        return filters

    def _sort_expression(self, sort: LeadSort) -> list[tuple[str, int]]:
        sort_map: dict[LeadSort, list[tuple[str, int]]] = {
            LeadSort.newest: [("created_at", DESCENDING)],
            LeadSort.oldest: [("created_at", ASCENDING)],
            LeadSort.budget: [("budget", ASCENDING), ("created_at", DESCENDING)],
            LeadSort.alphabetical: [("full_name", ASCENDING)],
            LeadSort.status: [("status", ASCENDING), ("created_at", DESCENDING)],
        }
        return sort_map[sort]

    def _pagination(self, page: int, limit: int, total: int) -> PaginationMeta:
        pages = math.ceil(total / limit) if total else 0
        return PaginationMeta(
            page=page,
            limit=limit,
            total=total,
            pages=pages,
            next=page + 1 if page < pages else None,
            previous=page - 1 if page > 1 and pages > 0 else None,
        )

    def _to_response(self, document: dict[str, Any]) -> LeadResponse:
        return LeadResponse(**serialize_document(document))
