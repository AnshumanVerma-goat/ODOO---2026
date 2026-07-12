from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.auth.security import create_access_token, create_refresh_token, hash_password, verify_password
from app.core.enums import RoleName, TokenType
from app.core.exceptions import ConflictError, NotFoundError, UnauthorizedError
from app.models.role import Role
from app.models.user import User
from app.schemas.auth import LoginRequest, RefreshRequest, RegisterRequest, TokenPair
from app.schemas.user import UserRead
from app.services.role_service import RoleService
from app.services.user_service import UserService


class AuthService:
    def __init__(self, db):
        self.db = db
        self.user_service = UserService(db)
        self.role_service = RoleService(db)

    async def register(self, payload: RegisterRequest) -> TokenPair:
        role_id = payload.role_id
        if role_id is None:
            role = await self.role_service.get_by_name(RoleName.DISPATCHER.value)
            if role is None:
                raise NotFoundError("Default role not found")
            role_id = role.id
        user = await self.user_service.create_user(
            payload.model_copy(update={"role_id": role_id}),
            default_role_id=role_id,
        )
        await self.db.commit()
        refreshed_user = await self.user_service.get_by_email(user.email)
        if refreshed_user is None:
            raise NotFoundError("User not found")
        return await self._build_token_pair(refreshed_user)

    async def login(self, payload: LoginRequest) -> TokenPair:
        user = await self.user_service.get_by_email(payload.email)
        if user is None or not verify_password(payload.password, user.password_hash):
            raise UnauthorizedError("Invalid email or password")
        return await self._build_token_pair(user)

    async def refresh(self, payload: RefreshRequest) -> TokenPair:
        from app.auth.security import decode_token

        decoded = decode_token(payload.refresh_token)
        if decoded.get("type") != TokenType.REFRESH.value:
            raise UnauthorizedError("Invalid refresh token")
        email = decoded.get("sub")
        if not email:
            raise UnauthorizedError("Invalid refresh token subject")
        user = await self.user_service.get_by_email(email)
        if user is None:
            raise UnauthorizedError("User not found")
        return await self._build_token_pair(user)

    async def _build_token_pair(self, user: User) -> TokenPair:
        access_token = create_access_token(user.email)
        refresh_token = create_refresh_token(user.email)
        return TokenPair(
            access_token=access_token,
            refresh_token=refresh_token,
            user=UserRead.model_validate(user),
            role=user.role,
        )
