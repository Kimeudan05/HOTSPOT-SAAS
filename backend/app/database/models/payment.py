from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from datetime import datetime, timezone
from sqlalchemy.orm import relationship

from app.database.session import Base

# --- model representing a payment transaction
class Payment(Base):
    __tablename__ = 'payments'
    
    # --- primary key ID
    id = Column(Integer, primary_key=True, index=True)
    
    # --- FK to user who made the payment
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    # --- FK to plan that was purchased
    plan_id = Column(Integer, ForeignKey("plans.id"), nullable=True)  # ✅ link to plan
    # --- phone number used in the payment
    phone_number = Column(String, nullable=False)
    
    # --- payment amount in KES
    amount = Column(Float, nullable=False)
    
    # --- optional receipt number from MPESA
    mpesa_receipt = Column(String, nullable=True)
    
    # --- status of the payment (default: "Pending")
    status = Column(String, nullable=False, default='Pending')
    
    # --- timestamp when the payment was made
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    # --- relationships to User and plan(reverse: user.payments)
    user = relationship("User", back_populates="payments")
    plan = relationship("Plan")  # ✅ easy access to plan
