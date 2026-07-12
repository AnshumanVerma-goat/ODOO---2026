from __future__ import annotations

from collections.abc import Sequence
from typing import Any, Generic, TypeVar

from sqlalchemy import Select, asc, desc, func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.base import Base

ModelType = TypeVar("ModelType", bound=Base)


class BaseRepository(Generic[ModelType]):
    def __init__(self, db: AsyncSession, model: type[ModelType]) -> None:
        self.db = db
        self.model = model

    async def get(self, object_id: int) -> ModelType | None:
        result = await self.db.execute(select(self.model).where(self.model.id == object_id))
        return result.scalar_one_or_none()

    async def get_one(self, **filters: Any) -> ModelType | None:
        stmt = select(self.model)
        for key, value in filters.items():
            stmt = stmt.where(getattr(self.model, key) == value)
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def exists(self, **filters: Any) -> bool:
        stmt = select(func.count()).select_from(self.model)
        for key, value in filters.items():
            stmt = stmt.where(getattr(self.model, key) == value)
        result = await self.db.execute(stmt)
        return result.scalar_one() > 0

    async def create(self, data: dict[str, Any]) -> ModelType:
        instance = self.model(**data)
        self.db.add(instance)
        await self.db.flush()
        await self.db.refresh(instance)
        return instance

    async def update(self, instance: ModelType, data: dict[str, Any]) -> ModelType:
        for key, value in data.items():
            setattr(instance, key, value)
        await self.db.flush()
        await self.db.refresh(instance)
        return instance

    async def delete(self, instance: ModelType) -> None:
        await self.db.delete(instance)
        await self.db.flush()

    async def list(
        self,
        *,
        page: int = 1,
        size: int = 20,
        search: str | None = None,
        sort_by: str | None = None,
        sort_order: str = "desc",
        search_fields: Sequence[str] = (),
        filters: dict[str, Any] | None = None,
    ) -> tuple[list[ModelType], int]:
        stmt: Select[tuple[ModelType]] = select(self.model)
        count_stmt = select(func.count()).select_from(self.model)

        if filters:
            for key, value in filters.items():
                if value is not None:
                    column = getattr(self.model, key)
                    stmt = stmt.where(column == value)
                    count_stmt = count_stmt.where(column == value)

        if search and search_fields:
            clauses = [getattr(self.model, field).ilike(f"%{search}%") for field in search_fields]
            search_clause = or_(*clauses)
            stmt = stmt.where(search_clause)
            count_stmt = count_stmt.where(search_clause)

        if sort_by and hasattr(self.model, sort_by):
            order_column = getattr(self.model, sort_by)
            stmt = stmt.order_by(asc(order_column) if sort_order == "asc" else desc(order_column))
        else:
            stmt = stmt.order_by(desc(self.model.id))

        stmt = stmt.offset((page - 1) * size).limit(size)
        result = await self.db.execute(stmt)
        total_result = await self.db.execute(count_stmt)
        return list(result.scalars().all()), int(total_result.scalar_one())
