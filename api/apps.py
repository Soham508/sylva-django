from django.apps import AppConfig
import firebase_admin
from firebase_admin import credentials, initialize_app
import os
from dotenv import load_dotenv

class ApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'
   
    def ready(self):
        load_dotenv()
        credentials_path = os.getenv('FIREBASE_CREDENTIALS_PATH')

        if not os.path.exists(credentials_path):
            raise FileNotFoundError(f"Firebase credentials file not found at {credentials_path}")
        
        from firebase_admin import _apps
        if not _apps:
            cred = credentials.Certificate(credentials_path)
            initialize_app(cred)
            print('firebase initiallized')