import pytest

from app.core.enums import VehicleStatus
from app.core.exceptions import ConflictError
from app.schemas.vehicle import VehicleCreate, VehicleUpdate
from app.services.vehicle_service import VehicleService


@pytest.mark.asyncio
async def test_vehicle_create_update_and_unique_registration(session):
    service = VehicleService(session)
    vehicle = await service.create_vehicle(
        VehicleCreate(
            registration_number="TR-001",
            vehicle_name="Freight King",
            vehicle_type="Truck",
            maximum_load_capacity=12000,
            odometer=5000,
            acquisition_cost=150000,
            current_status=VehicleStatus.AVAILABLE,
        )
    )
    await session.commit()
    assert vehicle.registration_number == "TR-001"

    updated = await service.update_vehicle(vehicle.id, VehicleUpdate(vehicle_name="Freight King XL"))
    await session.commit()
    assert updated.vehicle_name == "Freight King XL"

    with pytest.raises(ConflictError):
        await service.create_vehicle(
            VehicleCreate(
                registration_number="TR-001",
                vehicle_name="Duplicate",
                vehicle_type="Truck",
                maximum_load_capacity=10000,
                odometer=0,
                acquisition_cost=100000,
                current_status=VehicleStatus.AVAILABLE,
            )
        )
