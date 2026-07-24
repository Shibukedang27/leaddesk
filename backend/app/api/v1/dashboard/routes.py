from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.auth import require_admin
from app.database.dependencies import database_dependency
from app.schemas.auth import UserResponse
from app.services.dashboard_service import DashboardService
from app.utils.response import success_response

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


def get_dashboard_service(
    database: AsyncIOMotorDatabase = Depends(database_dependency),
) -> DashboardService:
    return DashboardService(database)


@router.get(
    "",
    status_code=status.HTTP_200_OK,
    summary="Get dashboard summary",
    description=(
        "Returns dynamic lead counts, recent leads, and latest activity calculated from MongoDB."
    ),
)
async def dashboard_summary(
    _: UserResponse = Depends(require_admin),
    dashboard_service: DashboardService = Depends(get_dashboard_service),
) -> JSONResponse:
    data = await dashboard_service.get_summary()
    return success_response(
        message="Dashboard summary loaded successfully.", data=data.model_dump(mode="json")
    )
