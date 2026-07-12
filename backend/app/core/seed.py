from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.enums import RoleName
from app.models.role import Role

DEFAULT_ROLES = [
    RoleName.ADMIN.value,
    RoleName.FLEET_MANAGER.value,
    RoleName.DISPATCHER.value,
    RoleName.SAFETY_OFFICER.value,
    RoleName.FINANCIAL_ANALYST.value,
]


async def seed_roles(db: AsyncSession) -> None:
    result = await db.execute(select(Role.name))
    existing = set(result.scalars().all())
    for role_name in DEFAULT_ROLES:
        if role_name not in existing:
            db.add(Role(name=role_name))
    await db.commit()
