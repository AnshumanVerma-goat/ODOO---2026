from typing import Any

from pydantic import BaseModel, ConfigDict, Field


class APIResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    success: bool = True
    message: str = "OK"
    data: Any | None = None
    meta: dict[str, Any] | None = None


class PageMeta(BaseModel):
    page: int = Field(ge=1)
    size: int = Field(ge=1)
    total: int = Field(ge=0)
    pages: int = Field(ge=0)
