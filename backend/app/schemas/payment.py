# --- schema for returning payment data to client
from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional
from app.schemas.plan import PlanOut

# --- output schema for payment info
class PaymentOut(BaseModel):
    id: int
    phone_number: str
    amount: float
    mpesa_receipt: Optional[str]
    status: str
    created_at: datetime
    user_id: Optional[int]
    plan:Optional[PlanOut] # relationship to get the plan name

    # --- allows use of ORM objects with this schema
    model_config = ConfigDict(from_attributes=True)
