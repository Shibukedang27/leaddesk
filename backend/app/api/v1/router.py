from fastapi import APIRouter

from app.api.v1.auth.routes import router as auth_router
from app.api.v1.dashboard.routes import router as dashboard_router
from app.api.v1.health.routes import router as health_router
from app.api.v1.leads.routes import router as leads_router

api_v1_router = APIRouter(prefix="/api/v1")
api_v1_router.include_router(health_router)
api_v1_router.include_router(auth_router)
api_v1_router.include_router(leads_router)
api_v1_router.include_router(dashboard_router)
