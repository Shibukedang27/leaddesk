from __future__ import annotations

import asyncio
from datetime import UTC, datetime, timedelta

from bson import ObjectId
from pymongo.errors import PyMongoError

from app.models.lead import LeadStatus
from app.schemas.lead import LeadCreate, LeadSort, LeadUpdate
from app.services.lead_service import LeadService
from app.tests.helpers.fake_mongo import FakeCollection, FakeDatabase
from app.utils.exceptions import ApplicationError, ConflictError, DatabaseError, NotFoundError


def run(coro):
    return asyncio.run(coro)


def lead_document(
    *,
    name: str,
    email: str,
    status: LeadStatus = LeadStatus.new,
    created_at: datetime | None = None,
    budget: str = "$5k-$15k",
) -> dict:
    now = created_at or datetime.now(UTC)
    return {
        "_id": ObjectId(),
        "full_name": name,
        "email": email,
        "budget": budget,
        "message": "A qualified CRM inquiry with enough context.",
        "status": status,
        "source": "website",
        "notes": None,
        "created_at": now,
        "updated_at": now,
    }


def service_with(documents: list[dict] | None = None, fail_operations: bool = False) -> LeadService:
    return LeadService(FakeDatabase({"leads": FakeCollection(documents, fail_operations)}))


def create_payload(email: str = "Maya@Company.com") -> LeadCreate:
    return LeadCreate(
        full_name="Maya Kapoor",
        email=email,
        budget="$5k-$15k",
        message="We need better CRM routing and follow-up visibility.",
        source="landing",
    )


def test_create_lead_normalizes_email_and_assigns_new_status() -> None:
    service = service_with()

    result = run(service.create_lead(create_payload()))

    assert result.email == "maya@company.com"
    assert result.status == LeadStatus.new
    assert result.source == "landing"


def test_create_lead_rejects_duplicate_email() -> None:
    service = service_with([lead_document(name="Maya Kapoor", email="maya@company.com")])

    try:
        run(service.create_lead(create_payload("maya@company.com")))
    except ConflictError as exc:
        assert exc.status_code == 409
    else:
        raise AssertionError("Expected duplicate email conflict")


def test_list_leads_supports_case_insensitive_search_sorting_and_pagination() -> None:
    now = datetime.now(UTC)
    documents = [
        lead_document(
            name="Maya Kapoor", email="maya@company.com", created_at=now - timedelta(days=3)
        ),
        lead_document(
            name="Noah Smith", email="noah@company.com", created_at=now - timedelta(days=2)
        ),
        lead_document(
            name="Amara Lee", email="amara@example.com", created_at=now - timedelta(days=1)
        ),
    ]
    service = service_with(documents)

    result = run(
        service.get_all_leads(page=1, limit=1, search="COMPANY", sort=LeadSort.alphabetical)
    )

    assert result.pagination.total == 2
    assert result.pagination.pages == 2
    assert result.pagination.next == 2
    assert result.items[0].full_name == "Maya Kapoor"


def test_list_leads_filters_by_status_and_sorts_by_oldest() -> None:
    now = datetime.now(UTC)
    service = service_with(
        [
            lead_document(
                name="Closed Later",
                email="closed-later@example.com",
                status=LeadStatus.closed,
                created_at=now,
            ),
            lead_document(
                name="Closed Earlier",
                email="closed-earlier@example.com",
                status=LeadStatus.closed,
                created_at=now - timedelta(days=5),
            ),
            lead_document(name="New Lead", email="new@example.com", status=LeadStatus.new),
        ]
    )

    result = run(
        service.get_all_leads(
            page=1,
            limit=10,
            status=LeadStatus.closed,
            sort=LeadSort.oldest,
        )
    )

    assert [lead.full_name for lead in result.items] == ["Closed Earlier", "Closed Later"]
    assert result.pagination.previous is None


def test_get_lead_and_update_status_handle_success_and_not_found() -> None:
    document = lead_document(name="Maya Kapoor", email="maya@company.com")
    service = service_with([document])

    loaded = run(service.get_lead(str(document["_id"])))
    updated = run(
        service.update_status(str(document["_id"]), LeadUpdate(status=LeadStatus.contacted))
    )

    assert loaded.id == str(document["_id"])
    assert updated.status == LeadStatus.contacted

    try:
        run(service.get_lead(str(ObjectId())))
    except NotFoundError as exc:
        assert exc.status_code == 404
    else:
        raise AssertionError("Expected missing lead to raise NotFoundError")


def test_update_status_rejects_invalid_id_and_empty_payload() -> None:
    service = service_with()

    try:
        run(service.update_status("not-an-object-id", LeadUpdate(status=LeadStatus.closed)))
    except ApplicationError as exc:
        assert exc.status_code == 400
        assert exc.message == "Invalid resource id."
    else:
        raise AssertionError("Expected invalid id error")

    try:
        run(service.update_status(str(ObjectId()), LeadUpdate()))
    except ApplicationError as exc:
        assert exc.status_code == 400
    else:
        raise AssertionError("Expected empty payload error")


def test_dashboard_summary_is_calculated_from_current_leads() -> None:
    now = datetime.now(UTC)
    service = service_with(
        [
            lead_document(name="Maya Kapoor", email="maya@example.com", status=LeadStatus.new),
            lead_document(
                name="Noah Smith",
                email="noah@example.com",
                status=LeadStatus.contacted,
                created_at=now - timedelta(days=1),
            ),
            lead_document(
                name="Amara Lee",
                email="amara@example.com",
                status=LeadStatus.closed,
                created_at=now - timedelta(days=2),
            ),
        ]
    )

    summary = run(service.dashboard_summary())

    assert summary.total_leads == 3
    assert summary.new_leads == 1
    assert summary.contacted == 1
    assert summary.closed == 1
    assert summary.recent_leads[0].full_name == "Maya Kapoor"
    assert len(summary.latest_activity) == 3


def test_database_failures_are_translated_to_safe_errors() -> None:
    service = service_with(fail_operations=True)

    for operation in [
        service.create_lead(create_payload()),
        service.get_all_leads(page=1, limit=10),
        service.count_leads(),
        service.dashboard_summary(),
    ]:
        try:
            run(operation)
        except DatabaseError as exc:
            assert exc.status_code == 503
        else:
            raise AssertionError("Expected database error")

    try:
        run(service.get_lead(str(ObjectId())))
    except DatabaseError as exc:
        assert exc.status_code == 503
    else:
        raise AssertionError("Expected database error")

    assert issubclass(PyMongoError, Exception)
