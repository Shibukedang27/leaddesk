import json
import logging
import sys
from datetime import UTC, datetime

from app.core.config import get_settings


class JsonLikeFormatter(logging.Formatter):
    """Small structured formatter without external logging dependencies."""

    def format(self, record: logging.LogRecord) -> str:
        base = {
            "timestamp": datetime.now(UTC).isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
        }
        if record.exc_info:
            base["exception"] = self.formatException(record.exc_info)
        return json.dumps(base, ensure_ascii=True)


def configure_logging() -> None:
    """Configure application-wide structured logging."""

    settings = get_settings()
    level = logging.INFO if settings.environment != "development" else logging.DEBUG

    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(JsonLikeFormatter())

    root_logger = logging.getLogger()
    root_logger.handlers.clear()
    root_logger.setLevel(level)
    root_logger.addHandler(handler)

    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)


logger = logging.getLogger("leaddesk")
