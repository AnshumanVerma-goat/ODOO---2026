from sqlalchemy.ext.asyncio import AsyncSession

from app.crud.base import BaseRepository
from app.models.maintenance import MaintenanceLog


class MaintenanceRepository(BaseRepository[MaintenanceLog]):
    def __init__(self, db: AsyncSession) -> None:
        super().__init__(db, MaintenanceLog)
