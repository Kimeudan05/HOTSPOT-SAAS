# --- Admin User Management Routes ---
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.database.session import get_db
from app.database.models.user import User
from app.schemas.user import UserOut
from app.core.security import get_current_admin

router = APIRouter(prefix="/admin/users", tags=["Admin - Users"])

# --- List all users (admin only)
@router.get("/", response_model=List[UserOut])
def list_users(db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    return db.query(User).all()
