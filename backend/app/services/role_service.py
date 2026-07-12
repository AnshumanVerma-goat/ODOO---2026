from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import ConflictError, NotFoundError
from app.crud.role import RoleRepository
from app.models.role import Role
from app.schemas.role import RoleCreate, RoleUpdate
from app.services.base import BaseService


class RoleService(BaseService[Role]):
    repository_class = RoleRepository

    async def get_by_name(self, name: str) -> Role | None:
        result = await self.db.execute(select(Role).where(Role.name == name))
        return result.scalar_one_or_none()

    async def list_roles(self, page: int, size: int, search: str | None, sort_by: str | None, sort_order: str):
        items, total = await self.repository.list(
            page=page,
            size=size,
            search=search,
            sort_by=sort_by,
            sort_order=sort_order,
            search_fields=("name",),
        )
        return items, total

    async def create_role(self, data: RoleCreate) -> Role:
        if await self.get_by_name(data.name):
            raise ConflictError("Role already exists")
        return await self.repository.create(data.model_dump())

    async def update_role(self, role_id: int, data: RoleUpdate) -> Role:
        role = await self.repository.get(role_id)
        if role is None:
            raise NotFoundError("Role not found")
        payload = data.model_dump(exclude_unset=True)
        if "name" in payload and payload["name"] != role.name and await self.get_by_name(payload["name"]):
            raise ConflictError("Role already exists")
        return await self.repository.update(role, payload)

    async def delete_role(self, role_id: int) -> None:
        role = await self.repository.get(role_id)
        if role is None:
            raise NotFoundError("Role not found")
        await self.repository.delete(role)
