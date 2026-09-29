from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import Device, ElderlyProfile, User
from app.schemas.schemas import DeviceCreate, DeviceOut, DeviceHeartbeat
from app.core.security import get_current_user
from app.services.device_service import update_device_heartbeat
from app.services.alert_service import broadcast_device_status

router = APIRouter(prefix="/api/v1/devices", tags=["devices"])


@router.get("", response_model=list[DeviceOut])
def list_devices(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.query(ElderlyProfile).filter(ElderlyProfile.user_id == current_user.id).first()
    if not profile:
        return []
    return db.query(Device).filter(Device.elderly_id == profile.id).all()


@router.post("", response_model=DeviceOut, status_code=201)
def create_device(payload: DeviceCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.query(ElderlyProfile).filter(ElderlyProfile.id == payload.elderly_id, ElderlyProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Elderly profile not found")

    existing = db.query(Device).filter(Device.device_uid == payload.device_uid).first()
    if existing:
        raise HTTPException(status_code=400, detail="Device already exists")

    device = Device(device_uid=payload.device_uid, elderly_id=payload.elderly_id, status="offline", battery_level=0)
    db.add(device)
    db.commit()
    db.refresh(device)
    return device


@router.get("/{device_id}", response_model=DeviceOut)
def get_device(device_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    device = (
        db.query(Device)
        .join(ElderlyProfile, ElderlyProfile.id == Device.elderly_id)
        .filter(Device.id == device_id, ElderlyProfile.user_id == current_user.id)
        .first()
    )
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")
    return device


@router.post("/heartbeat", response_model=DeviceOut)
async def device_heartbeat(payload: DeviceHeartbeat, db: Session = Depends(get_db)):
    device = update_device_heartbeat(db, payload.device_id, payload.battery_level, payload.timestamp)
    await broadcast_device_status(device.device_uid, device.status, device.battery_level, device.last_seen)
    return device
