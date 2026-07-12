from pydantic import Field

from app.schemas.common import ORMBaseSchema


class RoleBase(ORMBaseSchema):
    name: str = Field(min_length=2, max_length=64)


class RoleCreate(RoleBase):
    pass


class RoleUpdate(ORMBaseSchema):
    name: str | None = Field(default=None, min_length=2, max_length=64)


class RoleRead(RoleBase):
    id: int
