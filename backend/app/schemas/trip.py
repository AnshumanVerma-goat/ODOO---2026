from datetime import datetime

from pydantic import Field, model_validator

from app.core.enums import TripStatus
from app.schemas.common import ORMBaseSchema


class TripBase(ORMBaseSchema):
    source: str = Field(min_length=2, max_length=255)
    destination: str = Field(min_length=2, max_length=255)
    cargo_weight: float = Field(gt=0)
    planned_distance: float = Field(gt=0)
    actual_distance: float | None = Field(default=None, gt=0)
    revenue: float = Field(default=0, ge=0)
    fuel_used: float | None = Field(default=None, gt=0)
    trip_status: TripStatus = TripStatus.DRAFT


class TripCreate(TripBase):
    vehicle_id: int | None = None
    driver_id: int | None = None

    @model_validator(mode="after")
    def validate_assignments(self) -> "TripCreate":
        return self


class TripUpdate(ORMBaseSchema):
    source: str | None = Field(default=None, min_length=2, max_length=255)
    destination: str | None = Field(default=None, min_length=2, max_length=255)
    vehicle_id: int | None = None
    driver_id: int | None = None
    cargo_weight: float | None = Field(default=None, gt=0)
    planned_distance: float | None = Field(default=None, gt=0)
    actual_distance: float | None = Field(default=None, gt=0)
    revenue: float | None = Field(default=None, ge=0)
    fuel_used: float | None = Field(default=None, gt=0)
    trip_status: TripStatus | None = None


class TripRead(TripBase):
    id: int
    vehicle_id: int | None
    driver_id: int | None
    dispatch_time: datetime | None = None
    completion_time: datetime | None = None
