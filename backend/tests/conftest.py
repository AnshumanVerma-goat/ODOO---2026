from collections.abc import AsyncGenerator
from pathlib import Path

import pytest
import pytest_asyncio
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.core.seed import seed_roles
from app.database.base import Base
from app.models import expense, driver, fuel_log, maintenance, role, trip, user, vehicle


@pytest.fixture
def db_url(tmp_path: Path) -> str:
    return f"sqlite+aiosqlite:///{tmp_path / 'transitops_test.db'}"


@pytest_asyncio.fixture
async def session(db_url: str) -> AsyncGenerator[AsyncSession, None]:
    engine = create_async_engine(db_url, future=True)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    session_factory = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    async with session_factory() as db:
        await seed_roles(db)
        yield db
    await engine.dispose()
