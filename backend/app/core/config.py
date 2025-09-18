# Load environment variables from a .env file
import os
from dotenv import load_dotenv
from typing import Optional

# Actually load the variables from .env into the environment
load_dotenv()

class Settings:
    # Basic project info
    PROJECT_NAME: str = "Hotspot SaaS"
    
    # Secret key for JWT or other encryption, default fallback provided
    SECRET_KEY: str = os.getenv("SECRET_KEY", "supersecret")
    
    # JWT algorithm used for encoding tokens
    ALGORITHM: str = "HS256"
    
    # Token expiry time in minutes (default: 24 hours)
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24
    
    # Database connection URL (expected in environment)
    DATABASE_URL: Optional[str] = os.getenv("DATABASE_URL")
    
    # MPESA API credentials & configs (optional, depending on env)
    MPESA_CONSUMER_KEY: Optional[str] = os.getenv("MPESA_CONSUMER_KEY")
    MPESA_CONSUMER_SECRET: Optional[str] = os.getenv("MPESA_CONSUMER_SECRET")
    MPESA_SHORTCODE: Optional[str] = os.getenv("MPESA_SHORTCODE")
    MPESA_PASSKEY: Optional[str] = os.getenv("MPESA_PASSKEY")
    MPESA_CALLBACK_URL: Optional[str] = os.getenv("MPESA_CALLBACK_URL")
    
    # SMTP email settings - port is cast to int with a default fallback
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", "587"))
    SMTP_PASSWORD: Optional[str] = os.getenv("SMTP_PASSWORD")
    EMAIL_FROM: Optional[str] = os.getenv("EMAIL_FROM")
    SMTP_USER: Optional[str] = os.getenv("SMTP_USER")
    SMTP_SERVER: Optional[str] = os.getenv("SMTP_SERVER")
    
    # Africa's Talking SMS API credentials
    AT_USERNAME: Optional[str] = os.getenv("AT_USERNAME")
    AT_API_KEY: Optional[str] = os.getenv("AT_API_KEY")

# Create a single instance to use throughout the app
settings = Settings()
