from collections.abc import Callable

from fastapi import Depends, Header
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.enums import TokenType
from app.core.exceptions import ForbiddenError, UnauthorizedError
from app.database.session import get_db
from app.models.user import User
from app.services.user_service import UserService
from app.auth.security import decode_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
) -> User:
    try:
        payload = decode_token(token)
    except JWTError as exc:
        raise UnauthorizedError("Invalid token") from exc

    if payload.get("type") != TokenType.ACCESS.value:
        raise UnauthorizedError("Invalid access token")

    subject = payload.get("sub")
    if not subject:
        raise UnauthorizedError("Invalid token subject")

    service = UserService(db)
    user = await service.get_by_email(subject)
    if user is None:
        raise UnauthorizedError("User not found")
    return user


def require_roles(*allowed_roles: str) -> Callable:
    async def dependency(user: User = Depends(get_current_user)) -> User:
        if user.role is None or user.role.name not in allowed_roles:
            raise ForbiddenError("Insufficient role permissions")
        return user

    return dependency
