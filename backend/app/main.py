from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime, timezone

from app.routes import auth, payments, sessions, users, plans, activity_logs,analytics
from app.database.session import Base, engine, SessionLocal
from app.database.models.session import Session as SessionModel
from app.services.hotspot_service import revoke_acces
from app.services.email_service import send_email
from app.services.sms_service import send_sms
from app.services.log_service import log_activity

# Create database tables based on models (if they don't exist)
Base.metadata.create_all(bind=engine)

# Initialize FastAPI application instance
app = FastAPI()

# Add CORS middleware to allow cross-origin requests (adjust origins for production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # TODO: restrict this to trusted domains in production
    # allow_origins=["*"],  # TODO: restrict this to trusted domains in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers for different API modules
app.include_router(auth.router)
app.include_router(payments.router)
app.include_router(sessions.router)
app.include_router(users.router)
app.include_router(plans.router)
app.include_router(activity_logs.router)
app.include_router(analytics.router)

# Simple root endpoint to verify API is running
@app.get("/")
def root():
    return {"message": "Hotspot API running"}

# Background job: clean up expired hotspot sessions regularly
def cleanup_sessions():
    db = SessionLocal()  # Open a new database session
    now = datetime.now(timezone.utc)  # Current UTC time
    
    # Query all active sessions that have expired
    expired = db.query(SessionModel)\
                .filter(SessionModel.end_time < now, SessionModel.is_active == True)\
                .all()
    
    for s in expired:
        s.is_active = False  # Mark session inactive
        revoke_acces(s.phone_number)  # Revoke internet access for this session
        
        # Log the expiration activity
        log_activity(db, "Session Expired", f"Plan {s.plan_name}, Phone {s.phone_number}", s.user_id)
        
        # Notify the user via email if available
        if s.user and s.user.email:
            send_email(
                s.user.email,
                "Session Expired - Hotspot",
                f"Your session ({s.plan_name}) has expired. Please purchase a new plan."
            )
            # Also notify via SMS
            send_sms(s.phone_number, f"Your session ({s.plan_name}) has expired. Please buy a new plan.")
    
    db.commit()  # Save changes
    db.close()  # Close DB session
    
    if expired:
        print(f"🧹 Expired {len(expired)} session(s) at {now}")

# Setup scheduler to run cleanup_sessions every minute in background
scheduler = BackgroundScheduler()
scheduler.add_job(cleanup_sessions, "interval", minutes=1)
scheduler.start()
