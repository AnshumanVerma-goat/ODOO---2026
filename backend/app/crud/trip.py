from sqlalchemy.ext.asyncio import AsyncSession

from app.crud.base import BaseRepository
from app.models.trip import Trip


class TripRepository(BaseRepository[Trip]):
    def __init__(self, db: AsyncSession) -> None:
        super().__init__(db, Trip)
