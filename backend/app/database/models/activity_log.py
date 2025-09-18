from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from datetime import datetime, timezone
from sqlalchemy.orm import relationship

from app.database.session import Base

# --- model for logging user activities (e.g. payment success, session revoked)
class ActivityLog(Base):
    __tablename__ = "activity_logs"
    
    # --- primary key ID
    id = Column(Integer, primary_key=True, index=True)
    
    # --- optional FK to users table (can be null)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    # --- short label for the action performed
    action = Column(String, nullable=False)  # e.g., "Payment Success", "Session Revoked"
    
    # --- free-text details about the action
    details = Column(String, nullable=False)
    
    # --- timestamp of when the action occurred
    created_at = Column(DateTime, default=datetime.now(timezone.utc))
    
    # --- relationship to User (reverse: user.activity_logs)
    user = relationship("User", backref="activity_logs")
