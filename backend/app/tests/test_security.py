import pytest

from app.core.security import (
    create_access_token,
    decode_access_token,
    hash_password,
    verify_password,
)
from app.utils.exceptions import AuthenticationError


def test_password_hash_verification_round_trip() -> None:
    password = "StrongPass123!"
    password_hash = hash_password(password)

    assert password_hash != password
    assert verify_password(password, password_hash)
    assert not verify_password("wrong-password", password_hash)


def test_access_token_contains_required_claims() -> None:
    token = create_access_token(subject="user-123", additional_claims={"role": "ADMIN"})
    payload = decode_access_token(token)

    assert payload["sub"] == "user-123"
    assert payload["role"] == "ADMIN"
    assert payload["type"] == "access"
    assert "exp" in payload
    assert "iat" in payload


def test_invalid_token_is_rejected() -> None:
    with pytest.raises(AuthenticationError):
        decode_access_token("not-a-valid-token")
