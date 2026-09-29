from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import Alert, Device, ElderlyProfile, User
from app.schemas.schemas import AlertOut, AlertPatch, FallEventIn, SosEventIn
from app.core.security import get_current_user
from app.services.alert_service import create_alert_and_broadcast
from app.services.device_service import update_device_heartbeat, get_device_by_uid

router = APIRouter(prefix="/api/v1", tags=["alerts"])


@router.get("/alerts", response_model=list[AlertOut])
def list_alerts(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.query(ElderlyProfile).filter(ElderlyProfile.user_id == current_user.id).first()
    if not profile:
        return []
    return db.query(Alert).filter(Alert.elderly_id == profile.id).order_by(Alert.timestamp.desc()).all()


@router.get("/alerts/{alert_id}", response_model=AlertOut)
def get_alert(alert_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    alert = (
        db.query(Alert)
        .join(ElderlyProfile, ElderlyProfile.id == Alert.elderly_id)
        .filter(Alert.id == alert_id, ElderlyProfile.user_id == current_user.id)
        .first()
    )
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    return alert


@router.patch("/alerts/{alert_id}", response_model=AlertOut)
def patch_alert(alert_id: int, payload: AlertPatch, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    alert = (
        db.query(Alert)
        .join(ElderlyProfile, ElderlyProfile.id == Alert.elderly_id)
        .filter(Alert.id == alert_id, ElderlyProfile.user_id == current_user.id)
        .first()
    )
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")

    alert.status = payload.status
    if payload.status == "resolved":
        alert.resolved_at = datetime.utcnow()
    db.add(alert)
    db.commit()
    db.refresh(alert)
    return alert


@router.post("/events/fall", response_model=AlertOut, status_code=201)
async def ingest_fall_event(payload: FallEventIn, db: Session = Depends(get_db)):
    device = get_device_by_uid(db, payload.device_id)
    device = update_device_heartbeat(db, payload.device_id, payload.battery_level, payload.timestamp)
    alert = await create_alert_and_broadcast(
        db,
        device=device,
        alert_type="fall",
        timestamp=payload.timestamp,
        probability=payload.fall_confidence,
        latitude=payload.latitude,
        longitude=payload.longitude,
    )
    return alert


@router.post("/events/sos", response_model=AlertOut, status_code=201)
async def ingest_sos_event(payload: SosEventIn, db: Session = Depends(get_db)):
    device = update_device_heartbeat(db, payload.device_id, payload.battery_level, payload.timestamp)
    alert = await create_alert_and_broadcast(
        db,
        device=device,
        alert_type="sos",
        timestamp=payload.timestamp,
        probability=None,
        latitude=payload.latitude,
        longitude=payload.longitude,
    )
    return alert


@router.post("/dev/test-fall", response_model=AlertOut, status_code=201)
async def test_fall_event(db: Session = Depends(get_db)):
    device = db.query(Device).first()
    if not device:
        raise HTTPException(status_code=400, detail="No device found. Create profile and device first.")

    now = datetime.utcnow()
    device = update_device_heartbeat(db, device.device_uid, 78, now)
    alert = await create_alert_and_broadcast(
        db,
        device=device,
        alert_type="fall",
        timestamp=now,
        probability=0.93,
        latitude=22.7196,
        longitude=75.8577,
    )
    return alert
