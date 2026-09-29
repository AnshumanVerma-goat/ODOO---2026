from datetime import datetime
from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.db.models import Device


def get_device_by_uid(db: Session, uid: str) -> Device:
    device = db.query(Device).filter(Device.device_uid == uid).first()
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")
    return device


def update_device_heartbeat(db: Session, uid: str, battery_level: int, timestamp: datetime) -> Device:
    device = get_device_by_uid(db, uid)
    device.battery_level = battery_level
    device.last_seen = timestamp
    device.status = "online"
    db.add(device)
    db.commit()
    db.refresh(device)
    return device
