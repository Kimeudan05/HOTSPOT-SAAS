# --- schema for returning payment data to client
from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional

# --- output schema for payment info
class PaymentOut(BaseModel):
    id: int
    phone_number: str
    amount: float
    mpesa_receipt: Optional[str]
    status: str
    created_at: datetime
    user_id: Optional[int]

    # --- allows use of ORM objects with this schema
    model_config = ConfigDict(from_attributes=True)
