from datetime import date

from pydantic import Field

from app.core.enums import DriverStatus
from app.schemas.common import ORMBaseSchema


class DriverBase(ORMBaseSchema):
    full_name: str = Field(min_length=2, max_length=150)
    license_number: str = Field(min_length=2, max_length=64)
    license_category: str = Field(min_length=1, max_length=32)
    license_expiry: date
    contact_number: str = Field(min_length=5, max_length=32)
    safety_score: float = Field(ge=0, le=100)
    current_status: DriverStatus


class DriverCreate(DriverBase):
    pass


class DriverUpdate(ORMBaseSchema):
    full_name: str | None = Field(default=None, min_length=2, max_length=150)
    license_number: str | None = Field(default=None, min_length=2, max_length=64)
    license_category: str | None = Field(default=None, min_length=1, max_length=32)
    license_expiry: date | None = None
    contact_number: str | None = Field(default=None, min_length=5, max_length=32)
    safety_score: float | None = Field(default=None, ge=0, le=100)
    current_status: DriverStatus | None = None


class DriverRead(DriverBase):
    id: int
