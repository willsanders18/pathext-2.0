from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()
 
# MAIL_USERNAME=your.email@gmail.com
# MAIL_PASSWORD=your_16_char_app_password
MAIL_USERNAME = os.getenv("MAIL_USERNAME")
MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")

app = FastAPI()

# Allow your React app to communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Email Configuration
conf = ConnectionConfig(
    MAIL_USERNAME=MAIL_USERNAME,
    MAIL_PASSWORD=MAIL_PASSWORD,
    MAIL_FROM=MAIL_USERNAME,
    MAIL_PORT=587,
    MAIL_SERVER="smtp.gmail.com",
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)

class FormData(BaseModel):
    email: EmailStr

@app.post("/api/submit")
async def submit_form(data: FormData, background_tasks: BackgroundTasks):
    # 1. Process your form data here
    
    # 2. Define the email message
    html_content = f"""
    <h2>Form Received!</h2>
    <p>Thanks for submitting your information. We have successfully registered the email: <strong>{data.email}</strong>.</p>
    """
    
    message = MessageSchema(
        subject="Submission Confirmation",
        recipients=[data.email], # Sends to the email the user inputted
        body=html_content,
        subtype=MessageType.html
    )

    # 3. Add email sending to background tasks
    fm = FastMail(conf)
    background_tasks.add_task(fm.send_message, message)

    # 4. Return response immediately
    return {"message": "Form submitted successfully. Email is sending in the background."}