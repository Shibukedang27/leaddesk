from motor.motor_asyncio import AsyncIOMotorDatabase

from app.schemas.dashboard import DashboardResponse
from app.services.lead_service import LeadService


class DashboardService:
    """Business service for dashboard calculations.

    The dashboard is calculated dynamically from lead records so it never drifts
    from the source of truth or requires duplicated aggregate collections.
    """

    def __init__(self, database: AsyncIOMotorDatabase) -> None:
        self.lead_service = LeadService(database)

    async def get_summary(self) -> DashboardResponse:
        return await self.lead_service.dashboard_summary()
