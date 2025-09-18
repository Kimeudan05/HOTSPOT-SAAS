import os
import requests
import base64
from dotenv import load_dotenv
from datetime import datetime

# For using the database
from fastapi import FastAPI,Request,Depends,Query
from sqlalchemy.orm import Session
from database import SessionLocal,init_db,Payment

#list all payments
from typing import List,Optional
from pydantic import BaseModel
from sqlalchemy import func



load_dotenv()
app = FastAPI()

# ensure Cross origin Sharing
from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], # frondend path
    allow_credentials  = True,
    allow_methods =["*"],
    allow_headers = ["*"]
)

init_db()  #Ensure the table exist

# Dependency to get the DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# mpesa credentials
consumer_key = os.getenv("MPESA_CONSUMER_KEY")
consumer_secret = os.getenv("MPESA_CONSUMER_SECRET")
short_code = os.getenv('MPESA_SHORTCODE')
passkey = os.getenv("MPESA_PASSKEY")
callback_url = os.getenv("MPESA_CALLBACK_URL")

# generate an acccess token
def get_access_token():
    url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
    response = requests.get(url, auth=(consumer_key, consumer_secret))
    print("🔑 DEBUG response:", response.status_code, response.text)

    #catch any errors
    if response.status_code != 200:
        raise Exception(f"Failed to get token: {response.text}")

    return response.json().get("access_token")

# stkpush
@app.post("/stk_push")
def stk_push(phone_number:str,amount:int):
    access_token = get_access_token()
    url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
    timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
    password = base64.b64encode((short_code+passkey+timestamp).encode('utf-8')).decode('utf-8')
    payload = {
        "BusinessShortCode": short_code,
        "Password": password,
        "Timestamp": timestamp,
        "TransactionType": "CustomerPayBillOnline",
        "Amount": amount,
        "PartyA": phone_number,
        "PartyB": short_code,
        "PhoneNumber": phone_number,
        "CallBackURL": callback_url,
        "AccountReference": "NetworkBilling",
        "TransactionDesc": "Payment for internet"
    }

    headers = {"Authorization":f"Bearer {access_token}"}
    response = requests.post(url,json=payload,headers=headers)
    
    return response.json()

#Callback Url
@app.post("/callback/")
async def mpesa_callback(request: Request,db:Session=Depends(get_db)):
    data = await request.json()
    print("Mpesa callback data: ",data)
    try:
        body = data['Body']['stkCallback']
        result_code = body["ResultCode"]
        metadata = body.get("CallbackMetadata",{}).get("Item",[])
        
        phone_number = None
        amount = None
        receipt  =None
        
        for item in metadata:
            if item["Name"] =="PhoneNumber":
                phone_number = str(item["Value"])
            elif item["Name"] =="Amount":
                amount = float(item["Value"])
            elif item["Name"] =="MpesaReceiptNumber":
                receipt = item["Value"]
        status = "Success" if result_code == 0 else "Failed"
        
        payment=Payment(
            phone_number =phone_number or "Unknown",
            amount = amount or 0,
            mpesa_receipt =receipt,
            status =status,
        )
        db.add(payment)
        db.commit()
    except Exception as e:
        print("Error saving Payment",e)
    return {"ResultCode":0,"ResultDesc":"Call received Sucessifully"}

@app.get("/")
def read_root():
    return {"message": "FastAPI MPESA app is running"}

#pydantic schema for response
class PaymentOut(BaseModel):
    id:int
    phone_number:str
    amount:float
    mpesa_receipt:str | None
    status:str
    created_at:datetime
    
    class Config:
        from_attributes = True  # orm_mode: True
        
# fetch all payments
@app.get("/payments", response_model=List[PaymentOut])
def get_payments(
    status: Optional[str]=Query(None,description="Filter by payment status (Success/Pending/Failed)"),
    phone_number :Optional[str] =Query(None,description="filter by phone number"),
    min_amount:Optional[float] = Query(None,description="Filter by minimum amount"),
    start_date:Optional[str] = Query(None,description="Filter by start date (YYYY-MM-DD)"),
    end_date:Optional[str] = Query(None,description="Filter by end date (YYYY-MM-DD)"),
    
    db:Session=Depends(get_db)
    ):
    query = db.query(Payment)
    if status:
        query = query.filter(Payment.status == status)
    if phone_number:
        query = query.filter(Payment.phone_number == phone_number)
    if min_amount is not None:
        query = query.filter(Payment.amount >=min_amount)
    if start_date:
        try:
            start =datetime.strptime(start_date,"%Y-%m-%d") 
            query = query.filter(Payment.created_at >=start) 
        except ValueError:
            pass
    if end_date:
        try:
            end =datetime.strptime(end_date,"%Y-%m-%d") 
            query = query.filter(Payment.created_at <=end) 
        except ValueError:
            pass
    
    payments = query.order_by(Payment.created_at.desc()).all()
    return payments
    
# payments summary
@app.get("/payments/summary")
def payment_summary(db:Session =Depends(get_db)):
    total_revenue = db.query(func.sum(Payment.amount)).filter(Payment.status =="Success").scalar() or 0
    total_success = db.query(func.count(Payment.id)).filter(Payment.status == "Success").scalar() or 0
    total_failed = db.query(func.count(Payment.id)).filter(Payment.status == "Failed").scalar() or 0
    total_pending = db.query(func.count(Payment.id)).filter(Payment.status == "Pending").scalar() or 0
    total_payments = db.query(func.count(Payment.id)).scalar() or 0
    
    return {
        "total_revenue": total_revenue,
        "total_transactions": total_payments,
        "success_count": total_success,
        "failed_count": total_failed,
        "pending_count": total_pending
    }