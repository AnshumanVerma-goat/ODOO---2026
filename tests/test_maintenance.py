from datetime import date

import pytest

from app.core.enums import VehicleStatus
from app.schemas.maintenance import MaintenanceCreate
from app.schemas.vehicle import VehicleCreate
from app.services.maintenance_service import MaintenanceService
from app.services.vehicle_service import VehicleService


@pytest.mark.asyncio
async def test_maintenance_transitions_vehicle_status(session):
    vehicle_service = VehicleService(session)
    maintenance_service = MaintenanceService(session)

    vehicle = await vehicle_service.create_vehicle(
        VehicleCreate(
            registration_number="TR-300",
            vehicle_name="Service Rig",
            vehicle_type="Truck",
            maximum_load_capacity=2000,
            odometer=20000,
            acquisition_cost=90000,
            current_status=VehicleStatus.AVAILABLE,
        )
    )
    await session.commit()

    maintenance = await maintenance_service.create_maintenance(
        MaintenanceCreate(
            vehicle_id=vehicle.id,
            maintenance_type="Engine",
            description="Engine tuning",
            maintenance_cost=500,
            start_date=date.today(),
            active=True,
        )
    )
    await session.commit()
    assert maintenance.active is True
    assert (await vehicle_service.repository.get(vehicle.id)).current_status == VehicleStatus.IN_SHOP.value

    closed = await maintenance_service.close_maintenance(maintenance.id)
    await session.commit()
    assert closed.active is False
    assert (await vehicle_service.repository.get(vehicle.id)).current_status == VehicleStatus.AVAILABLE.value
