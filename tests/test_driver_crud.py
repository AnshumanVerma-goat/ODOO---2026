from datetime import date, timedelta

import pytest

from app.core.enums import DriverStatus
from app.core.exceptions import ConflictError
from app.schemas.driver import DriverCreate, DriverUpdate
from app.services.driver_service import DriverService


@pytest.mark.asyncio
async def test_driver_create_update_and_unique_license(session):
    service = DriverService(session)
    driver = await service.create_driver(
        DriverCreate(
            full_name="Alice Driver",
            license_number="LIC-100",
            license_category="Heavy",
            license_expiry=date.today() + timedelta(days=365),
            contact_number="555-0100",
            safety_score=92,
            current_status=DriverStatus.AVAILABLE,
        )
    )
    await session.commit()
    assert driver.license_number == "LIC-100"

    updated = await service.update_driver(driver.id, DriverUpdate(contact_number="555-0199"))
    await session.commit()
    assert updated.contact_number == "555-0199"

    with pytest.raises(ConflictError):
        await service.create_driver(
            DriverCreate(
                full_name="Bob Driver",
                license_number="LIC-100",
                license_category="Heavy",
                license_expiry=date.today() + timedelta(days=365),
                contact_number="555-0111",
                safety_score=88,
                current_status=DriverStatus.AVAILABLE,
            )
        )
