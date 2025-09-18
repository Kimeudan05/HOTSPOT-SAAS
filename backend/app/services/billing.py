from datetime import datetime, timezone, timedelta
from sqlalchemy.orm import Session

from app.database.models.session import Session as SessionModel
from app.services.hotspot_service import grant_access
from app.database.models.plan import Plan

# Creates an internet session for a user based on payment amount
def create_session(db: Session, phone_number: str, amount: float, user_id: int = None):
    # Find a plan whose price matches the amount paid
    plan = db.query(Plan).filter(Plan.price == int(amount)).first()
    
    if not plan:
        print(f"[WARN] No plan found for amount: {amount}")
        return None
    
    # Ensure amount is an integer value (e.g., 5.0 not 5.5)
    amount_key = int(amount)
    if amount != amount_key:
        print("Invalid payment amount (not an integer):", amount)
        return None

    # Calculate session start and end times
    start = datetime.now(timezone.utc)
    end = start + timedelta(minutes=plan.duration)

    # Create new session object
    new_session = SessionModel(
        user_id=user_id,
        phone_number=phone_number,
        plan_name=plan.name,
        start_time=start,
        end_time=end,
        is_active=True
    )

    # Save session to database
    db.add(new_session)
    db.commit()
    db.refresh(new_session)

    # Grant access to internet for the duration of the plan
    grant_access(phone_number, plan.duration)

    return new_session
