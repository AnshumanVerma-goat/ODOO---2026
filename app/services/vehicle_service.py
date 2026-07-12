from app.core.enums import VehicleStatus
from app.core.exceptions import ConflictError, NotFoundError
from app.crud.vehicle import VehicleRepository
from app.models.vehicle import Vehicle
from app.schemas.vehicle import VehicleCreate, VehicleUpdate
from app.services.base import BaseService


class VehicleService(BaseService[Vehicle]):
    repository_class = VehicleRepository

    async def get_by_registration_number(self, registration_number: str) -> Vehicle | None:
        return await self.repository.get_one(registration_number=registration_number)

    async def list_vehicles(self, page: int, size: int, search: str | None, sort_by: str | None, sort_order: str, status: str | None = None):
        items, total = await self.repository.list(
            page=page,
            size=size,
            search=search,
            sort_by=sort_by,
            sort_order=sort_order,
            search_fields=("registration_number", "vehicle_name", "vehicle_type"),
            filters={"current_status": status},
        )
        return items, total

    async def create_vehicle(self, data: VehicleCreate) -> Vehicle:
        if await self.get_by_registration_number(data.registration_number):
            raise ConflictError("Vehicle registration number must be unique")
        return await self.repository.create(data.model_dump())

    async def update_vehicle(self, vehicle_id: int, data: VehicleUpdate) -> Vehicle:
        vehicle = await self.repository.get(vehicle_id)
        if vehicle is None:
            raise NotFoundError("Vehicle not found")
        payload = data.model_dump(exclude_unset=True)
        if "registration_number" in payload and payload["registration_number"] != vehicle.registration_number:
            if await self.get_by_registration_number(payload["registration_number"]):
                raise ConflictError("Vehicle registration number must be unique")
        return await self.repository.update(vehicle, payload)

    async def delete_vehicle(self, vehicle_id: int) -> None:
        vehicle = await self.repository.get(vehicle_id)
        if vehicle is None:
            raise NotFoundError("Vehicle not found")
        await self.repository.delete(vehicle)

    async def set_status(self, vehicle_id: int, status: VehicleStatus) -> Vehicle:
        vehicle = await self.repository.get(vehicle_id)
        if vehicle is None:
            raise NotFoundError("Vehicle not found")
        return await self.repository.update(vehicle, {"current_status": status.value})
