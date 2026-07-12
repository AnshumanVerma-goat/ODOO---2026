from __future__ import annotations

from typing import Any, Generic, TypeVar

from sqlalchemy.ext.asyncio import AsyncSession

from app.crud.base import BaseRepository
from app.database.base import Base

ModelType = TypeVar("ModelType", bound=Base)
RepositoryType = TypeVar("RepositoryType", bound=BaseRepository[Any])


class BaseService(Generic[ModelType]):
    repository_class: type[BaseRepository[ModelType]]

    def __init__(self, db: AsyncSession) -> None:
        self.db = db
        self.repository = self.repository_class(db)
