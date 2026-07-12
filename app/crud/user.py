from sqlalchemy.ext.asyncio import AsyncSession

from app.crud.base import BaseRepository
from app.models.user import User


class UserRepository(BaseRepository[User]):
    def __init__(self, db: AsyncSession) -> None:
        super().__init__(db, User)
