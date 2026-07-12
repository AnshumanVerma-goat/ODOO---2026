from datetime import date

from sqlalchemy import Date, Float, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base


class Driver(Base):
    __tablename__ = "drivers"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    full_name: Mapped[str] = mapped_column(String(150), nullable=False)
    license_number: Mapped[str] = mapped_column(String(64), unique=True, nullable=False, index=True)
    license_category: Mapped[str] = mapped_column(String(32), nullable=False)
    license_expiry: Mapped[date] = mapped_column(Date, nullable=False)
    contact_number: Mapped[str] = mapped_column(String(32), nullable=False)
    safety_score: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    current_status: Mapped[str] = mapped_column(String(32), nullable=False, index=True)

    trips: Mapped[list["Trip"]] = relationship(back_populates="driver")
