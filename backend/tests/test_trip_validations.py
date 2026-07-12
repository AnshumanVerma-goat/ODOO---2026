from datetime import date, timedelta

import pytest

from app.core.enums import DriverStatus, TripStatus, VehicleStatus
from app.core.exceptions import ConflictError
from app.schemas.driver import DriverCreate
from app.schemas.trip import TripCreate
from app.schemas.vehicle import VehicleCreate
from app.services.driver_service import DriverService
from app.services.trip_service import TripService
from app.services.vehicle_service import VehicleService


@pytest.mark.asyncio
async def test_trip_validations_and_state_transitions(session):
    vehicle_service = VehicleService(session)
    driver_service = DriverService(session)
    trip_service = TripService(session)

    vehicle = await vehicle_service.create_vehicle(
        VehicleCreate(
            registration_number="TR-200",
            vehicle_name="Runner",
            vehicle_type="Van",
            maximum_load_capacity=1000,
            odometer=12000,
            acquisition_cost=50000,
            current_status=VehicleStatus.AVAILABLE,
        )
    )
    driver = await driver_service.create_driver(
        DriverCreate(
            full_name="Carol Driver",
            license_number="LIC-200",
            license_category="Medium",
            license_expiry=date.today() + timedelta(days=365),
            contact_number="555-0200",
            safety_score=90,
            current_status=DriverStatus.AVAILABLE,
        )
    )
    await session.commit()

    with pytest.raises(ConflictError):
        await trip_service.create_trip(
            TripCreate(
                source="Depot",
                destination="Port",
                vehicle_id=vehicle.id,
                driver_id=driver.id,
                cargo_weight=2000,
                planned_distance=100,
                revenue=1000,
                trip_status=TripStatus.DRAFT,
            )
        )

    trip = await trip_service.create_trip(
        TripCreate(
            source="Depot",
            destination="Port",
            vehicle_id=None,
            driver_id=None,
            cargo_weight=500,
            planned_distance=100,
            revenue=1000,
            trip_status=TripStatus.DRAFT,
        )
    )
    await session.commit()

    dispatched = await trip_service.dispatch_trip(trip.id, vehicle.id, driver.id)
    await session.commit()
    assert dispatched.trip_status == TripStatus.DISPATCHED.value
    assert (await vehicle_service.repository.get(vehicle.id)).current_status == VehicleStatus.ON_TRIP.value
    assert (await driver_service.repository.get(driver.id)).current_status == DriverStatus.ON_TRIP.value

    completed = await trip_service.complete_trip(trip.id, actual_distance=105, fuel_used=12)
    await session.commit()
    assert completed.trip_status == TripStatus.COMPLETED.value
    assert (await vehicle_service.repository.get(vehicle.id)).current_status == VehicleStatus.AVAILABLE.value
    assert (await driver_service.repository.get(driver.id)).current_status == DriverStatus.AVAILABLE.value


@pytest.mark.asyncio
async def test_expired_driver_cannot_be_assigned(session):
    vehicle_service = VehicleService(session)
    driver_service = DriverService(session)
    trip_service = TripService(session)

    vehicle = await vehicle_service.create_vehicle(
        VehicleCreate(
            registration_number="TR-201",
            vehicle_name="Runner 2",
            vehicle_type="Van",
            maximum_load_capacity=1000,
            odometer=12000,
            acquisition_cost=50000,
            current_status=VehicleStatus.AVAILABLE,
        )
    )
    driver = await driver_service.create_driver(
        DriverCreate(
            full_name="Expired Driver",
            license_number="LIC-201",
            license_category="Medium",
            license_expiry=date.today() - timedelta(days=1),
            contact_number="555-0201",
            safety_score=70,
            current_status=DriverStatus.AVAILABLE,
        )
    )
    trip = await trip_service.create_trip(
        TripCreate(
            source="Depot",
            destination="Hub",
            vehicle_id=None,
            driver_id=None,
            cargo_weight=500,
            planned_distance=100,
            revenue=1000,
            trip_status=TripStatus.DRAFT,
        )
    )
    await session.commit()

    with pytest.raises(ConflictError):
        await trip_service.dispatch_trip(trip.id, vehicle.id, driver.id)
