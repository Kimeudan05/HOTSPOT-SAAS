# --- schemas for user creation and response
from pydantic import BaseModel, ConfigDict
from typing import Optional

# --- base fields shared by all user-related schemas
class UserBase(BaseModel):
    username: str
    email: str
    phone_number: str

# --- extends UserBase, adds password for creating a user
class UserCreate(UserBase):
    password: str

# --- extends UserBase, adds id and admin flag for returning user data
class UserOut(UserBase):
    id: int
    is_admin: bool
    username:str

    # --- allow ORM models to be converted to this schema
    model_config = ConfigDict(from_attributes=True)
# for the login to make sure it accepts json
class LoginInput(BaseModel):
    email: str
    password: str
