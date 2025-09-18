# --- database connection and session setup
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

# --- create the database engine using the URL from settings
engine = create_engine(settings.DATABASE_URL)

# --- create a session factory (used for interacting with the DB)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# --- base class for all ORM models
Base = declarative_base()

# --- dependency used to get a database session
def get_db():
    db = SessionLocal()
    try:
        yield db  # --- provide the session to the request
    finally:
        db.close()  # --- close session after use
