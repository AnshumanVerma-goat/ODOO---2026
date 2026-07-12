from pydantic import BaseModel


class FuelEfficiencyReport(BaseModel):
    trip_id: int | None = None
    vehicle_id: int
    total_distance: float
    total_fuel: float
    fuel_efficiency: float


class FleetUtilizationReport(BaseModel):
    fleet_size: int
    active_units: int
    utilization_percent: float


class OperationalCostReport(BaseModel):
    total_fuel_cost: float
    total_maintenance_cost: float
    operational_cost: float


class VehicleROIReport(BaseModel):
    vehicle_id: int
    revenue: float
    fuel_cost: float
    maintenance_cost: float
    acquisition_cost: float
    roi: float


class AnalyticsReport(BaseModel):
    fuel_efficiency: list[FuelEfficiencyReport]
    fleet_utilization: FleetUtilizationReport
    operational_cost: OperationalCostReport
    vehicle_roi: list[VehicleROIReport]
