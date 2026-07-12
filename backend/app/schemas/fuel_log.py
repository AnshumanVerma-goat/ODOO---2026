from datetime import date as dt_date

from pydantic import Field

from app.schemas.common import ORMBaseSchema


class FuelLogBase(ORMBaseSchema):
    vehicle_id: int
    trip_id: int | None = None
    liters: float = Field(gt=0)
    cost: float = Field(ge=0)
    date: dt_date


class FuelLogCreate(FuelLogBase):
    pass


class FuelLogUpdate(ORMBaseSchema):
    vehicle_id: int | None = None
    trip_id: int | None = None
    liters: float | None = Field(default=None, gt=0)
    cost: float | None = Field(default=None, ge=0)
    date: dt_date | None = None


class FuelLogRead(FuelLogBase):
    id: int
