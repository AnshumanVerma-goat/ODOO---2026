from sqlalchemy.ext.asyncio import AsyncSession

from app.crud.base import BaseRepository
from app.models.expense import Expense


class ExpenseRepository(BaseRepository[Expense]):
    def __init__(self, db: AsyncSession) -> None:
        super().__init__(db, Expense)
