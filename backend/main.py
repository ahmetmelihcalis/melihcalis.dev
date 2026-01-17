import os
import requests
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
        raise HTTPException(status_code=500, detail=f"System error: {str(e)}")