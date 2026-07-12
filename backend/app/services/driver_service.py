from datetime import date

from app.core.enums import DriverStatus
from app.core.exceptions import ConflictError, NotFoundError
from app.crud.driver import DriverRepository
from app.models.driver import Driver
from app.schemas.driver import DriverCreate, DriverUpdate
from app.services.base import BaseService


class DriverService(BaseService[Driver]):
    repository_class = DriverRepository

    async def get_by_license_number(self, license_number: str) -> Driver | None:
        return await self.repository.get_one(license_number=license_number)

    async def list_drivers(self, page: int, size: int, search: str | None, sort_by: str | None, sort_order: str, status: str | None = None):
        items, total = await self.repository.list(
            page=page,
            size=size,
            search=search,
            sort_by=sort_by,
            sort_order=sort_order,
            search_fields=("full_name", "license_number", "contact_number"),
            filters={"current_status": status},
        )
        return items, total

    async def create_driver(self, data: DriverCreate) -> Driver:
        if await self.get_by_license_number(data.license_number):
            raise ConflictError("Driver license number must be unique")
        return await self.repository.create(data.model_dump())

    async def update_driver(self, driver_id: int, data: DriverUpdate) -> Driver:
        driver = await self.repository.get(driver_id)
        if driver is None:
            raise NotFoundError("Driver not found")
        payload = data.model_dump(exclude_unset=True)
        if "license_number" in payload and payload["license_number"] != driver.license_number:
            if await self.get_by_license_number(payload["license_number"]):
                raise ConflictError("Driver license number must be unique")
        return await self.repository.update(driver, payload)

    async def delete_driver(self, driver_id: int) -> None:
        driver = await self.repository.get(driver_id)
        if driver is None:
            raise NotFoundError("Driver not found")
        await self.repository.delete(driver)

    def validate_license(self, driver: Driver) -> None:
        if driver.license_expiry < date.today():
            raise ConflictError("Driver license has expired")
        if driver.current_status == DriverStatus.SUSPENDED.value:
            raise ConflictError("Driver is suspended")
