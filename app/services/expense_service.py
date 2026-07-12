from app.core.exceptions import NotFoundError
from app.crud.expense import ExpenseRepository
from app.models.expense import Expense
from app.models.vehicle import Vehicle
from app.schemas.expense import ExpenseCreate, ExpenseUpdate
from app.services.base import BaseService


class ExpenseService(BaseService[Expense]):
    repository_class = ExpenseRepository

    async def list_expenses(self, page: int, size: int, search: str | None, sort_by: str | None, sort_order: str):
        return await self.repository.list(
            page=page,
            size=size,
            search=search,
            sort_by=sort_by,
            sort_order=sort_order,
            search_fields=("expense_type", "remarks"),
        )

    async def create_expense(self, data: ExpenseCreate) -> Expense:
        vehicle = await self.db.get(Vehicle, data.vehicle_id)
        if vehicle is None:
            raise NotFoundError("Vehicle not found")
        return await self.repository.create(data.model_dump())

    async def update_expense(self, expense_id: int, data: ExpenseUpdate) -> Expense:
        expense = await self.repository.get(expense_id)
        if expense is None:
            raise NotFoundError("Expense not found")
        payload = data.model_dump(exclude_unset=True)
        return await self.repository.update(expense, payload)

    async def delete_expense(self, expense_id: int) -> None:
        expense = await self.repository.get(expense_id)
        if expense is None:
            raise NotFoundError("Expense not found")
        await self.repository.delete(expense)
