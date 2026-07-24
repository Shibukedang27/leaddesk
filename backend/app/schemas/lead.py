from datetime import datetime
from enum import StrEnum

from pydantic import BaseModel, EmailStr, Field, field_validator

from app.models.lead import LeadStatus
from app.utils.validators import BudgetString, MessageString, NameString, validate_budget_range


class LeadSort(StrEnum):
    newest = "newest"
    oldest = "oldest"
    budget = "budget"
    alphabetical = "alphabetical"
    status = "status"


class LeadCreate(BaseModel):
    """Validated request body for creating a lead."""

    full_name: NameString = Field(description="Lead full name.", examples=["Maya Kapoor"])
    email: EmailStr = Field(description="Lead email address.", examples=["maya@company.com"])
    budget: BudgetString = Field(description="Selected budget range.", examples=["$5k-$15k"])
    message: MessageString = Field(
        description="Project message or buying context.",
        examples=["We need a modern CRM process for a growing sales team."],
    )
    source: str = Field(
        default="website",
        min_length=2,
        max_length=50,
        description="Lead acquisition source.",
        examples=["website"],
    )
    notes: str | None = Field(
        default=None,
        max_length=1000,
        description="Internal notes.",
        examples=["Asked for a Q3 launch."],
    )

    @field_validator("budget")
    @classmethod
    def validate_budget(cls, value: str) -> str:
        return validate_budget_range(value)


class LeadUpdate(BaseModel):
    """Validated request body for updating a lead status or notes."""

    status: LeadStatus | None = Field(
        default=None, description="Lead lifecycle status.", examples=[LeadStatus.contacted]
    )
    notes: str | None = Field(
        default=None,
        max_length=1000,
        description="Internal notes.",
        examples=["Follow up next week."],
    )


class LeadResponse(BaseModel):
    """Public API shape returned for a lead document."""

    id: str = Field(description="Lead id.", examples=["665f2f2a5f1f8b0012b7a456"])
    full_name: str = Field(description="Lead full name.", examples=["Maya Kapoor"])
    email: EmailStr = Field(description="Lead email address.", examples=["maya@company.com"])
    budget: str = Field(description="Budget range.", examples=["$5k-$15k"])
    message: str = Field(description="Project message.", examples=["We need a CRM foundation."])
    status: LeadStatus = Field(description="Lead status.", examples=[LeadStatus.new])
    source: str = Field(description="Lead source.", examples=["website"])
    notes: str | None = Field(
        default=None, description="Internal notes.", examples=["High intent."]
    )
    created_at: datetime = Field(description="Creation timestamp.")
    updated_at: datetime = Field(description="Last update timestamp.")


class PaginationMeta(BaseModel):
    """Pagination metadata for list responses."""

    page: int = Field(description="Current page.", examples=[1])
    limit: int = Field(description="Items per page.", examples=[10])
    total: int = Field(description="Total matching records.", examples=[42])
    pages: int = Field(description="Total pages.", examples=[5])
    next: int | None = Field(default=None, description="Next page number.", examples=[2])
    previous: int | None = Field(default=None, description="Previous page number.", examples=[None])


class LeadListResponse(BaseModel):
    """Lead list data with pagination metadata."""

    items: list[LeadResponse] = Field(description="Leads for the current page.")
    pagination: PaginationMeta = Field(description="Pagination metadata.")
