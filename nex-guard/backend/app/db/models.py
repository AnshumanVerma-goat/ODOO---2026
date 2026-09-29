from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.db.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    profile = relationship("ElderlyProfile", back_populates="user", uselist=False, cascade="all,delete")


class ElderlyProfile(Base):
    __tablename__ = "elderly_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True)
    name = Column(String(120), nullable=False)
    age = Column(Integer, nullable=False)
    height = Column(Float, nullable=True)
    weight = Column(Float, nullable=True)
    wear_position = Column(String(64), nullable=True)

    user = relationship("User", back_populates="profile")
    devices = relationship("Device", back_populates="elderly", cascade="all,delete")
    contacts = relationship("EmergencyContact", back_populates="elderly", cascade="all,delete")
    alerts = relationship("Alert", back_populates="elderly", cascade="all,delete")


class Device(Base):
    __tablename__ = "devices"

    id = Column(Integer, primary_key=True, index=True)
    device_uid = Column(String(120), unique=True, index=True, nullable=False)
    elderly_id = Column(Integer, ForeignKey("elderly_profiles.id", ondelete="CASCADE"), nullable=False)
    battery_level = Column(Integer, default=0, nullable=False)
    status = Column(String(32), default="offline", nullable=False)
    last_seen = Column(DateTime, nullable=True)

    elderly = relationship("ElderlyProfile", back_populates="devices")
    alerts = relationship("Alert", back_populates="device")


class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    device_id = Column(Integer, ForeignKey("devices.id", ondelete="SET NULL"), nullable=True)
    elderly_id = Column(Integer, ForeignKey("elderly_profiles.id", ondelete="CASCADE"), nullable=False)
    type = Column(String(32), nullable=False)
    status = Column(String(32), default="new", nullable=False)
    ml_probability = Column(Float, nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    timestamp = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    resolved_at = Column(DateTime, nullable=True)

    device = relationship("Device", back_populates="alerts")
    elderly = relationship("ElderlyProfile", back_populates="alerts")


class EmergencyContact(Base):
    __tablename__ = "emergency_contacts"

    id = Column(Integer, primary_key=True, index=True)
    elderly_id = Column(Integer, ForeignKey("elderly_profiles.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(120), nullable=False)
    phone = Column(String(30), nullable=False)
    relationship = Column(String(60), nullable=False)

    elderly = relationship("ElderlyProfile", back_populates="contacts")
