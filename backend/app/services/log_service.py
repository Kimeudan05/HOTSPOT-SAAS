from sqlalchemy.orm import Session
from app.database.models.activity_log import ActivityLog

# Logs an action performed by a user or system into the database
def log_activity(db: Session, action: str, details: str = None, user_id: int = None):
    log = ActivityLog(user_id=user_id, action=action, details=details)
    db.add(log)  # Add the new log to the session
    db.commit()  # Commit the transaction to save it permanently
    db.refresh(log)  # Refresh instance with data from DB (e.g. generated IDs)
    print(f"Activity log: {action}")
    return log
