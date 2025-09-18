# --- schema for returning activity log entries
from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional

# --- output schema for an activity log record
class ActivityLogOut(BaseModel):
    id: int
    user_id: Optional[int]
    action: str
    details: Optional[str]
    created_at: datetime

    # --- allows ORM model conversion
    model_config = ConfigDict(from_attributes=True)
