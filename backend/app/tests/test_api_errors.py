import asyncio
import json

from fastapi import Request
from fastapi.testclient import TestClient
from pymongo.errors import PyMongoError

from app.api.v1.health import routes as health_routes
from app.database.dependencies import database_dependency
from app.main import app
from app.tests.helpers.fake_mongo import FakeCollection, FakeDatabase
from app.utils.exceptions import database_exception_handler, unhandled_exception_handler


def client_with_database() -> TestClient:
    app.dependency_overrides[database_dependency] = lambda: FakeDatabase(
        {"users": FakeCollection(), "leads": FakeCollection()}
    )
    return TestClient(app)


def clear_overrides() -> None:
    app.dependency_overrides.clear()


def test_protected_leads_route_requires_authentication() -> None:
    client = client_with_database()

    try:
        response = client.get("/api/v1/leads")
    finally:
        clear_overrides()

    assert response.status_code == 401
    body = response.json()
    assert body["success"] is False
    assert body["message"] == "Authentication is required."


def test_public_lead_validation_errors_use_standard_envelope() -> None:
    client = client_with_database()

    try:
        response = client.post(
            "/api/v1/leads/public",
            json={"full_name": "A", "email": "bad-email", "budget": "", "message": "short"},
        )
    finally:
        clear_overrides()

    assert response.status_code == 422
    body = response.json()
    assert body["success"] is False
    assert body["message"] == "Validation failed."
    assert body["errors"]


def test_not_found_uses_standard_error_envelope() -> None:
    client = TestClient(app)

    response = client.get("/api/v1/missing")

    assert response.status_code == 404
    assert response.json()["success"] is False


def test_versioned_health_reports_connected_database(monkeypatch) -> None:
    async def connected() -> str:
        return "connected"

    monkeypatch.setattr(health_routes, "check_database", connected)
    client = TestClient(app)

    response = client.get("/api/v1/health")

    assert response.status_code == 200
    body = response.json()
    assert body["success"] is True
    assert body["data"]["database"] == "connected"
    assert body["data"]["server"] == "ok"


def test_versioned_health_returns_503_when_database_is_unavailable(monkeypatch) -> None:
    async def unavailable() -> str:
        return "unavailable"

    monkeypatch.setattr(health_routes, "check_database", unavailable)
    client = TestClient(app)

    response = client.get("/api/v1/health")

    assert response.status_code == 503
    assert response.json()["data"]["database"] == "unavailable"


def test_unhandled_exception_handler_hides_stack_traces() -> None:
    response = asyncio.run(
        unhandled_exception_handler(Request({"type": "http"}), RuntimeError("private failure"))
    )

    body = json.loads(response.body)
    assert response.status_code == 500
    assert body["message"] == "Internal server error."
    assert "private failure" not in json.dumps(body)


def test_database_exception_handler_returns_safe_failure() -> None:
    response = asyncio.run(
        database_exception_handler(Request({"type": "http"}), PyMongoError("connection lost"))
    )

    body = json.loads(response.body)
    assert response.status_code == 503
    assert body["message"] == "Database operation failed."
