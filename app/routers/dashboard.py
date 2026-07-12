from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.dependencies import get_current_user
from app.core.responses import APIResponse
from app.database.session import get_db
from app.services.dashboard_service import DashboardService
from app.utils.response import success_response

router = APIRouter(prefix="/dashboard", tags=["Dashboard"], dependencies=[Depends(get_current_user)])


@router.get("/kpis", response_model=APIResponse)
async def dashboard_kpis(db: AsyncSession = Depends(get_db)) -> APIResponse:
    service = DashboardService(db)
    return success_response(await service.get_kpis())
