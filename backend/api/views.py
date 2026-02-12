import time
from django.http import JsonResponse
import numpy as np
import pandas as pd
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import User
from rest_framework.decorators import api_view
from .serializers import InputSerializer, UserInputSerializer, QuestionScoresModelSerializer, UserSerializer
from portfolioOptimizer import PortfolioOptimizer  
from fuzzy_logic import calculate_risk_tolerance 
import os
df = pd.read_csv(os.path.join(os.path.dirname(__file__), '../price_data.csv'))
from .middleware import firebase_auth_required
from firebase_admin import auth
from django.core.cache import cache
from celery import chain
from api.tasks import calculate_A, generate_portfolio, calculate_risk_tolerance
import logging


logger = logging.getLogger(__name__)

def test(request): 
    return JsonResponse({"message": "Working..."}, status= 200)

def verify_token(request):
    id_token = request.headers.get('Authorization')

    if not id_token:
        return JsonResponse({"error": "Authorization header is missing"}, status=401)

    if not id_token.startswith("Bearer "):
        return JsonResponse({"error": "Authorization token must start with 'Bearer '"}, status=400)

    id_token = id_token.split("Bearer ")[1]

    try:
        # Verify the token with Firebase Admin SDK
        decoded_token = auth.verify_id_token(id_token)
        uid = decoded_token.get('uid')
        email = decoded_token.get('email')

        # Return a success response
        return JsonResponse({"message": "Token is valid", "uid": uid, "email": email}, status=200)

    except auth.ExpiredIdTokenError:
        return JsonResponse({"error": "Token has expired"}, status=401)

    except auth.InvalidIdTokenError:
        return JsonResponse({"error": "Token is invalid"}, status=401)

    except Exception as e:
        return JsonResponse({"error": f"Unexpected error: {str(e)}"}, status=500)

@firebase_auth_required
def protected_view(request):
    return JsonResponse({"message": "You are authenticated!", "user": request.user}, status=200)

class UserAPIView(APIView):

    def dispatch(self, request, *args, **kwargs):
        # using authentication for all methods except POST
        if request.method not in ['POST', 'GET', 'PATCH']:
            id_token = request.headers.get('Authorization')
            if not id_token:
                return JsonResponse({"error": "Authorization header is missing"}, status=401)

            if not id_token.startswith("Bearer "):
                return JsonResponse({"error": "Authorization token must start with 'Bearer '"}, status=400)

            id_token = id_token.split("Bearer ")[1]

            try:
                decoded_token = auth.verify_id_token(id_token)
                logger.info("User authenticated successfully")
            except auth.ExpiredIdTokenError:
                logger.error("Failed to authenticate the user") 
                return JsonResponse({"error": "Token has expired"}, status=401)
            except auth.InvalidIdTokenError:
                logger.error("Failed to authenticate the user")
                return JsonResponse({"error": "Token is invalid"}, status=401)
            except Exception as e:
                logger.error("Failed to authenticate the user")
                return JsonResponse({"error": f"Unexpected error: {str(e)}"}, status=500)

        return super().dispatch(request, *args, **kwargs)
    
    def get(self, request):
        print(request.data.get('email'))
        email = request.query_params.get('email') 
        if email is not None:
            cache_key = f"user_data_{email}"
            cached_data = cache.get(cache_key)
    
            if cached_data:
                print('responding cached data...')
                return Response({"user": cached_data, "success": True})
    
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return Response({"detail": "User not found.", "success": False}, status=status.HTTP_404_NOT_FOUND)
               
            serializer = UserSerializer(user)
            cache.set(cache_key, serializer.data, timeout=60 * 10)  # Cache for 10 minutes
    
            return Response({"user": serializer.data, "success": True})
    
        return Response({"detail": "User ID is required for GET.", "success": False}, status=status.HTTP_400_BAD_REQUEST)
        
    def post(self, request):
        email = request.data.get('email') 
        if email and User.objects.filter(email=email).count() > 0:
            return Response({"detail": "User with this email already exists.", "userCreated": False}, status=status.HTTP_400_BAD_REQUEST)
    
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save() 
            logger.info("User created successfully") 
            return Response({"user": UserSerializer(user).data, "userCreated": True}, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request):
        email = request.data.get('email')
        if email is None:
            return Response({"detail": "email is required for PATCH.", "success": False}, status=status.HTTP_400_BAD_REQUEST)
    
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"detail": "User not found.", "success": False}, status=status.HTTP_404_NOT_FOUND)

        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            updated_user = serializer.save() 
            logger.info("User updated successfully") 
            return Response({"detail":UserSerializer(updated_user).data, "success": True})
        return Response({"detail":serializer.errors, "success": False}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        email = request.data.get('email')   
        if email is None:
         return Response({"detail": "email is required for PUT."}, status=status.HTTP_400_BAD_REQUEST)
 
        try:
         user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)
 
        serializer = UserSerializer(user, data=request.data)
        if serializer.is_valid():
            updated_user = serializer.save()  
            logger.info("User updated successfully") 
            return Response(UserSerializer(updated_user).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
 
    def delete(self, request):
        email = request.data.get('email')
        if email is None:
            return Response({"detail": "User ID is required for DELETE."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        user.delete()
        logger.warning("User deleted successfully")
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['POST'])
def generate_risk_score(request):
    serializer = QuestionScoresModelSerializer(data=request.data)
    if serializer.is_valid():
        questions_scores = serializer.validated_data

        if len(questions_scores['questions']) != 10:
            return Response({"error": "Expected exactly 10 questions in the input."}, status=400)

        scores = [question['score'] for question in questions_scores['questions']]

        start_time = time.time()
        risk_score = calculate_risk_tolerance(*scores)
        end_time = time.time()

        duration = end_time - start_time
        print(f"Calculation finished. Time taken: {duration:.4f} seconds.")

        return Response({"risk_tolerance_score": risk_score})

    return Response(serializer.errors, status=400)


@api_view(['POST'])
def generate_portfolio(request):
    serializer = UserInputSerializer(data=request.data)
    if serializer.is_valid():
        input_data = serializer.validated_data
        a_value = input_data['a']
        stocks_list = input_data['stocks']
        user_wealth = input_data['wealth']

        # Portfolio optimization logic
        df_selected = df[stocks_list]
        df_returns = df_selected.pct_change()

        portfolio_optimizer = PortfolioOptimizer(
            df_selected,
            tickers=stocks_list,
            risk_aversion=a_value,
            investment_amount=100,
            wealth=user_wealth
        )
        
        # Current portfolio calculation
        current_cov_matrix = portfolio_optimizer.current_cov
        current_expected_returns = portfolio_optimizer.current_expected_returns
        current_expected_returns_final = [i for i in current_expected_returns]
        current_std_dev_dict = df_returns.iloc[:len(df_returns)-1].std()
        current_std_dev = [i for i in current_std_dev_dict]
        
        if a_value >= 5:
            min_var_portfolio_weights_dict = portfolio_optimizer.calculate_minimum_variance_portfolio(current_cov_matrix['2'])
        else:
            min_var_portfolio_weights_dict = portfolio_optimizer.calculate_tangency_portfolio(current_expected_returns_final, current_cov_matrix['2'])
        
        min_var_portfolio_weights = [i for i in min_var_portfolio_weights_dict.values()]
        
        portfolio_return = np.dot(min_var_portfolio_weights, current_expected_returns_final)
        portfolio_std = np.dot(min_var_portfolio_weights, current_std_dev)
        
        new_weights_min_var, risky_proportion_min_var = portfolio_optimizer.calculate_optimal_allocation(min_var_portfolio_weights_dict, portfolio_return, portfolio_std)
        portfolio_allocation = portfolio_optimizer.calculate_portfolio_quantities(new_weights_min_var)
        
        # New portfolio calculations after rebalancing
        next_cov_matrix = portfolio_optimizer.next_cov
        next_expected_returns = portfolio_optimizer.next_expected_returns
        next_expected_returns_final = [i for i in next_expected_returns]
        next_std_dev_dict = df_returns.iloc[1:len(df_returns)].std()
        next_std_dev = [i for i in next_std_dev_dict]
        
        if a_value <= 5:
            min_var_portfolio_weights_dict_new = portfolio_optimizer.calculate_minimum_variance_portfolio(next_cov_matrix['2'])
        else:
            min_var_portfolio_weights_dict_new = portfolio_optimizer.calculate_tangency_portfolio(next_expected_returns_final, next_cov_matrix['2'])
        
        min_var_portfolio_weights_new = [i for i in min_var_portfolio_weights_dict_new.values()]
        portfolio_return_new = np.dot(min_var_portfolio_weights_new, next_expected_returns_final)
        portfolio_std_new = np.dot(min_var_portfolio_weights_new, next_std_dev)
        
        new_weights_min_var, risky_proportion_min_var = portfolio_optimizer.calculate_optimal_allocation(min_var_portfolio_weights_dict_new, portfolio_return_new, portfolio_std_new)
        portfolio_allocation_new = portfolio_optimizer.calculate_portfolio_quantities(new_weights_min_var)
        
        # Changes calculation after rebalancing
        buy_sell_decisions = portfolio_optimizer.calculate_buy_sell_decisions(portfolio_allocation, portfolio_allocation_new)
        
        # Save the result to the database (assuming a save_result function exists)
        # save_result(input_data)

        response_data = {
            "initial_portfolio": portfolio_allocation,
            "target_portfolio": portfolio_allocation_new,
            "actions": buy_sell_decisions
        }

        return Response(response_data)
    
    return Response(serializer.errors, status=400)

@api_view(['POST'])
def calculate_portfolio(request):
    serializer = InputSerializer(data=request.data)

    if serializer.is_valid():
       input_data = serializer.validated_data
       print(input_data)
       questions_scores = input_data['questions']
       if len(questions_scores) != 10:
           return Response({"error": "Expected exactly 10 questions in the input."}, status=400)   
       # Extract scores from the input data
       scores = [question['score'] for question in questions_scores]
       username = input_data['username']
       stocks = input_data['stocks']
       wealth = input_data['wealth']
       A_score = calculate_A.delay(scores, stocks, wealth, username)
       return Response({"task_id": "done task"}, status=202)

    return Response(serializer.errors, status=400)