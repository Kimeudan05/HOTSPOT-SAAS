# --- Activity Log Routes ---
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.database.session import get_db
from app.schemas.activity_log import ActivityLogOut
from app.database.models.activity_log import ActivityLog
from app.core.security import get_current_admin

router = APIRouter(prefix="/activity", tags=["Activity Logs"])

# --- Get the 100 most recent activity logs (admin only)
@router.get("/", response_model=List[ActivityLogOut])
def list_logs(db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    return db.query(ActivityLog).order_by(ActivityLog.created_at.desc()).limit(100).all()
