from pydantic import EmailStr, Field

from app.schemas.common import ORMBaseSchema
from app.schemas.role import RoleRead


class UserBase(ORMBaseSchema):
    name: str = Field(min_length=2, max_length=150)
    email: EmailStr
    role_id: int


class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=128)


class UserUpdate(ORMBaseSchema):
    name: str | None = Field(default=None, min_length=2, max_length=150)
    email: EmailStr | None = None
    password: str | None = Field(default=None, min_length=8, max_length=128)
    role_id: int | None = None


class UserRead(UserBase):
    id: int
    role: RoleRead | None = None
