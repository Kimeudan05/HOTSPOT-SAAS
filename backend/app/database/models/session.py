from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean
from datetime import datetime, timezone
from sqlalchemy.orm import relationship

from app.database.session import Base

# --- model for an internet session linked to a user and a plan
class Session(Base):
    __tablename__ = "sessions"
    
    # --- primary key ID
    id = Column(Integer, primary_key=True, index=True)
    
    # --- FK to the user using the session
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # --- phone number associated with the session
    phone_number = Column(String, nullable=False)
    
    # --- name of the plan being used
    plan_name = Column(String, nullable=False)
    
    # --- session start time (defaults to now)
    start_time = Column(DateTime, default=datetime.now(timezone.utc))
    
    # --- session end time (must be set)
    end_time = Column(DateTime, nullable=False)
    
    # --- whether the session is still active
    is_active = Column(Boolean, default=False)
    
    # --- relationship to User (reverse: user.sessions)
    user = relationship("User", back_populates="sessions")
