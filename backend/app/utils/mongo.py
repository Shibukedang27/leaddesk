from datetime import UTC, datetime
from typing import Any

from bson import ObjectId

from app.utils.exceptions import ApplicationError


def now_utc() -> datetime:
    """Return a timezone-aware UTC timestamp for database records."""

    return datetime.now(UTC)


def parse_object_id(value: str) -> ObjectId:
    """Validate and parse MongoDB ObjectId strings."""

    if not ObjectId.is_valid(value):
        raise ApplicationError("Invalid resource id.", status_code=400)
    return ObjectId(value)


def serialize_document(document: dict[str, Any]) -> dict[str, Any]:
    """Convert MongoDB ObjectId fields into API-safe strings."""

    serialized = dict(document)
    if "_id" in serialized:
        serialized["id"] = str(serialized.pop("_id"))
    return serialized
