from functools import lru_cache
from typing import Literal

from pydantic import Field, SecretStr, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    app_name: str = Field(validation_alias="APP_NAME")
    app_version: str = Field(validation_alias="APP_VERSION")
    environment: Literal["development", "staging", "production", "test"] = Field(
        default="development",
        validation_alias="ENVIRONMENT",
    )
    mongodb_uri: SecretStr = Field(validation_alias="MONGODB_URI")
    jwt_secret: SecretStr = Field(validation_alias="JWT_SECRET")
    jwt_algorithm: str = Field(validation_alias="JWT_ALGORITHM")
    access_token_expire_minutes: int = Field(
        default=30,
        ge=1,
        le=60 * 24,
        validation_alias="ACCESS_TOKEN_EXPIRE_MINUTES",
    )
    cors_origins: str = Field(default="", validation_alias="CORS_ORIGINS")
    trusted_hosts: str = Field(
        default="localhost,127.0.0.1,*.localhost,testserver",
        validation_alias="TRUSTED_HOSTS",
    )
    admin_email: str | None = Field(default=None, validation_alias="ADMIN_EMAIL")
    admin_password: SecretStr | None = Field(default=None, validation_alias="ADMIN_PASSWORD")
    admin_full_name: str = Field(default="LeadDesk Admin", validation_alias="ADMIN_FULL_NAME")
    request_timeout_seconds: int = Field(
        default=30, ge=1, le=120, validation_alias="REQUEST_TIMEOUT_SECONDS"
    )

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    @property
    def database_name(self) -> str:
        return "leaddesk-mini"

    @property
    def is_production(self) -> bool:
        return self.environment == "production"

    @property
    def cors_origin_strings(self) -> list[str]:
        return [
            origin.strip().rstrip("/") for origin in self.cors_origins.split(",") if origin.strip()
        ]

    @property
    def trusted_host_list(self) -> list[str]:
        return [host.strip() for host in self.trusted_hosts.split(",") if host.strip()]

    @field_validator("jwt_secret")
    @classmethod
    def validate_jwt_secret(cls, value: SecretStr) -> SecretStr:
        if len(value.get_secret_value()) < 32:
            raise ValueError("JWT_SECRET must contain at least 32 characters.")
        return value

    def validate_startup(self) -> None:
        """Fail fast when production deployment settings are unsafe."""

        if not self.is_production:
            return

        if not self.cors_origin_strings:
            raise ValueError("CORS_ORIGINS must be configured in production.")
        if "*" in self.cors_origin_strings:
            raise ValueError("Wildcard CORS origins are not allowed in production.")
        if not self.trusted_host_list or "*" in self.trusted_host_list:
            raise ValueError("TRUSTED_HOSTS must be explicit in production.")
        if self.admin_password is not None and len(self.admin_password.get_secret_value()) < 12:
            raise ValueError("ADMIN_PASSWORD must contain at least 12 characters in production.")


@lru_cache
def get_settings() -> Settings:
    """Return cached application settings."""

    return Settings()
