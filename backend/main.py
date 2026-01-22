import os
import requests
from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel, Field
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

load_dotenv()

limiter = Limiter(key_func=get_remote_address)
app = FastAPI()
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Backend service is running."}

origins = [
    "http://localhost",
    "http://localhost:8000",
    "http://localhost:3000",
    "http://127.0.0.1:8000",
    "http://127.0.0.1:3000",
    "https://melihcalis.dev",
    "https://www.melihcalis.dev"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ContactForm(BaseModel):
    name: str = Field(..., min_length=2, max_length=50)
    email: str = Field(..., max_length=50) 
    message: str = Field(..., min_length=10, max_length=5000)
    website: Optional[str] = None

@app.post("/api/contact")
@limiter.limit("5/minute")
async def send_mail(request: Request, data: ContactForm):

    brevo_api_key = os.getenv("BREVO_API_KEY")
    my_email = os.getenv("MY_EMAIL") 

    if data.website and data.website.strip() != "":
        raise HTTPException(status_code=400, detail="Spam detected.")

    if not brevo_api_key or not my_email:
        raise HTTPException(status_code=500, detail="API credentials not configured.")
    
    email_subject = f"PORTFOLIO MESSAGE: {data.name}"
    email_content = f"""
    You have a new message from your website!
    
    Sender: {data.name}
    Email: {data.email}
    
    Message:
    {data.message}
    """

    url = "https://api.brevo.com/v3/smtp/email"
    
    headers = {
        "accept": "application/json",
        "api-key": brevo_api_key,
        "content-type": "application/json"
    }
    
    payload = {
        "sender": {"name": data.name, "email": my_email},
        "to": [{"email": my_email, "name": "Ahmet Melih"}], 
        "replyTo": {"email": data.email, "name": data.name}, 
        "subject": email_subject,
        "textContent": email_content
    }

    try:
        response = requests.post(url, json=payload, headers=headers)
        
        if response.status_code == 201:
            return {"message": "Message sent successfully!"}
        else:
            print(f"Brevo Error: {response.text}")
            raise HTTPException(status_code=500, detail="Failed to send email via API")
            
    except Exception as e:
        print(f"System Error: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")