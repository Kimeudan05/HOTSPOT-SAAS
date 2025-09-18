# --- Session Management Routes ---
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timezone

from app.core.security import get_current_admin
from app.database.models.user import User
from app.database.session import get_db
from app.database.models.session import Session as SessionModel
from app.schemas.session import SessionOut
from app.services.hotspot_service import revoke_acces
from app.services.log_service import log_activity

router = APIRouter(prefix="/sessions", tags=["Sessions"])

# --- List all active sessions (user view)
@router.get("/", response_model=List[SessionOut])
def list_sessions(db: Session = Depends(get_db)):
    return db.query(SessionModel).filter(SessionModel.is_active == True).all()

# --- Admin: List all sessions
@router.get("/admin", response_model=List[SessionOut])
def list_all_sessions(db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    return db.query(SessionModel).all()

# --- Admin: Manually revoke a session by ID
@router.post("/admin/revoke/{session_id}")
def revoke_session(session_id: int, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    session = db.query(SessionModel).filter(SessionModel.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    if not session.is_active:
        raise HTTPException(status_code=400, detail="Session already inactive")

    session.is_active = False
    db.commit()

    revoke_acces(session.phone_number)  # Call hotspot service to revoke access
    
    # Log this action
    log_activity(db, "Session Revoked", f"Session {session_id}, Phone {session.phone_number}", admin.id)

    return {"message": f"Session {session_id} revoked for {session.phone_number}"}

# --- Cleanup expired sessions (deactivate old sessions)
@router.post("/cleanup")
def cleanup_sessions(db: Session = Depends(get_db)):
    now = datetime.now(timezone.utc)
    expired = db.query(SessionModel).filter(SessionModel.end_time < now, SessionModel.is_active == True).all()
    for s in expired:
        s.is_active = False
    db.commit()
    return {"expired_count": len(expired)}
