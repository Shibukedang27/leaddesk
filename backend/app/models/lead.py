from datetime import datetime
from enum import StrEnum

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.utils.validators import BudgetString, MessageString, NameString


class LeadStatus(StrEnum):
    """Allowed CRM lead lifecycle states."""

    new = "NEW"
    contacted = "CONTACTED"
    closed = "CLOSED"


class LeadModel(BaseModel):
    """MongoDB lead document.

    Leads are stored independently from users because public lead submissions
    should not duplicate user account data or require a user record.
    """

    id: str | None = Field(default=None, alias="_id")
    full_name: NameString
    email: EmailStr
    budget: BudgetString
    message: MessageString
    status: LeadStatus = LeadStatus.new
    source: str = Field(default="website", min_length=2, max_length=50)
    notes: str | None = Field(default=None, max_length=1000)
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(populate_by_name=True)
