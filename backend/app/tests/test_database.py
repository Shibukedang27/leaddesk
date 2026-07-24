import asyncio

from app.database.mongodb import mongo_manager
from app.utils.exceptions import DatabaseError


def test_database_provider_raises_safe_error_when_disconnected() -> None:
    original_client = mongo_manager.state.client
    original_status = mongo_manager.state.status
    mongo_manager.state.client = None
    mongo_manager.state.status = "disconnected"

    try:
        try:
            mongo_manager.database()
        except DatabaseError as exc:
            assert exc.status_code == 503
        else:
            raise AssertionError("Expected DatabaseError when Mongo client is missing")
    finally:
        mongo_manager.state.client = original_client
        mongo_manager.state.status = original_status


def test_disconnect_resets_connection_state() -> None:
    class ClosableClient:
        def __init__(self) -> None:
            self.closed = False

        def close(self) -> None:
            self.closed = True

    client = ClosableClient()
    mongo_manager.state.client = client
    mongo_manager.state.status = "connected"

    asyncio.run(mongo_manager.disconnect())

    assert client.closed is True
    assert mongo_manager.state.client is None
    assert mongo_manager.state.status == "disconnected"
