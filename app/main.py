from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config.logging import configure_logging
from app.config.settings import get_settings
from app.core.seed import seed_roles
from app.database.session import AsyncSessionLocal
from app.middleware.exception_handler import register_exception_handlers
from app.middleware.request_logging import RequestLoggingMiddleware
from app.routers.auth import router as auth_router
from app.routers.dashboard import router as dashboard_router
from app.routers.drivers import router as drivers_router
from app.routers.expenses import router as expenses_router
from app.routers.fuel_logs import router as fuel_logs_router
from app.routers.maintenance import router as maintenance_router
from app.routers.reports import router as reports_router
from app.routers.roles import router as roles_router
from app.routers.trips import router as trips_router
from app.routers.users import router as users_router
from app.routers.vehicles import router as vehicles_router

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with AsyncSessionLocal() as session:
        await seed_roles(session)
    yield


def create_app() -> FastAPI:
    configure_logging()
    app = FastAPI(title=settings.project_name, version="1.0.0", lifespan=lifespan)
    app.add_middleware(RequestLoggingMiddleware)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    register_exception_handlers(app)

    app.include_router(auth_router, prefix=settings.api_v1_prefix)
    app.include_router(roles_router, prefix=settings.api_v1_prefix)
    app.include_router(users_router, prefix=settings.api_v1_prefix)
    app.include_router(vehicles_router, prefix=settings.api_v1_prefix)
    app.include_router(drivers_router, prefix=settings.api_v1_prefix)
    app.include_router(trips_router, prefix=settings.api_v1_prefix)
    app.include_router(maintenance_router, prefix=settings.api_v1_prefix)
    app.include_router(fuel_logs_router, prefix=settings.api_v1_prefix)
    app.include_router(expenses_router, prefix=settings.api_v1_prefix)
    app.include_router(dashboard_router, prefix=settings.api_v1_prefix)
    app.include_router(reports_router, prefix=settings.api_v1_prefix)

    @app.get("/health", tags=["System"])
    async def health_check() -> dict[str, str]:
        return {"status": "ok", "service": settings.project_name}

    return app


app = create_app()
