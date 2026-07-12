from datetime import date

from pydantic import Field

from app.schemas.common import ORMBaseSchema


class MaintenanceBase(ORMBaseSchema):
    vehicle_id: int
    maintenance_type: str = Field(min_length=2, max_length=80)
    description: str = Field(min_length=2, max_length=500)
    maintenance_cost: float = Field(ge=0)
    start_date: date
    end_date: date | None = None
    active: bool = True


class MaintenanceCreate(MaintenanceBase):
    pass


class MaintenanceUpdate(ORMBaseSchema):
    vehicle_id: int | None = None
    maintenance_type: str | None = Field(default=None, min_length=2, max_length=80)
    description: str | None = Field(default=None, min_length=2, max_length=500)
    maintenance_cost: float | None = Field(default=None, ge=0)
    start_date: date | None = None
    end_date: date | None = None
    active: bool | None = None


class MaintenanceRead(MaintenanceBase):
    id: int
