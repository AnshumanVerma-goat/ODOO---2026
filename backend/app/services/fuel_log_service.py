from app.core.exceptions import NotFoundError
from app.crud.fuel_log import FuelLogRepository
from app.models.fuel_log import FuelLog
from app.models.trip import Trip
from app.models.vehicle import Vehicle
from app.schemas.fuel_log import FuelLogCreate, FuelLogUpdate
from app.services.base import BaseService


class FuelLogService(BaseService[FuelLog]):
    repository_class = FuelLogRepository

    async def list_fuel_logs(self, page: int, size: int, search: str | None, sort_by: str | None, sort_order: str):
        return await self.repository.list(
            page=page,
            size=size,
            search=search,
            sort_by=sort_by,
            sort_order=sort_order,
            search_fields=(),
        )

    async def create_fuel_log(self, data: FuelLogCreate) -> FuelLog:
        vehicle = await self.db.get(Vehicle, data.vehicle_id)
        if vehicle is None:
            raise NotFoundError("Vehicle not found")
        if data.trip_id is not None:
            trip = await self.db.get(Trip, data.trip_id)
            if trip is None:
                raise NotFoundError("Trip not found")
            if trip.vehicle_id not in {None, vehicle.id}:
                raise NotFoundError("Trip does not belong to vehicle")
        return await self.repository.create(data.model_dump())

    async def update_fuel_log(self, fuel_log_id: int, data: FuelLogUpdate) -> FuelLog:
        fuel_log = await self.repository.get(fuel_log_id)
        if fuel_log is None:
            raise NotFoundError("Fuel log not found")
        payload = data.model_dump(exclude_unset=True)
        return await self.repository.update(fuel_log, payload)

    async def delete_fuel_log(self, fuel_log_id: int) -> None:
        fuel_log = await self.repository.get(fuel_log_id)
        if fuel_log is None:
            raise NotFoundError("Fuel log not found")
        await self.repository.delete(fuel_log)
