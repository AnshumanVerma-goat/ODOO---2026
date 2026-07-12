from pydantic import Field

from app.core.enums import VehicleStatus
from app.schemas.common import ORMBaseSchema


class VehicleBase(ORMBaseSchema):
    registration_number: str = Field(min_length=2, max_length=64)
    vehicle_name: str = Field(min_length=2, max_length=120)
    vehicle_type: str = Field(min_length=2, max_length=80)
    maximum_load_capacity: float = Field(gt=0)
    odometer: int = Field(ge=0)
    acquisition_cost: float = Field(ge=0)
    current_status: VehicleStatus


class VehicleCreate(VehicleBase):
    pass


class VehicleUpdate(ORMBaseSchema):
    registration_number: str | None = Field(default=None, min_length=2, max_length=64)
    vehicle_name: str | None = Field(default=None, min_length=2, max_length=120)
    vehicle_type: str | None = Field(default=None, min_length=2, max_length=80)
    maximum_load_capacity: float | None = Field(default=None, gt=0)
    odometer: int | None = Field(default=None, ge=0)
    acquisition_cost: float | None = Field(default=None, ge=0)
    current_status: VehicleStatus | None = None


class VehicleRead(VehicleBase):
    id: int
