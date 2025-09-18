# --- Authentication Routes ---
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.database.models.user import User
from app.schemas.user import UserCreate, UserOut,LoginInput
from app.core.security import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["Auth"])

# --- Register a new user
@router.post("/register", response_model=UserOut)
def register(user: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.username == user.username).first():
        raise HTTPException(status_code=400, detail="Username already taken")

    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    if db.query(User).filter(User.phone_number == user.phone_number).first():
        raise HTTPException(status_code=400, detail="Phone number already registered")

    hashed_pw = hash_password(user.password)
    new_user = User(
        username=user.username,
        email=user.email,
        phone_number=user.phone_number,
        hashed_password=hashed_pw
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


# --- Login and return JWT token
@router.post("/login")
def login(email: str, password: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()

    if not user:
        raise HTTPException(status_code=400, detail="Email does not exist")

    if not verify_password(password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect password")

    # Include the user ID and is_admin flag in the token payload
    token_data = {
        "sub": str(user.id),
        "is_admin": user.is_admin,  # Include is_admin flag in token payload
    }
    token = create_access_token(token_data)  # Pass the token data with is_admin

    return {"access_token": token, "token_type": "bearer"}

