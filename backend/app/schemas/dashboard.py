from pydantic import BaseModel


class DashboardKPIs(BaseModel):
    active_vehicles: int
    available_vehicles: int
    vehicles_in_shop: int
    retired_vehicles: int
    drivers_available: int
    drivers_on_trip: int
    drivers_suspended: int
    pending_trips: int
    completed_trips: int
    fleet_utilization: float
    total_fuel_cost: float
    total_maintenance_cost: float
    operational_cost: float
    average_fuel_efficiency: float
    vehicle_roi: float
