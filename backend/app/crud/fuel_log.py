from sqlalchemy.ext.asyncio import AsyncSession

from app.crud.base import BaseRepository
from app.models.fuel_log import FuelLog


class FuelLogRepository(BaseRepository[FuelLog]):
    def __init__(self, db: AsyncSession) -> None:
        super().__init__(db, FuelLog)
