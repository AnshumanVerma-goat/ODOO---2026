from sqlalchemy import func, select

from app.core.enums import DriverStatus, TripStatus, VehicleStatus
from app.models.driver import Driver
from app.models.expense import Expense
from app.models.fuel_log import FuelLog
from app.models.maintenance import MaintenanceLog
from app.models.trip import Trip
from app.models.vehicle import Vehicle
from app.schemas.dashboard import DashboardKPIs


class DashboardService:
    def __init__(self, db):
        self.db = db

    async def get_kpis(self) -> DashboardKPIs:
        active_vehicles_stmt = select(func.count()).select_from(Vehicle).where(Vehicle.current_status != VehicleStatus.RETIRED.value)
        available_vehicles_stmt = select(func.count()).select_from(Vehicle).where(Vehicle.current_status == VehicleStatus.AVAILABLE.value)
        vehicles_in_shop_stmt = select(func.count()).select_from(Vehicle).where(Vehicle.current_status == VehicleStatus.IN_SHOP.value)
        retired_vehicles_stmt = select(func.count()).select_from(Vehicle).where(Vehicle.current_status == VehicleStatus.RETIRED.value)

        drivers_available_stmt = select(func.count()).select_from(Driver).where(Driver.current_status == DriverStatus.AVAILABLE.value)
        drivers_on_trip_stmt = select(func.count()).select_from(Driver).where(Driver.current_status == DriverStatus.ON_TRIP.value)
        drivers_suspended_stmt = select(func.count()).select_from(Driver).where(Driver.current_status == DriverStatus.SUSPENDED.value)

        pending_trips_stmt = select(func.count()).select_from(Trip).where(Trip.trip_status == TripStatus.DRAFT.value)
        completed_trips_stmt = select(func.count()).select_from(Trip).where(Trip.trip_status == TripStatus.COMPLETED.value)

        total_fuel_cost_stmt = select(func.coalesce(func.sum(FuelLog.cost), 0.0))
        total_maintenance_cost_stmt = select(func.coalesce(func.sum(MaintenanceLog.maintenance_cost), 0.0))
        total_revenue_stmt = select(func.coalesce(func.sum(Trip.revenue), 0.0)).where(Trip.trip_status == TripStatus.COMPLETED.value)
        total_acquisition_stmt = select(func.coalesce(func.sum(Vehicle.acquisition_cost), 0.0))
        total_distance_stmt = select(func.coalesce(func.sum(func.coalesce(Trip.actual_distance, Trip.planned_distance)), 0.0)).where(
            Trip.trip_status == TripStatus.COMPLETED.value
        )
        total_fuel_used_stmt = select(func.coalesce(func.sum(func.coalesce(Trip.fuel_used, 0.0)), 0.0)).where(
            Trip.trip_status == TripStatus.COMPLETED.value
        )

        active_vehicles = (await self.db.execute(active_vehicles_stmt)).scalar_one()
        available_vehicles = (await self.db.execute(available_vehicles_stmt)).scalar_one()
        vehicles_in_shop = (await self.db.execute(vehicles_in_shop_stmt)).scalar_one()
        retired_vehicles = (await self.db.execute(retired_vehicles_stmt)).scalar_one()

        drivers_available = (await self.db.execute(drivers_available_stmt)).scalar_one()
        drivers_on_trip = (await self.db.execute(drivers_on_trip_stmt)).scalar_one()
        drivers_suspended = (await self.db.execute(drivers_suspended_stmt)).scalar_one()

        pending_trips = (await self.db.execute(pending_trips_stmt)).scalar_one()
        completed_trips = (await self.db.execute(completed_trips_stmt)).scalar_one()

        total_fuel_cost = float((await self.db.execute(total_fuel_cost_stmt)).scalar_one())
        total_maintenance_cost = float((await self.db.execute(total_maintenance_cost_stmt)).scalar_one())
        total_revenue = float((await self.db.execute(total_revenue_stmt)).scalar_one())
        total_acquisition_cost = float((await self.db.execute(total_acquisition_stmt)).scalar_one())
        total_distance = float((await self.db.execute(total_distance_stmt)).scalar_one())
        total_fuel_used = float((await self.db.execute(total_fuel_used_stmt)).scalar_one())

        fleet_utilization = round(((active_vehicles - available_vehicles) / active_vehicles) * 100, 2) if active_vehicles else 0.0
        average_fuel_efficiency = round(total_distance / total_fuel_used, 2) if total_fuel_used else 0.0
        operational_cost = round(total_fuel_cost + total_maintenance_cost, 2)
        vehicle_roi = round(((total_revenue - operational_cost) / total_acquisition_cost) * 100, 2) if total_acquisition_cost else 0.0

        return DashboardKPIs(
            active_vehicles=active_vehicles,
            available_vehicles=available_vehicles,
            vehicles_in_shop=vehicles_in_shop,
            retired_vehicles=retired_vehicles,
            drivers_available=drivers_available,
            drivers_on_trip=drivers_on_trip,
            drivers_suspended=drivers_suspended,
            pending_trips=pending_trips,
            completed_trips=completed_trips,
            fleet_utilization=fleet_utilization,
            total_fuel_cost=total_fuel_cost,
            total_maintenance_cost=total_maintenance_cost,
            operational_cost=operational_cost,
            average_fuel_efficiency=average_fuel_efficiency,
            vehicle_roi=vehicle_roi,
        )
