import os
from typing import Optional

import requests
from fastapi import FastAPI, HTTPException, Request
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

load_dotenv()

ALLOWED_ORIGINS = [
    "http://localhost",
    "http://localhost:8000",
    "http://localhost:3000",
    "http://127.0.0.1:8000",
    "http://127.0.0.1:3000",
    "https://melihcalis.dev",
    "https://www.melihcalis.dev",
]

BREVO_API_URL = "https://api.brevo.com/v3/smtp/email"
BREVO_SUCCESS_STATUS = 201
BREVO_TIMEOUT_SECONDS = 10
CONTACT_SERVICE_UNAVAILABLE = "Contact service is not configured."
EMAIL_DELIVERY_FAILED = "Email service could not process the message."
EMAIL_SERVICE_UNAVAILABLE = "Email service is unavailable."
EMAIL_SERVICE_TIMEOUT = "Email service timed out."
INTERNAL_SERVER_ERROR = "Internal Server Error"

limiter = Limiter(key_func=get_remote_address)
app = FastAPI()
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Backend service is running."}

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ContactForm(BaseModel):
    name: str = Field(..., min_length=2, max_length=50)
    email: EmailStr
    message: str = Field(..., min_length=10, max_length=5000)
    website: Optional[str] = None


def get_email_settings() -> tuple[str, str]:
    brevo_api_key = os.getenv("BREVO_API_KEY")
    my_email = os.getenv("MY_EMAIL")

    if not brevo_api_key or not my_email:
        raise HTTPException(status_code=500, detail=CONTACT_SERVICE_UNAVAILABLE)

    return brevo_api_key, my_email


def build_email_content(data: ContactForm) -> str:
    return f"""
    You have a new message from your website!
    
    Sender: {data.name}
    Email: {data.email}
    
    Message:
    {data.message}
    """


def build_brevo_headers(api_key: str) -> dict[str, str]:
    return {
        "accept": "application/json",
        "api-key": api_key,
        "content-type": "application/json",
    }


def build_brevo_payload(data: ContactForm, my_email: str) -> dict:
    return {
        "sender": {"name": data.name, "email": my_email},
        "to": [{"email": my_email, "name": "Ahmet Melih"}],
        "replyTo": {"email": data.email, "name": data.name},
        "subject": f"PORTFOLIO MESSAGE: {data.name}",
        "textContent": build_email_content(data),
    }

@app.post("/api/contact")
@limiter.limit("5/minute")
def send_mail(request: Request, data: ContactForm):
    if data.website and data.website.strip() != "":
        raise HTTPException(status_code=400, detail="Spam detected.")

    brevo_api_key, my_email = get_email_settings()
    headers = build_brevo_headers(brevo_api_key)
    payload = build_brevo_payload(data, my_email)

    try:
        response = requests.post(
            BREVO_API_URL,
            json=payload,
            headers=headers,
            timeout=BREVO_TIMEOUT_SECONDS,
        )
        
        if response.status_code == BREVO_SUCCESS_STATUS:
            return {"message": "Message sent successfully!"}

        print(f"Brevo Error: {response.text}")
        raise HTTPException(status_code=502, detail=EMAIL_DELIVERY_FAILED)
    except requests.Timeout:
        print("Brevo Error: Request timed out")
        raise HTTPException(status_code=504, detail=EMAIL_SERVICE_TIMEOUT)
    except requests.RequestException as e:
        print(f"Brevo Request Error: {e}")
        raise HTTPException(status_code=502, detail=EMAIL_SERVICE_UNAVAILABLE)
    except HTTPException:
        raise
    except Exception as e:
        print(f"System Error: {e}")
        raise HTTPException(status_code=500, detail=INTERNAL_SERVER_ERROR)
