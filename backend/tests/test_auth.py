import pytest
from sqlalchemy import select

from app.core.enums import RoleName
from app.schemas.auth import LoginRequest, RefreshRequest, RegisterRequest
from app.services.auth_service import AuthService
from app.models.role import Role


@pytest.mark.asyncio
async def test_register_login_refresh(session):
    role = (await session.execute(select(Role).where(Role.name == RoleName.DISPATCHER.value))).scalar_one()
    service = AuthService(session)
    register = RegisterRequest(name="John Doe", email="john@example.com", password="Password123!", role_id=role.id)

    token_pair = await service.register(register)
    assert token_pair.access_token
    assert token_pair.refresh_token
    assert token_pair.user.email == "john@example.com"

    login_pair = await service.login(LoginRequest(email="john@example.com", password="Password123!"))
    assert login_pair.access_token

    refreshed = await service.refresh(RefreshRequest(refresh_token=login_pair.refresh_token))
    assert refreshed.user.email == "john@example.com"
