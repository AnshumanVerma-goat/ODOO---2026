from typing import Generic, TypeVar

from pydantic import BaseModel, ConfigDict, Field

from app.core.responses import PageMeta

T = TypeVar("T")


class ORMBaseSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class PaginatedResponse(BaseModel, Generic[T]):
    model_config = ConfigDict(from_attributes=True)

    items: list[T]
    meta: PageMeta


class ListParams(BaseModel):
    page: int = Field(default=1, ge=1)
    size: int = Field(default=20, ge=1, le=100)
    search: str | None = None
    sort_by: str | None = None
    sort_order: str = Field(default="desc", pattern="^(asc|desc)$")
