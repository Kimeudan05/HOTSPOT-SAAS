import requests
import base64
from datetime import datetime
from app.core.config import settings

# Function to get an OAuth access token from Safaricom's API
def get_access_token():
    url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
    # Authenticate using Consumer Key and Secret to get access token
    response = requests.get(url, auth=(settings.MPESA_CONSUMER_KEY, settings.MPESA_CONSUMER_SECRET))
    
    if response.status_code != 200:
        raise Exception(f"Failed to get token: {response.text}")
    
    # Extract and return the access token from response
    return response.json().get("access_token")

# Function to initiate an M-Pesa STK Push (mobile payment prompt) to a phone number
def stk_push(phone_number: str, amount: int):
    # First, get a valid access token
    access_token = get_access_token()
    
    # M-Pesa STK Push API endpoint
    url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
    
    # Generate current timestamp in the required format YYYYMMDDHHMMSS
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    
    # Create the password by base64 encoding Shortcode + Passkey + Timestamp
    password_str = settings.MPESA_SHORTCODE + settings.MPESA_PASSKEY + timestamp
    password = base64.b64encode(password_str.encode('utf-8')).decode('utf-8')
    
    # Build the JSON payload with all required parameters
    payload = {
        "BusinessShortCode": settings.MPESA_SHORTCODE,
        "Password": password,
        "Timestamp": timestamp,
        "TransactionType": "CustomerPayBillOnline",
        "Amount": amount,
        "PartyA": phone_number,          # The customer making the payment
        "PartyB": settings.MPESA_SHORTCODE,  # The business shortcode receiving the money
        "PhoneNumber": phone_number,     # The same phone number to be prompted for payment
        "CallBackURL": settings.MPESA_CALLBACK_URL,  # URL to receive payment result notifications
        "AccountReference": "Hotspot",  # Reference for the payment
        "TransactionDesc": "Payment for Internet"
    }
    
    # Add authorization header with the access token
    headers = {"Authorization": f"Bearer {access_token}"}
    
    # Make POST request to M-Pesa API to initiate the payment prompt
    response = requests.post(url, json=payload, headers=headers)
    
    # Return the API response as JSON
    return response.json()
