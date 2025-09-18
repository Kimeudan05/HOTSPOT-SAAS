from sqlalchemy import Column, Integer, String
from app.database.session import Base

# --- model for defining a plan (duration + price)
class Plan(Base):
    __tablename__ = "plans"
    
    # --- primary key ID
    id = Column(Integer, primary_key=True, index=True)
    
    # --- name of the plan (e.g. "30 min")
    name = Column(String, nullable=False)
    
    # --- price of the plan in KES
    price = Column(Integer, nullable=False)
    
    # --- duration of the plan in minutes
    duration = Column(Integer, nullable=False)
