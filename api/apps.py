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

        credentials_dict = {
            "type": "service_account",
            "project_id": os.getenv("FIREBASE_PROJECT_ID"),
            "private_key_id": os.getenv("FIREBASE_PRIVATEKEY_ID"),
            "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDC05SO25RZZ5Y0\nXGEAO2uGTCBT3HN6LtiP8m+QBGLpiBw6GUvdbRdp9/Xqa+fSVFg2lz8X69pwJwYv\npwu4hxYiMxQIsvkdhRUiAx5b/Bx6N3tz7+0X2iEKlKaO5PUZpVaTWKCW+TrhHLNT\nJpaBiQSu0mHtt97jr7gp9jt8noxtXeXOZuJN10PvOJdGbdHgaZFaL1qCYn7CFetX\nZGmta9OjZ/W9K/LhvP7OVLmvezj+XAGIdRP3NKG/5x3ETO2BRmVPpCGtH3zcRzpp\n4c2BNwxE7ari2rJtyuvVwaHZD6wOTUPPUnybtK5/v7vzLaWtKYuyTcBvWjXiA8Ks\nNbrSOrnfAgMBAAECggEACBnOEoaUy4bgGvtAWUcfOG1P5szCzHDINmwJMX7NMhKj\nwdKtcd6IW7KgugeUkw1IwbRWPkNjSMiGnFKgzSJozDE9gwMWEqEm+MwSZha8hGRs\nMKzoOdarCwqVRlnEyzUxvVyxCLYCObv8xNdU6LvuwuoigkTj8qmqyavgW1UoV5++\nTPYvWnyC/jDjZL42PvyqbH4tzx9EPPyOIjNNoCkGf1+Q5NK+gzSD5SKH0+h3uMkl\nq9WaGdEgJAN6CoQ3n6kGxrMduLyQ/XVBERFn9ymLn3pD5A17m7H2Nh3VQNUJfCLY\nOyQNx4kAhx8PB4gxnOTSv6fLV4TWPzXebmGxP5dEoQKBgQDgA37BkZ0dIfT7Og9K\nueR73dZIzstLaGP/wF7nXpHex6XfpuOmlo/TuWTVd6Pw0DOlmj0oL01lX3lEYQsl\nILJcvTkIldP3EVE/lOUilakrhhj+JPKiQMwCvGoDa5CErjv1SceOYCIc0sFJiFLn\nNxR/BU+vs93f6NG15IvaQvfhcQKBgQDepTBvlgEU+u647I8ZN1gjwB6bZYPoc9TD\nN3A/MBH61V0qD41o8538nKXFvR7/KUjqQkYE0yfHrxjS5/oW7T8pAjkUaFeqzgnA\nvmVRtoVxayLldGgMTqse1AG36xLmQVEPlHQD+PxwaFvoc2Hqy4f6T79/jthUd0I9\n+8qa02qoTwKBgEWcMG5cHlNoMuVCZHAXFc374FOdlwSmurRFhfglpfRxW7UE+ibR\nEH59VL0UwWfaesISDMEI+ebvZRJ/iWQPJf21exyU2lojEnlMfmth0EDLGccXmiIb\nOon7HIJVkYH5Vn5hX9Z5PwBv6Uo9R2276u2Rq/JwVRj4EvqPu3mmZ7qxAoGBAJeG\n/3cCNUxNF8mdniqAQylZqLsEFQlQQ/50rZ0jnykCq3xjx08ldmGlTyFL/FuWgnyE\njFjeSNWbMp7fqJKP9wt26tgbx4aE4ZhfPF+nhBxT2RUm62Vs6QN7MIw2nc89puie\nlXLasxvhuqNyW7LLwIi4W9F5q3uZCulag2Jp/s37AoGBAJ7B0ORd9lPmHC8iV+HL\nyOi+a/9N7vQ998p8Mafj/oSt7ZI9A/ZeVycWaxePeEb0vpPODI9Fq3I/6kW9VzWr\nIQDCmBMcSnhqk5Bb9E+RCB7ykjf7jL16lW7iApO/04sahJujadv7tDabyZWnlJs2\nJfpgelwnFCdktIIGA24vPwZF\n-----END PRIVATE KEY-----\n",
            "client_email": "firebase-adminsdk-4tedl@sylva-687f1.iam.gserviceaccount.com",
            "client_id": os.getenv("FIREBASE_CLIENTID"),
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
            "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-4tedl%40sylva-687f1.iam.gserviceaccount.com",
            "universe_domain": "googleapis.com"
        }

        from firebase_admin import _apps
        if not _apps:
            # Use the dictionary directly with Certificate
            cred = credentials.Certificate(credentials_dict)
            initialize_app(cred)
            print('firebase initialized')