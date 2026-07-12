from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.dependencies import get_current_user
from app.core.exceptions import NotFoundError
from app.core.responses import APIResponse
from app.database.session import get_db
from app.schemas.driver import DriverCreate, DriverRead, DriverUpdate
from app.services.driver_service import DriverService
from app.utils.pagination import build_page_meta
from app.utils.response import success_response

router = APIRouter(prefix="/drivers", tags=["Drivers"], dependencies=[Depends(get_current_user)])


@router.get("", response_model=APIResponse)
async def list_drivers(
    page: int = Query(default=1, ge=1),
    size: int = Query(default=20, ge=1, le=100),
    search: str | None = Query(default=None),
    sort_by: str | None = Query(default="full_name"),
    sort_order: str = Query(default="asc", pattern="^(asc|desc)$"),
    status: str | None = Query(default=None),
    db: AsyncSession = Depends(get_db),
) -> APIResponse:
    service = DriverService(db)
    items, total = await service.list_drivers(page, size, search, sort_by, sort_order, status)
    return success_response(
        [DriverRead.model_validate(item) for item in items],
        meta=build_page_meta(page, size, total).model_dump(),
    )


@router.post("", response_model=APIResponse, status_code=201)
async def create_driver(payload: DriverCreate, db: AsyncSession = Depends(get_db)) -> APIResponse:
    service = DriverService(db)
    driver = await service.create_driver(payload)
    await db.commit()
    return success_response(DriverRead.model_validate(driver), message="Driver created")


@router.get("/{driver_id}", response_model=APIResponse)
async def get_driver(driver_id: int, db: AsyncSession = Depends(get_db)) -> APIResponse:
    service = DriverService(db)
    driver = await service.repository.get(driver_id)
    if driver is None:
        raise NotFoundError("Driver not found")
    return success_response(DriverRead.model_validate(driver))


@router.put("/{driver_id}", response_model=APIResponse)
async def update_driver(driver_id: int, payload: DriverUpdate, db: AsyncSession = Depends(get_db)) -> APIResponse:
    service = DriverService(db)
    driver = await service.update_driver(driver_id, payload)
    await db.commit()
    return success_response(DriverRead.model_validate(driver), message="Driver updated")


@router.delete("/{driver_id}", response_model=APIResponse)
async def delete_driver(driver_id: int, db: AsyncSession = Depends(get_db)) -> APIResponse:
    service = DriverService(db)
    await service.delete_driver(driver_id)
    await db.commit()
    return success_response(message="Driver deleted")
