from fastapi import APIRouter, Depends, Path, Query, Request, status
from fastapi.responses import JSONResponse
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.auth import login_rate_limit_key, require_admin
from app.core.rate_limit import public_lead_rate_limiter
from app.database.dependencies import database_dependency
from app.models.lead import LeadStatus
from app.schemas.auth import UserResponse
from app.schemas.lead import LeadCreate, LeadSort, LeadUpdate
from app.services.lead_service import LeadService
from app.utils.response import success_response

router = APIRouter(prefix="/leads", tags=["Leads"])


def get_lead_service(database: AsyncIOMotorDatabase = Depends(database_dependency)) -> LeadService:
    return LeadService(database)


@router.get(
    "",
    status_code=status.HTTP_200_OK,
    summary="List, search, sort, and paginate leads",
    description=(
        "Returns leads with case-insensitive name/email search, status filtering, sorting, "
        "and pagination."
    ),
)
async def list_leads(
    page: int = Query(default=1, ge=1, description="Page number."),
    limit: int = Query(default=10, ge=1, le=100, description="Items per page."),
    search: str | None = Query(
        default=None, min_length=1, max_length=120, description="Partial name or email search."
    ),
    lead_status: LeadStatus | None = Query(
        default=None, alias="status", description="Filter by lead status."
    ),
    sort: LeadSort = Query(default=LeadSort.newest, description="Sort mode."),
    _: UserResponse = Depends(require_admin),
    lead_service: LeadService = Depends(get_lead_service),
) -> JSONResponse:
    result = await lead_service.get_all_leads(
        page=page,
        limit=limit,
        search=search,
        status=lead_status,
        sort=sort,
    )
    return success_response(
        message="Leads loaded successfully.",
        data=[lead.model_dump(mode="json") for lead in result.items],
        pagination=result.pagination.model_dump(mode="json"),
    )


@router.get(
    "/{lead_id}",
    status_code=status.HTTP_200_OK,
    summary="Get lead",
    description="Returns one lead by MongoDB ObjectId.",
)
async def get_lead(
    lead_id: str = Path(description="Lead ObjectId."),
    _: UserResponse = Depends(require_admin),
    lead_service: LeadService = Depends(get_lead_service),
) -> JSONResponse:
    lead = await lead_service.get_lead(lead_id)
    return success_response(message="Lead loaded successfully.", data=lead.model_dump(mode="json"))


@router.post(
    "",
    status_code=status.HTTP_201_CREATED,
    summary="Create lead",
    description="Validates and stores a new lead in MongoDB.",
)
async def create_lead(
    payload: LeadCreate,
    _: UserResponse = Depends(require_admin),
    lead_service: LeadService = Depends(get_lead_service),
) -> JSONResponse:
    lead = await lead_service.create_lead(payload)
    return success_response(
        message="Lead created successfully.",
        data=lead.model_dump(mode="json"),
        status_code=status.HTTP_201_CREATED,
    )


@router.post(
    "/public",
    status_code=status.HTTP_201_CREATED,
    summary="Submit public lead",
    description="Validates and stores a lead from the public website contact form.",
)
async def submit_public_lead(
    payload: LeadCreate,
    request: Request,
    lead_service: LeadService = Depends(get_lead_service),
) -> JSONResponse:
    public_lead_rate_limiter.check(login_rate_limit_key(request))
    lead = await lead_service.create_lead(payload)
    return success_response(
        message="Lead request submitted successfully.",
        data=lead.model_dump(mode="json"),
        status_code=status.HTTP_201_CREATED,
    )


@router.patch(
    "/{lead_id}",
    status_code=status.HTTP_200_OK,
    summary="Update lead status",
    description=(
        "Updates lead status and optional notes. Allowed statuses are NEW, CONTACTED, and CLOSED."
    ),
)
async def update_lead(
    payload: LeadUpdate,
    lead_id: str = Path(description="Lead ObjectId."),
    _: UserResponse = Depends(require_admin),
    lead_service: LeadService = Depends(get_lead_service),
) -> JSONResponse:
    lead = await lead_service.update_status(lead_id=lead_id, payload=payload)
    return success_response(message="Lead updated successfully.", data=lead.model_dump(mode="json"))
