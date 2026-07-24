from app.main import app


def test_openapi_registers_expected_routes() -> None:
    schema = app.openapi()
    paths = schema["paths"]

    assert "/api/v1/health" in paths
    assert "/api/v1/auth/login" in paths
    assert "/api/v1/leads" in paths
    assert "/api/v1/leads/public" in paths
    assert "/api/v1/dashboard" in paths


def test_app_metadata_matches_environment() -> None:
    assert app.title == "LeadDesk Mini"
    assert app.version == "1.0.0"
