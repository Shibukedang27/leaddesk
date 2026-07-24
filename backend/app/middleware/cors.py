from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import Settings


def configure_cors(app: FastAPI, settings: Settings) -> None:
    """Configure CORS using explicit environment-provided origins."""

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origin_strings,
        allow_credentials=False,
        allow_methods=["GET", "POST", "PATCH", "OPTIONS"],
        allow_headers=["Authorization", "Content-Type"],
    )
