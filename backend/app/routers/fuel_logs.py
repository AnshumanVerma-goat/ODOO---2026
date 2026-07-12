from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.dependencies import get_current_user
from app.core.exceptions import NotFoundError
from app.core.responses import APIResponse
from app.database.session import get_db
from app.schemas.fuel_log import FuelLogCreate, FuelLogRead, FuelLogUpdate
from app.services.fuel_log_service import FuelLogService
from app.utils.pagination import build_page_meta
from app.utils.response import success_response

router = APIRouter(prefix="/fuel-logs", tags=["Fuel Logs"], dependencies=[Depends(get_current_user)])


@router.get("", response_model=APIResponse)
async def list_fuel_logs(
    page: int = Query(default=1, ge=1),
    size: int = Query(default=20, ge=1, le=100),
    search: str | None = Query(default=None),
    sort_by: str | None = Query(default="date"),
    sort_order: str = Query(default="desc", pattern="^(asc|desc)$"),
    db: AsyncSession = Depends(get_db),
) -> APIResponse:
    service = FuelLogService(db)
    items, total = await service.list_fuel_logs(page, size, search, sort_by, sort_order)
    return success_response(
        [FuelLogRead.model_validate(item) for item in items],
        meta=build_page_meta(page, size, total).model_dump(),
    )


@router.post("", response_model=APIResponse, status_code=201)
async def create_fuel_log(payload: FuelLogCreate, db: AsyncSession = Depends(get_db)) -> APIResponse:
    service = FuelLogService(db)
    fuel_log = await service.create_fuel_log(payload)
    await db.commit()
    return success_response(FuelLogRead.model_validate(fuel_log), message="Fuel log created")


@router.get("/{fuel_log_id}", response_model=APIResponse)
async def get_fuel_log(fuel_log_id: int, db: AsyncSession = Depends(get_db)) -> APIResponse:
    service = FuelLogService(db)
    fuel_log = await service.repository.get(fuel_log_id)
    if fuel_log is None:
        raise NotFoundError("Fuel log not found")
    return success_response(FuelLogRead.model_validate(fuel_log))


@router.put("/{fuel_log_id}", response_model=APIResponse)
async def update_fuel_log(fuel_log_id: int, payload: FuelLogUpdate, db: AsyncSession = Depends(get_db)) -> APIResponse:
    service = FuelLogService(db)
    fuel_log = await service.update_fuel_log(fuel_log_id, payload)
    await db.commit()
    return success_response(FuelLogRead.model_validate(fuel_log), message="Fuel log updated")


@router.delete("/{fuel_log_id}", response_model=APIResponse)
async def delete_fuel_log(fuel_log_id: int, db: AsyncSession = Depends(get_db)) -> APIResponse:
    service = FuelLogService(db)
    await service.delete_fuel_log(fuel_log_id)
    await db.commit()
    return success_response(message="Fuel log deleted")
