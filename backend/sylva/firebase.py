import firebase_admin
from firebase_admin import credentials
from dotenv import load_dotenv
import os

load_dotenv()
firebase_config = {
    "type": "service_account",
    "project_id": "sylva-687f1",
    "private_key_id": os.getenv("FIREBASE_PRIVATE_KEY_ID"),
    "private_key": os.getenv("FIREBASE_PRIVATE_KEY").replace('\\n', '\n'),
    "client_email": os.getenv("FIREBASE_CLIENT_EMAIL"),
    "client_id": "102471103956928836899",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-4tedl%40sylva-687f1.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
}

# Initialize Firebase app
cred = credentials.Certificate(firebase_config)
firebase_admin.initialize_app(cred)