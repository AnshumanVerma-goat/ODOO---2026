from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.dependencies import get_current_user
from app.core.responses import APIResponse
from app.database.session import get_db
from app.schemas.vehicle import VehicleCreate, VehicleRead, VehicleUpdate
from app.services.vehicle_service import VehicleService
from app.utils.pagination import build_page_meta
from app.utils.response import success_response

router = APIRouter(prefix="/vehicles", tags=["Vehicles"], dependencies=[Depends(get_current_user)])


@router.get("", response_model=APIResponse)
async def list_vehicles(
    page: int = Query(default=1, ge=1),
    size: int = Query(default=20, ge=1, le=100),
    search: str | None = Query(default=None),
    sort_by: str | None = Query(default="created_at"),
    sort_order: str = Query(default="desc", pattern="^(asc|desc)$"),
    status: str | None = Query(default=None),
    db: AsyncSession = Depends(get_db),
) -> APIResponse:
    service = VehicleService(db)
    items, total = await service.list_vehicles(page, size, search, sort_by, sort_order, status)
    return success_response(
        [VehicleRead.model_validate(item) for item in items],
        meta=build_page_meta(page, size, total).model_dump(),
    )


@router.post("", response_model=APIResponse, status_code=201)
async def create_vehicle(payload: VehicleCreate, db: AsyncSession = Depends(get_db)) -> APIResponse:
    service = VehicleService(db)
    vehicle = await service.create_vehicle(payload)
    await db.commit()
    return success_response(VehicleRead.model_validate(vehicle), message="Vehicle created")


@router.get("/{vehicle_id}", response_model=APIResponse)
async def get_vehicle(vehicle_id: int, db: AsyncSession = Depends(get_db)) -> APIResponse:
    service = VehicleService(db)
    vehicle = await service.repository.get(vehicle_id)
    if vehicle is None:
        from app.core.exceptions import NotFoundError

        raise NotFoundError("Vehicle not found")
    return success_response(VehicleRead.model_validate(vehicle))


@router.put("/{vehicle_id}", response_model=APIResponse)
async def update_vehicle(vehicle_id: int, payload: VehicleUpdate, db: AsyncSession = Depends(get_db)) -> APIResponse:
    service = VehicleService(db)
    vehicle = await service.update_vehicle(vehicle_id, payload)
    await db.commit()
    return success_response(VehicleRead.model_validate(vehicle), message="Vehicle updated")


@router.delete("/{vehicle_id}", response_model=APIResponse)
async def delete_vehicle(vehicle_id: int, db: AsyncSession = Depends(get_db)) -> APIResponse:
    service = VehicleService(db)
    await service.delete_vehicle(vehicle_id)
    await db.commit()
    return success_response(message="Vehicle deleted")
