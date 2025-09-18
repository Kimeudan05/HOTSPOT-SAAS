import smtplib
from email.mime.text import MIMEText
from app.core.config import settings

# Sends an HTML email to a given recipient
def send_email(to_email: str, subject: str, body: str):
    try:
        # Compose email message
        msg = MIMEText(body, "html")
        msg["Subject"] = subject
        msg["From"] = settings.EMAIL_FROM
        msg["To"] = to_email
        
        # Connect to SMTP server and send email
        with smtplib.SMTP(settings.SMTP_SERVER, settings.SMTP_PORT) as server:
            server.starttls()  # Secure the connection
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.sendmail(settings.EMAIL_FROM, [to_email], msg.as_string())
            
        print(f"Email sent to {to_email}")
        
    except Exception as e:
        print(f"Email sending failed: {e}")
