import os
import smtplib
from email.mime.text import MIMEText
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Backend service is running."}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ContactForm(BaseModel):
    name: str
    email: str
    message: str
    website: Optional[str] = None

@app.post("/api/contact")
async def send_mail(data: ContactForm):
    my_email = os.getenv("MY_EMAIL")
    app_password = os.getenv("MY_APP_PASSWORD")

    email_subject = f"PORTFOLIO CONTACT: {data.name}"
    email_body = f"""
    You have a new message from your website!
    
    Sender: {data.name}
    Email: {data.email}
    
    Message:
    {data.message}
    """
    
    if data.website:
        email_body += f"\n\n--- SPAM DETECTED ---\nWebsite field filled: {data.website}"

    msg = MIMEText(email_body)
    msg['Subject'] = email_subject
    msg['From'] = my_email
    msg['To'] = my_email

    if data.website and data.website.strip() != "":
        raise HTTPException(status_code=400, detail="Spam detected.")

    if not my_email or not app_password:
        raise HTTPException(status_code=500, detail="Email credentials not found.")

    try:

        server = smtplib.SMTP('smtp.gmail.com', 587, timeout=30)
        
        server.ehlo()
        
        server.starttls()
        
        server.ehlo()

        server.login(my_email, app_password)
        server.send_message(msg)
        server.quit()
        
        return {"message": "Message sent successfully!"}
        
    except Exception as e:
        print(f"Error details: {e}")
        raise HTTPException(status_code=500, detail=f"Email sending failed: {str(e)}")