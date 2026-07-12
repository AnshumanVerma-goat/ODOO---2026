from app.schemas.auth import LoginRequest, RefreshRequest, RegisterRequest, TokenPair
from app.schemas.dashboard import DashboardKPIs
from app.schemas.driver import DriverCreate, DriverRead, DriverUpdate
from app.schemas.expense import ExpenseCreate, ExpenseRead, ExpenseUpdate
from app.schemas.fuel_log import FuelLogCreate, FuelLogRead, FuelLogUpdate
from app.schemas.maintenance import MaintenanceCreate, MaintenanceRead, MaintenanceUpdate
from app.schemas.report import AnalyticsReport, FleetUtilizationReport, FuelEfficiencyReport, OperationalCostReport, VehicleROIReport
from app.schemas.role import RoleCreate, RoleRead, RoleUpdate
from app.schemas.trip import TripCreate, TripRead, TripUpdate
from app.schemas.user import UserCreate, UserRead, UserUpdate
from app.schemas.vehicle import VehicleCreate, VehicleRead, VehicleUpdate
