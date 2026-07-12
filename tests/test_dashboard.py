from datetime import date

import pytest

from app.core.enums import DriverStatus, TripStatus, VehicleStatus
from app.models.driver import Driver
from app.models.expense import Expense
from app.models.fuel_log import FuelLog
from app.models.maintenance import MaintenanceLog
from app.models.trip import Trip
from app.models.vehicle import Vehicle
from app.schemas.driver import DriverCreate
from app.schemas.trip import TripCreate
from app.schemas.vehicle import VehicleCreate
from app.services.dashboard_service import DashboardService
from app.services.driver_service import DriverService
from app.services.trip_service import TripService
from app.services.vehicle_service import VehicleService


@pytest.mark.asyncio
async def test_dashboard_kpis(session):
    vehicle_service = VehicleService(session)
    driver_service = DriverService(session)
    trip_service = TripService(session)

    active_vehicle = await vehicle_service.create_vehicle(
        VehicleCreate(
            registration_number="TR-400",
            vehicle_name="Active Truck",
            vehicle_type="Truck",
            maximum_load_capacity=5000,
            odometer=1000,
            acquisition_cost=100000,
            current_status=VehicleStatus.AVAILABLE,
        )
    )
    in_shop_vehicle = await vehicle_service.create_vehicle(
        VehicleCreate(
            registration_number="TR-401",
            vehicle_name="Shop Truck",
            vehicle_type="Truck",
            maximum_load_capacity=5000,
            odometer=2000,
            acquisition_cost=100000,
            current_status=VehicleStatus.IN_SHOP,
        )
    )
    await vehicle_service.create_vehicle(
        VehicleCreate(
            registration_number="TR-402",
            vehicle_name="Retired Truck",
            vehicle_type="Truck",
            maximum_load_capacity=5000,
            odometer=3000,
            acquisition_cost=100000,
            current_status=VehicleStatus.RETIRED,
        )
    )
    available_driver = await driver_service.create_driver(
        DriverCreate(
            full_name="Dashboard Driver",
            license_number="LIC-400",
            license_category="Heavy",
            license_expiry=date.today(),
            contact_number="555-0400",
            safety_score=88,
            current_status=DriverStatus.AVAILABLE,
        )
    )
    await driver_service.create_driver(
        DriverCreate(
            full_name="On Trip Driver",
            license_number="LIC-401",
            license_category="Heavy",
            license_expiry=date.today(),
            contact_number="555-0401",
            safety_score=80,
            current_status=DriverStatus.ON_TRIP,
        )
    )
    await session.commit()

    trip = await trip_service.create_trip(
        TripCreate(
            source="Depot A",
            destination="Depot B",
            cargo_weight=500,
            planned_distance=150,
            revenue=2000,
            trip_status=TripStatus.DRAFT,
        )
    )
    await session.commit()
    await trip_service.dispatch_trip(trip.id, active_vehicle.id, available_driver.id)
    await session.commit()
    await trip_service.complete_trip(trip.id, actual_distance=160, fuel_used=20)
    await session.commit()

    session.add(FuelLog(vehicle_id=active_vehicle.id, trip_id=trip.id, liters=20, cost=100, date=date.today()))
    session.add(MaintenanceLog(vehicle_id=in_shop_vehicle.id, maintenance_type="Brake", description="Brake pads", maintenance_cost=250, start_date=date.today(), end_date=None, active=True))
    session.add(Expense(vehicle_id=active_vehicle.id, expense_type="Toll", amount=50, remarks="Road toll", expense_date=date.today()))
    await session.commit()

    dashboard = await DashboardService(session).get_kpis()
    assert dashboard.active_vehicles == 2
    assert dashboard.available_vehicles == 1
    assert dashboard.vehicles_in_shop == 1
    assert dashboard.retired_vehicles == 1
    assert dashboard.drivers_available == 1
    assert dashboard.drivers_on_trip == 1
    assert dashboard.pending_trips == 0
    assert dashboard.completed_trips == 1
    assert dashboard.operational_cost == 350.0
    assert dashboard.average_fuel_efficiency == 8.0
