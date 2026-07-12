from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.dependencies import get_current_user
from app.core.exceptions import NotFoundError
from app.core.responses import APIResponse
from app.database.session import get_db
from app.schemas.expense import ExpenseCreate, ExpenseRead, ExpenseUpdate
from app.services.expense_service import ExpenseService
from app.utils.pagination import build_page_meta
from app.utils.response import success_response

router = APIRouter(prefix="/expenses", tags=["Expenses"], dependencies=[Depends(get_current_user)])


@router.get("", response_model=APIResponse)
async def list_expenses(
    page: int = Query(default=1, ge=1),
    size: int = Query(default=20, ge=1, le=100),
    search: str | None = Query(default=None),
    sort_by: str | None = Query(default="expense_date"),
    sort_order: str = Query(default="desc", pattern="^(asc|desc)$"),
    db: AsyncSession = Depends(get_db),
) -> APIResponse:
    service = ExpenseService(db)
    items, total = await service.list_expenses(page, size, search, sort_by, sort_order)
    return success_response(
        [ExpenseRead.model_validate(item) for item in items],
        meta=build_page_meta(page, size, total).model_dump(),
    )


@router.post("", response_model=APIResponse, status_code=201)
async def create_expense(payload: ExpenseCreate, db: AsyncSession = Depends(get_db)) -> APIResponse:
    service = ExpenseService(db)
    expense = await service.create_expense(payload)
    await db.commit()
    return success_response(ExpenseRead.model_validate(expense), message="Expense created")


@router.get("/{expense_id}", response_model=APIResponse)
async def get_expense(expense_id: int, db: AsyncSession = Depends(get_db)) -> APIResponse:
    service = ExpenseService(db)
    expense = await service.repository.get(expense_id)
    if expense is None:
        raise NotFoundError("Expense not found")
    return success_response(ExpenseRead.model_validate(expense))


@router.put("/{expense_id}", response_model=APIResponse)
async def update_expense(expense_id: int, payload: ExpenseUpdate, db: AsyncSession = Depends(get_db)) -> APIResponse:
    service = ExpenseService(db)
    expense = await service.update_expense(expense_id, payload)
    await db.commit()
    return success_response(ExpenseRead.model_validate(expense), message="Expense updated")


@router.delete("/{expense_id}", response_model=APIResponse)
async def delete_expense(expense_id: int, db: AsyncSession = Depends(get_db)) -> APIResponse:
    service = ExpenseService(db)
    await service.delete_expense(expense_id)
    await db.commit()
    return success_response(message="Expense deleted")
