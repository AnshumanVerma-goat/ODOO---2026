from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.core.exceptions import ConflictError, NotFoundError
from app.crud.role import RoleRepository
from app.crud.user import UserRepository
from app.models.role import Role
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate
from app.auth.security import hash_password
from app.core.enums import RoleName
from app.services.base import BaseService


class UserService(BaseService[User]):
    repository_class = UserRepository

    async def get_by_email(self, email: str) -> User | None:
        result = await self.db.execute(
            select(User).options(selectinload(User.role)).where(User.email == email)
        )
        return result.scalar_one_or_none()

    async def get_by_id(self, user_id: int) -> User | None:
        result = await self.db.execute(
            select(User).options(selectinload(User.role)).where(User.id == user_id)
        )
        return result.scalar_one_or_none()

    async def list_users(self, page: int, size: int, search: str | None, sort_by: str | None, sort_order: str):
        items, total = await self.repository.list(
            page=page,
            size=size,
            search=search,
            sort_by=sort_by,
            sort_order=sort_order,
            search_fields=("name", "email"),
        )
        return items, total

    async def create_user(self, data: UserCreate, default_role_id: int | None = None) -> User:
        if await self.get_by_email(data.email):
            raise ConflictError("Email already exists")

        role_id = data.role_id or default_role_id
        if role_id is None:
            role_result = await self.db.execute(select(Role).where(Role.name == RoleName.DISPATCHER.value))
            role = role_result.scalar_one_or_none()
            if role is None:
                raise NotFoundError("Default role not found")
            role_id = role.id
        else:
            role = await self.db.get(Role, role_id)
            if role is None:
                raise NotFoundError("Role not found")

        payload = data.model_dump(exclude={"password", "role_id"})
        payload["role_id"] = role_id
        payload["password_hash"] = hash_password(data.password)
        return await self.repository.create(payload)

    async def update_user(self, user_id: int, data: UserUpdate) -> User:
        user = await self.get_by_id(user_id)
        if user is None:
            raise NotFoundError("User not found")

        payload = data.model_dump(exclude_unset=True)
        if "email" in payload and payload["email"] != user.email and await self.get_by_email(payload["email"]):
            raise ConflictError("Email already exists")
        if "role_id" in payload and payload["role_id"] is not None:
            role = await self.db.get(Role, payload["role_id"])
            if role is None:
                raise NotFoundError("Role not found")
        if "password" in payload:
            payload["password_hash"] = hash_password(payload.pop("password"))
        return await self.repository.update(user, payload)

    async def delete_user(self, user_id: int) -> None:
        user = await self.get_by_id(user_id)
        if user is None:
            raise NotFoundError("User not found")
        await self.repository.delete(user)
