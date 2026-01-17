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
    benim_mailim = os.getenv("MY_EMAIL")
    uygulama_sifresi = os.getenv("MY_APP_PASSWORD")

    mail_konusu = f"PORTFOLYO İLETİŞİM: {data.name}"
    mail_icerigi = f"""
    Web sitenden yeni bir mesajın var!
    
    Gönderen: {data.name}
    E-posta: {data.email}
    
    Mesaj:
    {data.message}
    """

    msg = MIMEText(mail_icerigi)
    msg['Subject'] = mail_konusu
    msg['From'] = benim_mailim
    msg['To'] = benim_mailim

    if getattr(data, 'website', None):
        raise HTTPException(status_code=400, detail="Spam detected")

    if not benim_mailim or not uygulama_sifresi:
        raise HTTPException(status_code=500, detail="E-posta kimlik bilgileri yapılandırılmamış")

    try:
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(benim_mailim, uygulama_sifresi)
        server.send_message(msg)
        server.quit()
        return {"message": "Message sent successfully!"}
    except Exception as e:
        print(f"Hata: {e}")
        raise HTTPException(status_code=500, detail="Mail gönderilemedi")