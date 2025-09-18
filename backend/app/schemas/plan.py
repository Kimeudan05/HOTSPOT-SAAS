# --- schemas for creating, updating, and returning plan data
from pydantic import BaseModel, ConfigDict
from datetime import datetime

# --- shared fields for plan schemas
class PlanBase(BaseModel):
    name: str
    price: int
    duration: int

# --- inherits from PlanBase, used for creation
class PlanCreate(PlanBase):
    pass

# --- schema for updating a plan (all fields optional)
class PlanUpdate(BaseModel):
    name: str | None = None
    price: int | None = None
    duration: int | None = None

# --- output schema for returning a plan with ID
class PlanOut(PlanBase):
    id: int

    # --- enables ORM model to schema conversion
    model_config = ConfigDict(from_attributes=True)
