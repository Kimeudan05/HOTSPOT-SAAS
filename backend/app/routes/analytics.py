from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database.session import get_db
from app.database.models.payment import Payment
from app.database.models.session import Session as SessionModel
from app.database.models.user import User
from app.core.security import get_current_admin

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/revenue/summary")
def revenue_summary(db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    total_revenue = db.query(func.sum(Payment.amount)).filter(Payment.status == "Success").scalar() or 0
    total_transactions = db.query(func.count(Payment.id)).scalar() or 0
    success_count = db.query(func.count(Payment.id)).filter(Payment.status == "Success").scalar() or 0
    failed_count = db.query(func.count(Payment.id)).filter(Payment.status == "Failed").scalar() or 0
    return {
        "total_revenue": total_revenue,
        "total_transactions": total_transactions,
        "success_count": success_count,
        "failed_count": failed_count
    }
