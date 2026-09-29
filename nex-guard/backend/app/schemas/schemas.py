from datetime import datetime
from typing import Literal, Optional
from pydantic import BaseModel, EmailStr, Field, ConfigDict


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserCreate(BaseModel):
    name: str = Field(min_length=2)
    email: EmailStr
    password: str = Field(min_length=8)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    email: EmailStr
    created_at: datetime


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


class EmergencyContactIn(BaseModel):
    name: str
    phone: str
    relationship: str


class EmergencyContactOut(EmergencyContactIn):
    model_config = ConfigDict(from_attributes=True)
    id: int


class ElderlyProfileIn(BaseModel):
    name: str
    age: int
    height: Optional[float] = None
    weight: Optional[float] = None
    wear_position: Optional[str] = None
    contacts: list[EmergencyContactIn] = []


class ElderlyProfileOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    name: str
    age: int
    height: Optional[float]
    weight: Optional[float]
    wear_position: Optional[str]
    contacts: list[EmergencyContactOut] = []


class DeviceCreate(BaseModel):
    device_uid: str
    elderly_id: int


class DeviceHeartbeat(BaseModel):
    device_id: str
    battery_level: int = Field(ge=0, le=100)
    timestamp: datetime


class DeviceOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    device_uid: str
    elderly_id: int
    battery_level: int
    status: str
    last_seen: Optional[datetime]


class AlertPatch(BaseModel):
    status: Literal["new", "acknowledged", "resolved"]


class AlertOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    device_id: Optional[int]
    elderly_id: int
    type: str
    status: str
    ml_probability: Optional[float]
    latitude: Optional[float]
    longitude: Optional[float]
    timestamp: datetime
    created_at: datetime
    resolved_at: Optional[datetime]


class FallEventIn(BaseModel):
    device_id: str
    event_id: str
    timestamp: datetime
    fall_confidence: float = Field(ge=0, le=1)
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    battery_level: int = Field(ge=0, le=100)


class SosEventIn(BaseModel):
    device_id: str
    event_id: str
    timestamp: datetime
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    battery_level: int = Field(ge=0, le=100)


class WsMessage(BaseModel):
    type: Literal["FALL_DETECTED", "SOS", "DEVICE_STATUS"]
    payload: dict
