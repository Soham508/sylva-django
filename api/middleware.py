from django.http import JsonResponse
from firebase_admin import auth

def firebase_auth_required(view_func):
    def wrapper(request, *args, **kwargs):
        id_token = request.headers.get('Authorization')
        if not id_token:
            return JsonResponse({"error": "Authorization header is missing"}, status=401)

        if not id_token.startswith("Bearer "):
            return JsonResponse({"error": "Authorization token must start with 'Bearer '"}, status=400)

        id_token = id_token.split("Bearer ")[1]

        try:
            # Verify the token using Firebase Admin SDK
            decoded_token = auth.verify_id_token(id_token)
            request.user = decoded_token  # Attach the user info to the request
        except auth.ExpiredIdTokenError:
            return JsonResponse({"error": "Token has expired"}, status=401)

        except auth.InvalidIdTokenError:
            return JsonResponse({"error": "Token is invalid"}, status=401)

        except Exception as e:
            return JsonResponse({"error": f"Unexpected error: {str(e)}"}, status=500)

        return view_func(request, *args, **kwargs)

    return wrapper

