# --- schema for returning session data
from pydantic import BaseModel, ConfigDict
from datetime import datetime
from .user import UserOut

# --- output schema for an internet session
class SessionOut(BaseModel):
    id: int
    user:UserOut# get the related user
    phone_number: str
    plan_name: str
    start_time: datetime
    end_time: datetime
    is_active: bool

    # --- allows use with ORM models
    model_config = ConfigDict(from_attributes=True)
