import requests
from app.core.config import settings

# Sends SMS messages using Africa's Talking API
def send_sms(to_number: str, message: str):
    try:
        url = "https://api.africastalking.com/version1/messaging"
        headers = {
            "apikey": settings.AT_USERNAME,  # API key for authentication
            "Content-Type": "application/x-www-form-urlencoded"  # Correct content type header
        }
        data = {
            "username": settings.AT_USERNAME,
            "to": to_number,
            "message": message
        }
        
        response = requests.post(url, headers=headers, data=data)
        print(f"SMS sent to {to_number}, status: {response.text}")
    except Exception as e:
        print(f"SMS sending failed: {e}")
