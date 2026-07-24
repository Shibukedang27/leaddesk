from pydantic import BaseModel, EmailStr, Field

from app.utils.validators import PasswordString


class UserLogin(BaseModel):
    """Validated login payload for admin authentication."""

    email: EmailStr = Field(description="User email address.", examples=["admin@leaddesk.app"])
    password: PasswordString = Field(description="User password.", examples=["StrongPassword123"])


class UserResponse(BaseModel):
    """Safe user shape returned by account-facing APIs."""

    id: str = Field(description="User id.", examples=["665f2f2a5f1f8b0012b7a456"])
    email: EmailStr = Field(description="User email address.", examples=["admin@leaddesk.app"])
    full_name: str = Field(description="User full name.", examples=["Maya Kapoor"])
    role: str = Field(description="User role.", examples=["ADMIN"])
    is_active: bool = Field(description="Whether the account is active.", examples=[True])


class JWTResponse(BaseModel):
    """JWT response shape returned after successful authentication."""

    access_token: str = Field(description="JWT access token.")
    token_type: str = Field(default="bearer", description="Token type.", examples=["bearer"])
    expires_in: int = Field(description="Token lifetime in seconds.", examples=[1800])
    user: UserResponse = Field(description="Authenticated user.")


LoginRequest = UserLogin
