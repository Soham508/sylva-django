import json
from celery import shared_task
from fuzzy_logic import calculate_risk_tolerance 
import os
import numpy as np
import pandas as pd
df = pd.read_csv(os.path.join(os.path.dirname(__file__), '../price_data.csv'))
from portfolioOptimizer import PortfolioOptimizer 
import requests
from .models import User

@shared_task
def update_user(data):
    username = data['username']
    if username is None:
        return {"detail": "Username is required for PATCH.", "success": False}

    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return {"detail": "User not found.", "success": False}
    
    user.initial_portfolio = data['initial_portfolio']
    user.target_portfolio = data['target_portfolio']
    user.actions = data['actions']
    user.A = data['A']
    user.save(update_fields=['initial_portfolio', 'target_portfolio', 'actions', 'A'])
    print('User updated successfully')
    return {"detail": data, "success": True}
    

@shared_task
def send_email_task():
    # Simulated email sending logic
    print("Email sent!")

@shared_task
def calculate_A(scores, stocks, wealth, username):
    print('started calculating A...')
    risk_score = calculate_risk_tolerance(*scores)
    print(f'A calculated to be {risk_score}')
    generate_portfolio.delay(risk_score, stocks, wealth, username)
    return risk_score

@shared_task
def generate_portfolio(risk_score, stocks, wealth, username):
    a_value = risk_score
    stocks_list = stocks
    user_wealth = wealth

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
        "actions": buy_sell_decisions,
        "username": username,
        "A": risk_score
    }     

    update_user.delay(response_data)
 
    return response_data  # If the API returns JSON data
   
def calculate_risk_tolerance(*scores):
   
    MIN_SCORE = 10  
    MAX_SCORE = 90 

    total_score = sum(scores)

    risk_tolerance = (total_score - MIN_SCORE) / (MAX_SCORE - MIN_SCORE) * 10

    risk_tolerance = max(0, min(10, risk_tolerance))

    return round(risk_tolerance, 2)