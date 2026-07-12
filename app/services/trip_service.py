from datetime import UTC, datetime

from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.core.enums import DriverStatus, TripStatus, VehicleStatus
from app.core.exceptions import ConflictError, NotFoundError
from app.crud.trip import TripRepository
from app.models.driver import Driver
from app.models.trip import Trip
from app.models.vehicle import Vehicle
from app.schemas.trip import TripCreate, TripUpdate
from app.services.base import BaseService
from app.services.driver_service import DriverService
from app.services.vehicle_service import VehicleService


class TripService(BaseService[Trip]):
    repository_class = TripRepository

    async def get_trip(self, trip_id: int) -> Trip | None:
        result = await self.db.execute(
            select(Trip)
            .options(selectinload(Trip.vehicle), selectinload(Trip.driver))
            .where(Trip.id == trip_id)
        )
        return result.scalar_one_or_none()

    async def list_trips(self, page: int, size: int, search: str | None, sort_by: str | None, sort_order: str, status: str | None = None):
        items, total = await self.repository.list(
            page=page,
            size=size,
            search=search,
            sort_by=sort_by,
            sort_order=sort_order,
            search_fields=("source", "destination", "trip_status"),
            filters={"trip_status": status},
        )
        return items, total

    async def create_trip(self, data: TripCreate) -> Trip:
        vehicle = await self.db.get(Vehicle, data.vehicle_id) if data.vehicle_id else None
        if vehicle is not None and vehicle.current_status in {
            VehicleStatus.RETIRED.value,
            VehicleStatus.IN_SHOP.value,
            VehicleStatus.ON_TRIP.value,
        }:
            raise ConflictError("Vehicle cannot be assigned to trips")

        driver = await self.db.get(Driver, data.driver_id) if data.driver_id else None
        if driver is not None:
            DriverService(self.db).validate_license(driver)
            if driver.current_status in {DriverStatus.SUSPENDED.value, DriverStatus.ON_TRIP.value}:
                raise ConflictError("Driver cannot be assigned to trips")

        if vehicle is not None and data.cargo_weight > vehicle.maximum_load_capacity:
            raise ConflictError("Cargo weight exceeds vehicle maximum load capacity")

        return await self.repository.create(data.model_dump())

    async def update_trip(self, trip_id: int, data: TripUpdate) -> Trip:
        trip = await self.repository.get(trip_id)
        if trip is None:
            raise NotFoundError("Trip not found")
        if trip.trip_status != TripStatus.DRAFT.value:
            raise ConflictError("Only draft trips can be updated")

        payload = data.model_dump(exclude_unset=True)
        return await self.repository.update(trip, payload)

    async def delete_trip(self, trip_id: int) -> None:
        trip = await self.repository.get(trip_id)
        if trip is None:
            raise NotFoundError("Trip not found")
        await self.repository.delete(trip)

    async def dispatch_trip(self, trip_id: int, vehicle_id: int, driver_id: int) -> Trip:
        trip = await self.get_trip(trip_id)
        if trip is None:
            raise NotFoundError("Trip not found")
        if trip.trip_status != TripStatus.DRAFT.value:
            raise ConflictError("Only draft trips can be dispatched")

        vehicle = await self.db.get(Vehicle, vehicle_id)
        if vehicle is None:
            raise NotFoundError("Vehicle not found")
        if vehicle.current_status in {VehicleStatus.RETIRED.value, VehicleStatus.IN_SHOP.value, VehicleStatus.ON_TRIP.value}:
            raise ConflictError("Vehicle cannot be assigned")

        driver = await self.db.get(Driver, driver_id)
        if driver is None:
            raise NotFoundError("Driver not found")
        if driver.current_status in {DriverStatus.SUSPENDED.value, DriverStatus.ON_TRIP.value}:
            raise ConflictError("Driver cannot be assigned")
        if driver.license_expiry < datetime.now(UTC).date():
            raise ConflictError("Driver license has expired")

        if trip.cargo_weight > vehicle.maximum_load_capacity:
            raise ConflictError("Cargo weight exceeds vehicle maximum load capacity")

        trip.vehicle_id = vehicle.id
        trip.driver_id = driver.id
        trip.trip_status = TripStatus.DISPATCHED.value
        trip.dispatch_time = datetime.now(UTC)
        vehicle.current_status = VehicleStatus.ON_TRIP.value
        driver.current_status = DriverStatus.ON_TRIP.value
        await self.db.flush()
        await self.db.refresh(trip)
        return trip

    async def complete_trip(self, trip_id: int, actual_distance: float | None = None, fuel_used: float | None = None) -> Trip:
        trip = await self.get_trip(trip_id)
        if trip is None:
            raise NotFoundError("Trip not found")
        if trip.trip_status != TripStatus.DISPATCHED.value:
            raise ConflictError("Only dispatched trips can be completed")

        trip.trip_status = TripStatus.COMPLETED.value
        trip.completion_time = datetime.now(UTC)
        if actual_distance is not None:
            trip.actual_distance = actual_distance
        if fuel_used is not None:
            trip.fuel_used = fuel_used

        if trip.vehicle is not None:
            trip.vehicle.current_status = VehicleStatus.AVAILABLE.value
        if trip.driver is not None:
            trip.driver.current_status = DriverStatus.AVAILABLE.value
        await self.db.flush()
        await self.db.refresh(trip)
        return trip

    async def cancel_trip(self, trip_id: int) -> Trip:
        trip = await self.get_trip(trip_id)
        if trip is None:
            raise NotFoundError("Trip not found")
        if trip.trip_status == TripStatus.COMPLETED.value:
            raise ConflictError("Completed trips cannot be cancelled")

        trip.trip_status = TripStatus.CANCELLED.value
        if trip.vehicle is not None:
            trip.vehicle.current_status = VehicleStatus.AVAILABLE.value
        if trip.driver is not None:
            trip.driver.current_status = DriverStatus.AVAILABLE.value
        await self.db.flush()
        await self.db.refresh(trip)
        return trip
