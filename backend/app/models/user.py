from datetime import datetime
from enum import StrEnum

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserRole(StrEnum):
    """Supported account roles for future authorization."""

    admin = "ADMIN"
    manager = "MANAGER"
    staff = "STAFF"


class UserModel(BaseModel):
    """MongoDB user document.

    Users are normalized into their own collection so future lead assignment,
    ownership, and audit features can reference account records cleanly.
    """

    id: str | None = Field(default=None, alias="_id")
    email: EmailStr
    password_hash: str = Field(min_length=20)
    full_name: str = Field(min_length=2, max_length=80)
    role: UserRole = UserRole.staff
    is_active: bool = True
    created_at: datetime
    updated_at: datetime
    last_login: datetime | None = None

    model_config = ConfigDict(populate_by_name=True)
