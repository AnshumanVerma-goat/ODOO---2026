from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.dependencies import require_roles
from app.core.enums import RoleName
from app.core.exceptions import NotFoundError
from app.core.responses import APIResponse
from app.database.session import get_db
from app.schemas.role import RoleCreate, RoleRead, RoleUpdate
from app.services.role_service import RoleService
from app.utils.pagination import build_page_meta
from app.utils.response import success_response

router = APIRouter(prefix="/roles", tags=["Roles"], dependencies=[Depends(require_roles(RoleName.ADMIN.value))])


@router.get("", response_model=APIResponse)
async def list_roles(
    page: int = Query(default=1, ge=1),
    size: int = Query(default=20, ge=1, le=100),
    search: str | None = Query(default=None),
    sort_by: str | None = Query(default="name"),
    sort_order: str = Query(default="asc", pattern="^(asc|desc)$"),
    db: AsyncSession = Depends(get_db),
) -> APIResponse:
    service = RoleService(db)
    items, total = await service.list_roles(page, size, search, sort_by, sort_order)
    return success_response(
        [RoleRead.model_validate(item) for item in items],
        meta=build_page_meta(page, size, total).model_dump(),
    )


@router.post("", response_model=APIResponse, status_code=201)
async def create_role(payload: RoleCreate, db: AsyncSession = Depends(get_db)) -> APIResponse:
    service = RoleService(db)
    role = await service.create_role(payload)
    await db.commit()
    return success_response(RoleRead.model_validate(role), message="Role created")


@router.get("/{role_id}", response_model=APIResponse)
async def get_role(role_id: int, db: AsyncSession = Depends(get_db)) -> APIResponse:
    service = RoleService(db)
    role = await service.repository.get(role_id)
    if role is None:
        raise NotFoundError("Role not found")
    return success_response(RoleRead.model_validate(role))


@router.put("/{role_id}", response_model=APIResponse)
async def update_role(role_id: int, payload: RoleUpdate, db: AsyncSession = Depends(get_db)) -> APIResponse:
    service = RoleService(db)
    role = await service.update_role(role_id, payload)
    await db.commit()
    return success_response(RoleRead.model_validate(role), message="Role updated")


@router.delete("/{role_id}", response_model=APIResponse)
async def delete_role(role_id: int, db: AsyncSession = Depends(get_db)) -> APIResponse:
    service = RoleService(db)
    await service.delete_role(role_id)
    await db.commit()
    return success_response(message="Role deleted")
