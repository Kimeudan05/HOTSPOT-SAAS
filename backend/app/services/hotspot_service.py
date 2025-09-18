from datetime import datetime, timezone

# Stub function to simulate granting internet access

# Later this will interact with your hotspot (Mikrotik/Dante/CoovaChilli)
def grant_access(phone_number: str, duration: int):
    """
    Simulate granting internet access to a phone number
    for a specified duration in minutes.
    Replace this stub with real hotspot API calls.
    """
    print(f"🌐 [{datetime.now(timezone.utc)}] Granted Internet to {phone_number} for {duration} minutes")

# Stub function to simulate revoking internet access
def revoke_acces(phone_number: str):
    """
    Simulate revoking internet access from a phone number.
    Replace this stub with real hotspot API calls.
    """
    print(f"❌ [{datetime.now(timezone.utc)}] Revoked internet for {phone_number}")
