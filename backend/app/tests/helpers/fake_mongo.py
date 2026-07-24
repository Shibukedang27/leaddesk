from __future__ import annotations

import copy
import re
from dataclasses import dataclass
from typing import Any

from bson import ObjectId
from pymongo import ASCENDING, DESCENDING
from pymongo.errors import DuplicateKeyError, PyMongoError


@dataclass(slots=True)
class InsertOneResult:
    inserted_id: ObjectId


class FakeCursor:
    def __init__(self, documents: list[dict[str, Any]]) -> None:
        self._documents = documents
        self._index = 0

    def sort(
        self, key_or_list: str | list[tuple[str, int]], direction: int | None = None
    ) -> FakeCursor:
        sort_fields = (
            [(key_or_list, direction or ASCENDING)] if isinstance(key_or_list, str) else key_or_list
        )
        for key, order in reversed(sort_fields):
            self._documents.sort(
                key=lambda document: document.get(key), reverse=order == DESCENDING
            )
        return self

    def skip(self, count: int) -> FakeCursor:
        self._documents = self._documents[count:]
        return self

    def limit(self, count: int) -> FakeCursor:
        self._documents = self._documents[:count]
        return self

    def __aiter__(self) -> FakeCursor:
        return self

    async def __anext__(self) -> dict[str, Any]:
        if self._index >= len(self._documents):
            raise StopAsyncIteration
        document = self._documents[self._index]
        self._index += 1
        return copy.deepcopy(document)


class FakeCollection:
    def __init__(
        self, documents: list[dict[str, Any]] | None = None, fail_operations: bool = False
    ) -> None:
        self.documents = documents or []
        self.fail_operations = fail_operations

    async def insert_one(self, document: dict[str, Any]) -> InsertOneResult:
        self._raise_if_failed()
        if any(existing["email"] == document["email"] for existing in self.documents):
            raise DuplicateKeyError("duplicate email")
        inserted = copy.deepcopy(document)
        inserted["_id"] = ObjectId()
        self.documents.append(inserted)
        return InsertOneResult(inserted_id=inserted["_id"])

    async def find_one(
        self, filters: dict[str, Any], projection: dict[str, int] | None = None
    ) -> dict[str, Any] | None:
        self._raise_if_failed()
        for document in self.documents:
            if self._matches(document, filters):
                return copy.deepcopy(self._project(document, projection))
        return None

    async def count_documents(self, filters: dict[str, Any]) -> int:
        self._raise_if_failed()
        return sum(1 for document in self.documents if self._matches(document, filters))

    def find(self, filters: dict[str, Any], projection: dict[str, int] | None = None) -> FakeCursor:
        self._raise_if_failed()
        documents = [
            copy.deepcopy(self._project(document, projection))
            for document in self.documents
            if self._matches(document, filters)
        ]
        return FakeCursor(documents)

    async def find_one_and_update(
        self,
        filters: dict[str, Any],
        update: dict[str, dict[str, Any]],
        projection: dict[str, int] | None = None,
        return_document: Any = None,
    ) -> dict[str, Any] | None:
        self._raise_if_failed()
        _ = return_document
        for index, document in enumerate(self.documents):
            if self._matches(document, filters):
                updated = {**document, **update.get("$set", {})}
                self.documents[index] = updated
                return copy.deepcopy(self._project(updated, projection))
        return None

    def _raise_if_failed(self) -> None:
        if self.fail_operations:
            raise PyMongoError("simulated database failure")

    def _matches(self, document: dict[str, Any], filters: dict[str, Any]) -> bool:
        for key, expected in filters.items():
            if key == "$or":
                return any(self._matches(document, option) for option in expected)
            if isinstance(expected, dict) and "$regex" in expected:
                flags = re.IGNORECASE if expected.get("$options") == "i" else 0
                if re.search(str(expected["$regex"]), str(document.get(key, "")), flags) is None:
                    return False
                continue
            if document.get(key) != expected:
                return False
        return True

    def _project(
        self, document: dict[str, Any], projection: dict[str, int] | None
    ) -> dict[str, Any]:
        if projection is None:
            return document
        projected = {"_id": document["_id"]}
        for key, include in projection.items():
            if include and key in document:
                projected[key] = document[key]
        return projected


class FakeDatabase:
    def __init__(self, collections: dict[str, FakeCollection]) -> None:
        self.collections = collections

    def __getitem__(self, name: str) -> FakeCollection:
        return self.collections[name]
