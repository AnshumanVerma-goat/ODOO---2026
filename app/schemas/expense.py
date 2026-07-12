from datetime import date

from pydantic import Field

from app.schemas.common import ORMBaseSchema


class ExpenseBase(ORMBaseSchema):
    vehicle_id: int
    expense_type: str = Field(min_length=2, max_length=80)
    amount: float = Field(ge=0)
    remarks: str | None = Field(default=None, max_length=500)
    expense_date: date


class ExpenseCreate(ExpenseBase):
    pass


class ExpenseUpdate(ORMBaseSchema):
    vehicle_id: int | None = None
    expense_type: str | None = Field(default=None, min_length=2, max_length=80)
    amount: float | None = Field(default=None, ge=0)
    remarks: str | None = Field(default=None, max_length=500)
    expense_date: date | None = None


class ExpenseRead(ExpenseBase):
    id: int
