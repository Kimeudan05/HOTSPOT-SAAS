# --- Payment Handling Routes ---
from fastapi import APIRouter, Depends, Request, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from sqlalchemy import func
from datetime import datetime

from app.database.session import get_db
from app.database.models.payment import Payment
from app.schemas.payment import PaymentOut
from app.services.mpesa_services import stk_push
from app.services.billing import create_session
from app.database.models.user import User
from app.database.models.plan import Plan
from app.core.security import get_current_user, get_current_admin
from app.services.email_service import send_email
from app.services.sms_service import send_sms
from app.services.log_service import log_activity

router = APIRouter(prefix="/payments", tags=["Payments"])

# --- Initiate an M-Pesa STK Push payment
@router.post("/stk_push")
def initiate_payment(phone_number: str, amount: int):
    """
    Initiates an M-Pesa STK Push request to the specified phone number with the given amount.
    """
    return stk_push(phone_number, amount)

# --- Receive M-Pesa callback with payment result
@router.post("/callback")
async def mpesa_callback(request: Request, db: Session = Depends(get_db)):
    """
    Handles M-Pesa payment callbacks, processes payment info, saves to DB, creates sessions,
    and sends notifications.
    """
    data = await request.json()
    print("Callback received:", data)

    try:
        body = data["Body"]["stkCallback"]
        result_code = body["ResultCode"]
        metadata = body.get("CallbackMetadata", {}).get("Item", [])

        phone_number, amount, receipt = None, None, None

        for item in metadata:
            if item["Name"] == "PhoneNumber":
                phone_number = str(item["Value"])
            elif item["Name"] == "Amount":
                amount = float(item["Value"])
            elif item["Name"] == "MpesaReceiptNumber":
                receipt = str(item["Value"])

        status = "Success" if result_code == 0 else "Failed"

        user = db.query(User).filter(User.phone_number == phone_number).first()
        plan = db.query(Plan).filter(Plan.price == amount).first()
        payment = Payment(
            user_id=user.id if user else None,
            plan_id=plan.id if plan else None,
            phone_number=phone_number or "Unknown",
            amount=amount or 0,
            mpesa_receipt=receipt,
            status=status
        )
        db.add(payment)
        db.commit()

        if status == "Success":
            session = create_session(db, phone_number, amount, user.id if user else None)
            print(f"Session created: {session}")
            log_activity(db, "Payment Success", f"Amount {amount}, Phone {phone_number}", user.id if user else None)

            if user and user.email:
                send_email(
                    user.email,
                    "Payment Success - Hotspot Access",
                    f"""
                    <h2>Payment Successful 🎉</h2>
                    <p>Dear {user.username},</p>
                    <p>Your payment of <b>KES {amount}</b> was successful.</p>
                    <p>Plan: {session.plan_name}</p>
                    <p>Session expires at: {session.end_time}</p>
                    """
                )

            send_sms(
                phone_number,
                f"Payment KES {amount} successful. Plan: {session.plan_name}, valid until {session.end_time}."
            )
        else:
            log_activity(db, "Payment Failed", f"Amount {amount}, Phone {phone_number}", user.id if user else None)

    except Exception as e:
        print("Error processing the request:", e)

    # Always return success to Safaricom regardless of processing result
    return {'ResultCode': 0, "ResultDesc": "Callback received successfully"}

# --- List payments with filtering, sorting, and pagination
@router.get("/", response_model=List[PaymentOut])
def list_payments(
    status: Optional[str] = Query(None),
    phone_number: Optional[str] = Query(None),
    min_amount: Optional[float] = Query(None),
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    sort_by: str = "created_at",
    sort_order: str = "desc",
    page: int = 1,
    page_size: int = 10,
    db: Session = Depends(get_db)
):
    """
    Get paginated payments list with optional filters: status, phone number, min amount,
    date range, sorting.
    """
    query = db.query(Payment)

    if status:
        query = query.filter(Payment.status == status)
    if phone_number:
        query = query.filter(Payment.phone_number == phone_number)
    if min_amount:
        query = query.filter(Payment.amount >= min_amount)

    if start_date:
        try:
            start = datetime.strptime(start_date, "%Y-%m-%d")
            query = query.filter(Payment.created_at >= start)
        except ValueError:
            pass

    if end_date:
        try:
            end = datetime.strptime(end_date, "%Y-%m-%d")
            query = query.filter(Payment.created_at <= end)
        except ValueError:
            pass

    sort_column = getattr(Payment, sort_by, Payment.created_at)
    query = query.order_by(sort_column.asc() if sort_order == "asc" else sort_column.desc())

    payments = query.offset((page - 1) * page_size).limit(page_size).all()

    return payments

# --- Get payment summary stats
@router.get("/summary")
def payment_summary(db: Session = Depends(get_db)):
    """
    Returns summary stats:
    - Total revenue from successful payments
    - Number of successful, failed, and total transactions
    """
    total_revenue = db.query(func.sum(Payment.amount)).filter(Payment.status == "Success").scalar() or 0
    total_success = db.query(func.count(Payment.id)).filter(Payment.status == "Success").scalar() or 0
    total_failed = db.query(func.count(Payment.id)).filter(Payment.status == "Failed").scalar() or 0
    total_transactions = db.query(func.count(Payment.id)).scalar() or 0

    return {
        "total_revenue": total_revenue,
        "total_transactions": total_transactions,
        "success_count": total_success,
        "failed_count": total_failed
    }

# --- List current user's payments (admin sees all)
# @router.get("/my", response_model=List[PaymentOut])
# --- List current user's payments (with optional filters, sorting, pagination)
@router.get("/my", response_model=List[PaymentOut])
def my_payments(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    status: Optional[str] = Query(None),
    min_amount: Optional[float] = Query(None),
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    sort_by: str = "created_at",
    sort_order: str = "desc",
    page: int = 1,
    page_size: int = 10
):
    query = db.query(Payment)

    # Restrict to current user unless admin
    if not current_user.is_admin:
        query = query.filter(Payment.user_id == current_user.id)

    if status:
        query = query.filter(Payment.status == status)
    if min_amount:
        query = query.filter(Payment.amount >= min_amount)

    if start_date:
        try:
            start = datetime.strptime(start_date, "%Y-%m-%d")
            query = query.filter(Payment.created_at >= start)
        except ValueError:
            pass

    if end_date:
        try:
            end = datetime.strptime(end_date, "%Y-%m-%d")
            query = query.filter(Payment.created_at <= end)
        except ValueError:
            pass

    sort_column = getattr(Payment, sort_by, Payment.created_at)
    query = query.order_by(sort_column.asc() if sort_order == "asc" else sort_column.desc())

    payments = query.offset((page - 1) * page_size).limit(page_size).all()
    return payments


# --- Admin: list all payments
@router.get("/admin", response_model=List[PaymentOut])
def list_all_payments(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
    status: Optional[str] = Query(None),
    phone_number: Optional[str] = Query(None),
    min_amount: Optional[float] = Query(None),
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    sort_by: str = "created_at",
    sort_order: str = "desc",
    page: int = 1,
    page_size: int = 10,
):
    query = db.query(Payment)

    # Filters
    if status:
        query = query.filter(Payment.status == status)
    if phone_number:
        query = query.filter(Payment.phone_number.contains(phone_number))
    if min_amount:
        query = query.filter(Payment.amount >= min_amount)
    if start_date:
        query = query.filter(Payment.created_at >= start_date)
    if end_date:
        query = query.filter(Payment.created_at <= end_date)

    # Sorting
    sort_column = getattr(Payment, sort_by, Payment.created_at)
    if sort_order == "asc":
        query = query.order_by(sort_column.asc())
    else:
        query = query.order_by(sort_column.desc())

    total = query.count()
    payments = query.offset((page - 1) * page_size).limit(page_size).all()

    return {"data": payments, "total": total}