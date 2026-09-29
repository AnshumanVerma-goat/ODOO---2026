from datetime import datetime
from sqlalchemy.orm import Session
from app.db.models import Alert, Device
from app.websocket.manager import manager


async def create_alert_and_broadcast(
    db: Session,
    *,
    device: Device,
    alert_type: str,
    timestamp: datetime,
    probability: float | None,
    latitude: float | None,
    longitude: float | None,
) -> Alert:
    alert = Alert(
        device_id=device.id,
        elderly_id=device.elderly_id,
        type=alert_type,
        status="new",
        ml_probability=probability,
        latitude=latitude,
        longitude=longitude,
        timestamp=timestamp,
    )
    db.add(alert)
    db.commit()
    db.refresh(alert)

    await manager.broadcast(
        {
            "type": "FALL_DETECTED" if alert_type == "fall" else "SOS",
            "payload": {
                "alert_id": alert.id,
                "device_id": device.device_uid,
                "elderly_id": alert.elderly_id,
                "status": alert.status,
                "confidence": alert.ml_probability,
                "latitude": alert.latitude,
                "longitude": alert.longitude,
                "timestamp": alert.timestamp.isoformat(),
            },
        }
    )
    return alert


async def broadcast_device_status(device_uid: str, status: str, battery_level: int, last_seen: datetime | None) -> None:
    await manager.broadcast(
        {
            "type": "DEVICE_STATUS",
            "payload": {
                "device_id": device_uid,
                "status": status,
                "battery_level": battery_level,
                "last_seen": last_seen.isoformat() if last_seen else None,
            },
        }
    )
