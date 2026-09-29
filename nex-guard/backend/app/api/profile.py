from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import ElderlyProfile, EmergencyContact, User
from app.schemas.schemas import ElderlyProfileIn, ElderlyProfileOut
from app.core.security import get_current_user

router = APIRouter(prefix="/api/v1/profile", tags=["profile"])


@router.get("", response_model=ElderlyProfileOut)
def get_profile(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.query(ElderlyProfile).filter(ElderlyProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile


@router.put("", response_model=ElderlyProfileOut)
def upsert_profile(payload: ElderlyProfileIn, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.query(ElderlyProfile).filter(ElderlyProfile.user_id == current_user.id).first()
    if not profile:
        profile = ElderlyProfile(user_id=current_user.id, name=payload.name, age=payload.age)
        db.add(profile)
        db.flush()

    profile.name = payload.name
    profile.age = payload.age
    profile.height = payload.height
    profile.weight = payload.weight
    profile.wear_position = payload.wear_position

    db.query(EmergencyContact).filter(EmergencyContact.elderly_id == profile.id).delete()
    for contact in payload.contacts:
        db.add(
            EmergencyContact(
                elderly_id=profile.id,
                name=contact.name,
                phone=contact.phone,
                relationship=contact.relationship,
            )
        )

    db.commit()
    db.refresh(profile)
    return profile
