from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.dependencies import get_current_user
from app.core.responses import APIResponse
from app.database.session import get_db
from app.services.report_service import ReportService
from app.utils.response import success_response

router = APIRouter(prefix="/reports", tags=["Reports"], dependencies=[Depends(get_current_user)])


@router.get("/fuel-efficiency", response_model=APIResponse)
async def fuel_efficiency(db: AsyncSession = Depends(get_db)) -> APIResponse:
    service = ReportService(db)
    return success_response(await service.fuel_efficiency_report())


@router.get("/fleet-utilization", response_model=APIResponse)
async def fleet_utilization(db: AsyncSession = Depends(get_db)) -> APIResponse:
    service = ReportService(db)
    return success_response(await service.fleet_utilization_report())


@router.get("/operational-cost", response_model=APIResponse)
async def operational_cost(db: AsyncSession = Depends(get_db)) -> APIResponse:
    service = ReportService(db)
    return success_response(await service.operational_cost_report())


@router.get("/vehicle-roi", response_model=APIResponse)
async def vehicle_roi(db: AsyncSession = Depends(get_db)) -> APIResponse:
    service = ReportService(db)
    return success_response(await service.vehicle_roi_report())


@router.get("/analytics", response_model=APIResponse)
async def analytics(db: AsyncSession = Depends(get_db)) -> APIResponse:
    service = ReportService(db)
    return success_response(await service.analytics_report())
