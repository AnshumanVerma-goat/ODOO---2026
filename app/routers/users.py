from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.dependencies import require_roles
from app.core.enums import RoleName
from app.core.exceptions import NotFoundError
from app.core.responses import APIResponse
from app.database.session import get_db
from app.schemas.user import UserCreate, UserRead, UserUpdate
from app.services.user_service import UserService
from app.utils.pagination import build_page_meta
from app.utils.response import success_response

router = APIRouter(prefix="/users", tags=["Users"], dependencies=[Depends(require_roles(RoleName.ADMIN.value))])


@router.get("", response_model=APIResponse)
async def list_users(
    page: int = Query(default=1, ge=1),
    size: int = Query(default=20, ge=1, le=100),
    search: str | None = Query(default=None),
    sort_by: str | None = Query(default="created_at"),
    sort_order: str = Query(default="desc", pattern="^(asc|desc)$"),
    db: AsyncSession = Depends(get_db),
) -> APIResponse:
    service = UserService(db)
    items, total = await service.list_users(page, size, search, sort_by, sort_order)
    return success_response(
        [UserRead.model_validate(item) for item in items],
        meta=build_page_meta(page, size, total).model_dump(),
    )


@router.post("", response_model=APIResponse, status_code=201)
async def create_user(payload: UserCreate, db: AsyncSession = Depends(get_db)) -> APIResponse:
    service = UserService(db)
    user = await service.create_user(payload)
    await db.commit()
    refreshed = await service.get_by_id(user.id)
    return success_response(UserRead.model_validate(refreshed), message="User created")


@router.get("/{user_id}", response_model=APIResponse)
async def get_user(user_id: int, db: AsyncSession = Depends(get_db)) -> APIResponse:
    service = UserService(db)
    user = await service.get_by_id(user_id)
    if user is None:
        raise NotFoundError("User not found")
    return success_response(UserRead.model_validate(user))


@router.put("/{user_id}", response_model=APIResponse)
async def update_user(user_id: int, payload: UserUpdate, db: AsyncSession = Depends(get_db)) -> APIResponse:
    service = UserService(db)
    user = await service.update_user(user_id, payload)
    await db.commit()
    refreshed = await service.get_by_id(user.id)
    return success_response(UserRead.model_validate(refreshed), message="User updated")


@router.delete("/{user_id}", response_model=APIResponse)
async def delete_user(user_id: int, db: AsyncSession = Depends(get_db)) -> APIResponse:
    service = UserService(db)
    await service.delete_user(user_id)
    await db.commit()
    return success_response(message="User deleted")
