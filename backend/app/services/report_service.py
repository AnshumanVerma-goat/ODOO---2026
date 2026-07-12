from sqlalchemy import func, select

from app.core.enums import TripStatus, VehicleStatus
from app.models.expense import Expense
from app.models.fuel_log import FuelLog
from app.models.maintenance import MaintenanceLog
from app.models.trip import Trip
from app.models.vehicle import Vehicle
from app.schemas.report import (
    AnalyticsReport,
    FleetUtilizationReport,
    FuelEfficiencyReport,
    OperationalCostReport,
    VehicleROIReport,
)


class ReportService:
    def __init__(self, db):
        self.db = db

    async def fuel_efficiency_report(self) -> list[FuelEfficiencyReport]:
        stmt = (
            select(
                Trip.vehicle_id.label("vehicle_id"),
                func.coalesce(func.sum(func.coalesce(Trip.actual_distance, Trip.planned_distance)), 0.0).label("total_distance"),
                func.coalesce(func.sum(func.coalesce(Trip.fuel_used, 0.0)), 0.0).label("total_fuel"),
            )
            .where(Trip.trip_status == TripStatus.COMPLETED.value)
            .group_by(Trip.vehicle_id)
        )
        rows = (await self.db.execute(stmt)).all()
        reports: list[FuelEfficiencyReport] = []
        for row in rows:
            total_fuel = float(row.total_fuel)
            total_distance = float(row.total_distance)
            efficiency = round(total_distance / total_fuel, 2) if total_fuel else 0.0
            reports.append(
                FuelEfficiencyReport(
                    trip_id=None,
                    vehicle_id=row.vehicle_id,
                    total_distance=total_distance,
                    total_fuel=total_fuel,
                    fuel_efficiency=efficiency,
                )
            )
        return reports

    async def fleet_utilization_report(self) -> FleetUtilizationReport:
        fleet_size_stmt = select(func.count()).select_from(Vehicle).where(Vehicle.current_status != VehicleStatus.RETIRED.value)
        active_units_stmt = select(func.count()).select_from(Vehicle).where(Vehicle.current_status == VehicleStatus.ON_TRIP.value)
        fleet_size = (await self.db.execute(fleet_size_stmt)).scalar_one()
        active_units = (await self.db.execute(active_units_stmt)).scalar_one()
        utilization_percent = round((active_units / fleet_size) * 100, 2) if fleet_size else 0.0
        return FleetUtilizationReport(
            fleet_size=fleet_size,
            active_units=active_units,
            utilization_percent=utilization_percent,
        )

    async def operational_cost_report(self) -> OperationalCostReport:
        fuel_cost_stmt = select(func.coalesce(func.sum(FuelLog.cost), 0.0))
        maintenance_cost_stmt = select(func.coalesce(func.sum(MaintenanceLog.maintenance_cost), 0.0))
        fuel_cost = float((await self.db.execute(fuel_cost_stmt)).scalar_one())
        maintenance_cost = float((await self.db.execute(maintenance_cost_stmt)).scalar_one())
        return OperationalCostReport(
            total_fuel_cost=fuel_cost,
            total_maintenance_cost=maintenance_cost,
            operational_cost=round(fuel_cost + maintenance_cost, 2),
        )

    async def vehicle_roi_report(self) -> list[VehicleROIReport]:
        revenue_subquery = (
            select(Trip.vehicle_id.label("vehicle_id"), func.coalesce(func.sum(Trip.revenue), 0.0).label("revenue"))
            .where(Trip.trip_status == TripStatus.COMPLETED.value)
            .group_by(Trip.vehicle_id)
            .subquery()
        )
        fuel_subquery = (
            select(FuelLog.vehicle_id.label("vehicle_id"), func.coalesce(func.sum(FuelLog.cost), 0.0).label("fuel_cost"))
            .group_by(FuelLog.vehicle_id)
            .subquery()
        )
        maintenance_subquery = (
            select(
                MaintenanceLog.vehicle_id.label("vehicle_id"),
                func.coalesce(func.sum(MaintenanceLog.maintenance_cost), 0.0).label("maintenance_cost"),
            )
            .group_by(MaintenanceLog.vehicle_id)
            .subquery()
        )

        stmt = (
            select(
                Vehicle.id.label("vehicle_id"),
                Vehicle.acquisition_cost.label("acquisition_cost"),
                func.coalesce(revenue_subquery.c.revenue, 0.0).label("revenue"),
                func.coalesce(fuel_subquery.c.fuel_cost, 0.0).label("fuel_cost"),
                func.coalesce(maintenance_subquery.c.maintenance_cost, 0.0).label("maintenance_cost"),
            )
            .outerjoin(revenue_subquery, revenue_subquery.c.vehicle_id == Vehicle.id)
            .outerjoin(fuel_subquery, fuel_subquery.c.vehicle_id == Vehicle.id)
            .outerjoin(maintenance_subquery, maintenance_subquery.c.vehicle_id == Vehicle.id)
        )
        rows = (await self.db.execute(stmt)).all()
        reports: list[VehicleROIReport] = []
        for row in rows:
            operational_cost = float(row.fuel_cost) + float(row.maintenance_cost)
            roi = ((float(row.revenue) - operational_cost) / float(row.acquisition_cost) * 100) if row.acquisition_cost else 0.0
            reports.append(
                VehicleROIReport(
                    vehicle_id=row.vehicle_id,
                    revenue=float(row.revenue),
                    fuel_cost=float(row.fuel_cost),
                    maintenance_cost=float(row.maintenance_cost),
                    acquisition_cost=float(row.acquisition_cost),
                    roi=round(roi, 2),
                )
            )
        return reports

    async def analytics_report(self) -> AnalyticsReport:
        fuel_efficiency = await self.fuel_efficiency_report()
        fleet_utilization = await self.fleet_utilization_report()
        operational_cost = await self.operational_cost_report()
        vehicle_roi = await self.vehicle_roi_report()
        return AnalyticsReport(
            fuel_efficiency=fuel_efficiency,
            fleet_utilization=fleet_utilization,
            operational_cost=operational_cost,
            vehicle_roi=vehicle_roi,
        )
