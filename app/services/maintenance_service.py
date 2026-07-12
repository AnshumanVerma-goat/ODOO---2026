from datetime import date

from app.core.enums import VehicleStatus
from app.core.exceptions import ConflictError, NotFoundError
from app.crud.maintenance import MaintenanceRepository
from app.models.maintenance import MaintenanceLog
from app.models.vehicle import Vehicle
from app.schemas.maintenance import MaintenanceCreate, MaintenanceUpdate
from app.services.base import BaseService


class MaintenanceService(BaseService[MaintenanceLog]):
    repository_class = MaintenanceRepository

    async def list_maintenance(self, page: int, size: int, search: str | None, sort_by: str | None, sort_order: str):
        return await self.repository.list(
            page=page,
            size=size,
            search=search,
            sort_by=sort_by,
            sort_order=sort_order,
            search_fields=("maintenance_type", "description"),
        )

    async def create_maintenance(self, data: MaintenanceCreate) -> MaintenanceLog:
        vehicle = await self.db.get(Vehicle, data.vehicle_id)
        if vehicle is None:
            raise NotFoundError("Vehicle not found")
        if vehicle.current_status == VehicleStatus.RETIRED.value:
            raise ConflictError("Retired vehicles cannot enter maintenance")
        if vehicle.current_status == VehicleStatus.ON_TRIP.value:
            raise ConflictError("Vehicle on trip cannot enter maintenance")

        maintenance = await self.repository.create(data.model_dump())
        vehicle.current_status = VehicleStatus.IN_SHOP.value
        await self.db.flush()
        await self.db.refresh(maintenance)
        return maintenance

    async def update_maintenance(self, maintenance_id: int, data: MaintenanceUpdate) -> MaintenanceLog:
        maintenance = await self.repository.get(maintenance_id)
        if maintenance is None:
            raise NotFoundError("Maintenance log not found")
        payload = data.model_dump(exclude_unset=True)
        if "vehicle_id" in payload:
            vehicle = await self.db.get(Vehicle, payload["vehicle_id"])
            if vehicle is None:
                raise NotFoundError("Vehicle not found")
        return await self.repository.update(maintenance, payload)

    async def close_maintenance(self, maintenance_id: int, end_date: date | None = None) -> MaintenanceLog:
        maintenance = await self.repository.get(maintenance_id)
        if maintenance is None:
            raise NotFoundError("Maintenance log not found")

        vehicle = await self.db.get(Vehicle, maintenance.vehicle_id)
        if vehicle is None:
            raise NotFoundError("Vehicle not found")

        maintenance.active = False
        maintenance.end_date = end_date or date.today()
        if vehicle.current_status != VehicleStatus.RETIRED.value:
            vehicle.current_status = VehicleStatus.AVAILABLE.value
        await self.db.flush()
        await self.db.refresh(maintenance)
        return maintenance

    async def delete_maintenance(self, maintenance_id: int) -> None:
        maintenance = await self.repository.get(maintenance_id)
        if maintenance is None:
            raise NotFoundError("Maintenance log not found")
        await self.repository.delete(maintenance)
