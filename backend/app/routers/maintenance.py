from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.dependencies import get_current_user
from app.core.exceptions import NotFoundError
from app.core.responses import APIResponse
from app.database.session import get_db
from app.schemas.maintenance import MaintenanceCreate, MaintenanceRead, MaintenanceUpdate
from app.services.maintenance_service import MaintenanceService
from app.utils.pagination import build_page_meta
from app.utils.response import success_response

router = APIRouter(prefix="/maintenance", tags=["Maintenance"], dependencies=[Depends(get_current_user)])


class CloseMaintenanceRequest(BaseModel):
    end_date: str | None = None


@router.get("", response_model=APIResponse)
async def list_maintenance(
    page: int = Query(default=1, ge=1),
    size: int = Query(default=20, ge=1, le=100),
    search: str | None = Query(default=None),
    sort_by: str | None = Query(default="start_date"),
    sort_order: str = Query(default="desc", pattern="^(asc|desc)$"),
    db: AsyncSession = Depends(get_db),
) -> APIResponse:
    service = MaintenanceService(db)
    items, total = await service.list_maintenance(page, size, search, sort_by, sort_order)
    return success_response(
        [MaintenanceRead.model_validate(item) for item in items],
        meta=build_page_meta(page, size, total).model_dump(),
    )


@router.post("", response_model=APIResponse, status_code=201)
async def create_maintenance(payload: MaintenanceCreate, db: AsyncSession = Depends(get_db)) -> APIResponse:
    service = MaintenanceService(db)
    maintenance = await service.create_maintenance(payload)
    await db.commit()
    return success_response(MaintenanceRead.model_validate(maintenance), message="Maintenance created")


@router.get("/{maintenance_id}", response_model=APIResponse)
async def get_maintenance(maintenance_id: int, db: AsyncSession = Depends(get_db)) -> APIResponse:
    service = MaintenanceService(db)
    maintenance = await service.repository.get(maintenance_id)
    if maintenance is None:
        raise NotFoundError("Maintenance log not found")
    return success_response(MaintenanceRead.model_validate(maintenance))


@router.put("/{maintenance_id}", response_model=APIResponse)
async def update_maintenance(maintenance_id: int, payload: MaintenanceUpdate, db: AsyncSession = Depends(get_db)) -> APIResponse:
    service = MaintenanceService(db)
    maintenance = await service.update_maintenance(maintenance_id, payload)
    await db.commit()
    return success_response(MaintenanceRead.model_validate(maintenance), message="Maintenance updated")


@router.delete("/{maintenance_id}", response_model=APIResponse)
async def delete_maintenance(maintenance_id: int, db: AsyncSession = Depends(get_db)) -> APIResponse:
    service = MaintenanceService(db)
    await service.delete_maintenance(maintenance_id)
    await db.commit()
    return success_response(message="Maintenance deleted")


@router.post("/{maintenance_id}/close", response_model=APIResponse)
async def close_maintenance(maintenance_id: int, db: AsyncSession = Depends(get_db)) -> APIResponse:
    service = MaintenanceService(db)
    maintenance = await service.close_maintenance(maintenance_id)
    await db.commit()
    return success_response(MaintenanceRead.model_validate(maintenance), message="Maintenance closed")
