from datetime import datetime

from pydantic import BaseModel, Field

from app.schemas.lead import LeadResponse


class LatestActivity(BaseModel):
    """Small activity item generated from recent lead changes."""

    lead_id: str = Field(description="Lead id.", examples=["665f2f2a5f1f8b0012b7a456"])
    full_name: str = Field(description="Lead full name.", examples=["Maya Kapoor"])
    status: str = Field(description="Current lead status.", examples=["NEW"])
    occurred_at: datetime = Field(description="Activity timestamp.")


class DashboardResponse(BaseModel):
    """Dynamically calculated dashboard summary."""

    total_leads: int = Field(description="Total lead count.", examples=[125])
    new_leads: int = Field(description="Number of new leads.", examples=[25])
    contacted: int = Field(description="Number of contacted leads.", examples=[70])
    closed: int = Field(description="Number of closed leads.", examples=[30])
    recent_leads: list[LeadResponse] = Field(description="Most recently created leads.")
    latest_activity: list[LatestActivity] = Field(
        description="Latest lead activity from recent updates."
    )
