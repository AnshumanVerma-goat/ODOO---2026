from pydantic import BaseModel, EmailStr, Field, model_validator

from app.schemas.role import RoleRead
from app.schemas.user import UserRead


class RegisterRequest(BaseModel):
    name: str = Field(min_length=2, max_length=150)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    role_id: int | None = None
    role_name: str | None = None

    @model_validator(mode="after")
    def require_role(self) -> "RegisterRequest":
        if self.role_id is None and not self.role_name:
            raise ValueError("Either role_id or role_name is required")
        return self


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class RefreshRequest(BaseModel):
    refresh_token: str


class TokenPair(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserRead
    role: RoleRead | None = None
