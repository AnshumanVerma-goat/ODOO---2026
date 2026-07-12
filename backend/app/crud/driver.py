from sqlalchemy.ext.asyncio import AsyncSession

from app.crud.base import BaseRepository
from app.models.driver import Driver


class DriverRepository(BaseRepository[Driver]):
    def __init__(self, db: AsyncSession) -> None:
        super().__init__(db, Driver)
