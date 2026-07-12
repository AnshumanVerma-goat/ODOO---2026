from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.dependencies import get_current_user
from app.core.exceptions import NotFoundError
from app.core.responses import APIResponse
from app.database.session import get_db
from app.schemas.trip import TripCreate, TripRead, TripUpdate
from app.services.trip_service import TripService
from app.utils.pagination import build_page_meta
from app.utils.response import success_response

router = APIRouter(prefix="/trips", tags=["Trips"], dependencies=[Depends(get_current_user)])


class DispatchTripRequest(BaseModel):
    vehicle_id: int
    driver_id: int


class CompleteTripRequest(BaseModel):
    actual_distance: float | None = None
    fuel_used: float | None = None


@router.get("", response_model=APIResponse)
async def list_trips(
    page: int = Query(default=1, ge=1),
    size: int = Query(default=20, ge=1, le=100),
    search: str | None = Query(default=None),
    sort_by: str | None = Query(default="dispatch_time"),
    sort_order: str = Query(default="desc", pattern="^(asc|desc)$"),
    status: str | None = Query(default=None),
    db: AsyncSession = Depends(get_db),
) -> APIResponse:
    service = TripService(db)
    items, total = await service.list_trips(page, size, search, sort_by, sort_order, status)
    return success_response(
        [TripRead.model_validate(item) for item in items],
        meta=build_page_meta(page, size, total).model_dump(),
    )


@router.post("", response_model=APIResponse, status_code=201)
async def create_trip(payload: TripCreate, db: AsyncSession = Depends(get_db)) -> APIResponse:
    service = TripService(db)
    trip = await service.create_trip(payload)
    await db.commit()
    return success_response(TripRead.model_validate(trip), message="Trip created")


@router.get("/{trip_id}", response_model=APIResponse)
async def get_trip(trip_id: int, db: AsyncSession = Depends(get_db)) -> APIResponse:
    service = TripService(db)
    trip = await service.get_trip(trip_id)
    if trip is None:
        raise NotFoundError("Trip not found")
    return success_response(TripRead.model_validate(trip))


@router.put("/{trip_id}", response_model=APIResponse)
async def update_trip(trip_id: int, payload: TripUpdate, db: AsyncSession = Depends(get_db)) -> APIResponse:
    service = TripService(db)
    trip = await service.update_trip(trip_id, payload)
    await db.commit()
    return success_response(TripRead.model_validate(trip), message="Trip updated")


@router.delete("/{trip_id}", response_model=APIResponse)
async def delete_trip(trip_id: int, db: AsyncSession = Depends(get_db)) -> APIResponse:
    service = TripService(db)
    await service.delete_trip(trip_id)
    await db.commit()
    return success_response(message="Trip deleted")


@router.post("/{trip_id}/dispatch", response_model=APIResponse)
async def dispatch_trip(trip_id: int, payload: DispatchTripRequest, db: AsyncSession = Depends(get_db)) -> APIResponse:
    service = TripService(db)
    trip = await service.dispatch_trip(trip_id, payload.vehicle_id, payload.driver_id)
    await db.commit()
    return success_response(TripRead.model_validate(trip), message="Trip dispatched")


@router.post("/{trip_id}/complete", response_model=APIResponse)
async def complete_trip(trip_id: int, payload: CompleteTripRequest, db: AsyncSession = Depends(get_db)) -> APIResponse:
    service = TripService(db)
    trip = await service.complete_trip(trip_id, payload.actual_distance, payload.fuel_used)
    await db.commit()
    return success_response(TripRead.model_validate(trip), message="Trip completed")


@router.post("/{trip_id}/cancel", response_model=APIResponse)
async def cancel_trip(trip_id: int, db: AsyncSession = Depends(get_db)) -> APIResponse:
    service = TripService(db)
    trip = await service.cancel_trip(trip_id)
    await db.commit()
    return success_response(TripRead.model_validate(trip), message="Trip cancelled")
