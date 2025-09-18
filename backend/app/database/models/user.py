from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship

from app.database.session import Base

# --- model representing a user of the system
class User(Base):
    __tablename__ = "users"
    
    # --- primary key ID
    id = Column(Integer, primary_key=True, index=True)
    
    # --- unique username
    username = Column(String, unique=True, index=True, nullable=False)
    
    # --- unique email address
    email = Column(String, unique=True, index=True, nullable=False)
    
    # --- hashed password (stored securely)
    hashed_password = Column(String, nullable=False)
    
    # --- unique phone number
    phone_number = Column(String, unique=True, nullable=False)
    
    # --- flag to check if user is an admin
    is_admin = Column(Boolean, default=False)
    
    # --- relationship to Payment (user.payments)
    payments = relationship("Payment", back_populates="user")
    
    # --- relationship to Session (user.sessions)
    sessions = relationship("Session", back_populates="user")
