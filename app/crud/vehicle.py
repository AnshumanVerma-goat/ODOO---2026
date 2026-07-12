from sqlalchemy.ext.asyncio import AsyncSession

from app.crud.base import BaseRepository
from app.models.vehicle import Vehicle


class VehicleRepository(BaseRepository[Vehicle]):
    def __init__(self, db: AsyncSession) -> None:
        super().__init__(db, Vehicle)
