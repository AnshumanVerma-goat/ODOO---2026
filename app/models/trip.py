from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base


class Trip(Base):
    __tablename__ = "trips"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    source: Mapped[str] = mapped_column(String(255), nullable=False)
    destination: Mapped[str] = mapped_column(String(255), nullable=False)
    vehicle_id: Mapped[int | None] = mapped_column(ForeignKey("vehicles.id", ondelete="SET NULL"), nullable=True)
    driver_id: Mapped[int | None] = mapped_column(ForeignKey("drivers.id", ondelete="SET NULL"), nullable=True)
    cargo_weight: Mapped[float] = mapped_column(Float, nullable=False)
    planned_distance: Mapped[float] = mapped_column(Float, nullable=False)
    actual_distance: Mapped[float | None] = mapped_column(Float, nullable=True)
    revenue: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    fuel_used: Mapped[float | None] = mapped_column(Float, nullable=True)
    trip_status: Mapped[str] = mapped_column(String(32), nullable=False, index=True)
    dispatch_time: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    completion_time: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    vehicle: Mapped["Vehicle | None"] = relationship(back_populates="trips")
    driver: Mapped["Driver | None"] = relationship(back_populates="trips")
