import numpy as np
from scipy.optimize import minimize
#import yfinance as yf
import pandas as pd

class PortfolioOptimizer:
    def __init__(self, df, tickers,risk_aversion, investment_amount, wealth):
        """
        Initialize the PortfolioOptimizer with required inputs
        
        Parameters:
        -----------
        tickers : list
            List of stock ticker symbols (e.g., ['AAPL', 'GOOGL', 'MSFT'])
        current_prices : dict or pandas Series
            Current prices of stocks with tickers as keys
        expected_returns : dict or pandas Series
            Expected returns for next week with tickers as keys
        covariance_matrix : pandas DataFrame or numpy array
            Covariance matrix of stock returns
        risk_aversion : float
            Risk aversion parameter A (higher means more risk-averse)
        investment_amount : float
            Total wealth to be invested in the portfolio
        """
        
            
        # Store all inputs as instance variables
        self.tickers = tickers
        self.current_prices = df.iloc[-1]
        self.wealth = wealth
       
        self.risk_aversion = risk_aversion
        self.investment_amount = investment_amount
        self.rf_rate = 0.0013  # Weekly risk-free rate
        
        # Calculate number of stocks
        self.n_stocks = len(tickers)
        
        df_returns = df.pct_change()
        
        self.returns_df = df_returns
        self.current_expected_returns = df_returns.iloc[:len(df_returns)-1].mean()
        # Store next period parameters
        self.next_expected_returns = df_returns.mean()
        self.current_cov = self.cov_matrix(df_returns.iloc[:len(df_returns)-1])
        self.next_cov = self.cov_matrix(df_returns.iloc[1:len(df_returns)])
        
        
    def cov_matrix(self,df):
        
        
        # Calculate average returns
        average_returns = df.mean()

        # Calculate variance-covariance matrix
        variance_cov_matrix = df.cov()

        # Perform eigenvalue decomposition
        eigenvalues, eigenvectors = np.linalg.eigh(variance_cov_matrix)

        # Define the random matrix theory bounds for filtering eigenvalues
        Q = df.shape[0] / df.shape[1]
        lambda_min = 0
        lambda_max = (1 + (1 / Q) + 2 * (1 / Q) ** 0.5)

        # Filter eigenvalues and eigenvectors
        filtered_eigenvalues = [eig for eig in eigenvalues if eig > lambda_max or eig < lambda_min]

        if len(filtered_eigenvalues) > 0:
            # Create dictionaries for eigenvectors
            filtered_eigenvectors_dict = {
                eigenvalues[i]: eigenvectors[:, i] 
                for i in range(len(eigenvalues))
                if eigenvalues[i] < lambda_min or eigenvalues[i] > lambda_max
            }
        else:
            filtered_eigenvectors_dict = np.array([])  # Set to empty array if no filtered eigenvalues

        inside_bound_eigenvalues = [eig for eig in eigenvalues if lambda_min <= eig <= lambda_max]

        if len(inside_bound_eigenvalues) > 0:
            inside_bound_eigenvectors_dict = {
                eigenvalues[i]: eigenvectors[:, i] 
                for i in range(len(eigenvalues))
                if eigenvalues[i] >= lambda_min and eigenvalues[i] <= lambda_max
            }
        else:
            inside_bound_eigenvectors_dict = np.array([])  # Set to empty array if no inside-bound eigenvalues

        # Calculate average of eigenvalues inside the bounds
        average_inside_eigenvalues = np.mean(inside_bound_eigenvalues) if len(inside_bound_eigenvalues) > 0 else 0


        # Reconstruct covariance matrix using the filtered eigenvalues and eigenvectors and replacing the insidebound eigenvalues with the average 

        if len(filtered_eigenvalues) > 0:
            filtered_eigenvectors = np.array([v for k, v in filtered_eigenvectors_dict.items()]).T
            reconstructed_eigenvalues_1 = np.where(
                (eigenvalues >= lambda_min) & (eigenvalues <= lambda_max), 
                average_inside_eigenvalues, 
                eigenvalues
            )
            reconstructed_cov_matrix_1 = np.dot(eigenvectors, np.dot(np.diag(reconstructed_eigenvalues_1), eigenvectors.T))
        else:
            reconstructed_cov_matrix_1 = None  # Set to None if no filtered eigenvalues

        
        # Reconstruct the covariance matrix with new equally spaced eigenvalues inside the bounds
       
        

        def compute_maximally_spaced_eigenvalues(S_noise, n, lambda_min, lambda_max):
            # Initialize the first term slightly greater than lambda_min
            a = lambda_min + 1e-6
            d = (2 * ((S_noise/n) - a)) /(n - 1)

            k = 10
            while a + (n - 1) * d > lambda_max:
                a = lambda_min + 1e-6/k  # Reduce the first term and then check 
                d = (2 * ((S_noise/n) - a)) /(n - 1)
                k+=10

            # Generate the new eigenvalues
            new_eigenvalues = [a + i * d for i in range(n)]
            return new_eigenvalues

        # Check if we have any eigenvalues inside the bounds
        if len(inside_bound_eigenvalues) > 0:

            # Compute the sum of eigenvalues inside the bounds
            S_noise = np.sum(inside_bound_eigenvalues)
            n = len(inside_bound_eigenvalues)


            # Calculate new eigenvalues within the bounds using the algorithm for maximal spacing
            new_inside_eigenvalues = compute_maximally_spaced_eigenvalues(S_noise, n, lambda_min, lambda_max)



            # Replace eigenvalues inside the bounds with the newly computed ones
            reconstructed_eigenvalues_2 = np.array([
                eig if eig < lambda_min or eig > lambda_max else new_inside_eigenvalues.pop(0)
                for eig in eigenvalues
            ])
        else:
            reconstructed_eigenvalues_2 = eigenvalues  # No inside-bound eigenvalues to change

        # Reconstruct the covariance matrix using the new eigenvalues
        reconstructed_cov_matrix_2 = np.dot(eigenvectors, np.dot(np.diag(reconstructed_eigenvalues_2), eigenvectors.T))

        my_dict = {'1':reconstructed_cov_matrix_1, '2':reconstructed_cov_matrix_2}
        
        return my_dict
        
    def calculate_tangency_portfolio(self,expected_returns, covariance_matrix):
        """
        Calculate the optimal tangency portfolio weights using Markowitz optimization.
        Maximizes the Sharpe ratio (excess return per unit of risk).
        
        Returns:
        --------
        dict
            Dictionary with ticker symbols as keys and optimal weights as values
        """
        
        # Convert inputs to numpy arrays for calculations
        returns = expected_returns
        cov_matrix = covariance_matrix
        
        # Define the negative Sharpe ratio (we'll minimize this to maximize Sharpe ratio)
        def negative_sharpe_ratio(weights):
            portfolio_return = np.sum(weights * returns)
            portfolio_std = np.sqrt(np.dot(weights.T, np.dot(cov_matrix, weights)))
            sharpe_ratio = (portfolio_return - self.rf_rate) / portfolio_std
            return -sharpe_ratio
        
        # Define constraints
        constraints = [
            {'type': 'eq', 'fun': lambda x: np.sum(x) - 1}  # weights sum to 1
        ]
        
        # Define bounds (no short selling: weights between 0 and 1)
        bounds = tuple((0, 1) for _ in range(len(self.tickers)))
        
        # Initial guess (equal weights)
        initial_weights = np.array([1/len(self.tickers)] * len(self.tickers))
        
        # Optimize!
        result = minimize(negative_sharpe_ratio, 
                        initial_weights,
                        method='SLSQP',
                        bounds=bounds,
                        constraints=constraints)
        
        if not result.success:
            raise ValueError("Optimization failed to converge!")
        
        # Convert optimal weights to dictionary
        optimal_weights = {ticker: weight for ticker, weight 
                         in zip(self.tickers, result.x)}
        
        # Calculate portfolio metrics
        self.tangency_return = np.sum(result.x * returns)
        self.tangency_risk = np.sqrt(np.dot(result.x.T, np.dot(cov_matrix, result.x)))
        self.tangency_sharpe = (self.tangency_return - self.rf_rate) / self.tangency_risk
        
        return optimal_weights

    def get_tangency_portfolio_metrics(self):
        """
        Returns the metrics for the tangency portfolio.
        Should be called after calculate_tangency_portfolio().
        
        Returns:
        --------
        dict
            Dictionary containing expected return, risk, and Sharpe ratio
        """
        return {
            'expected_return': self.tangency_return,
            'risk': self.tangency_risk,
            'sharpe_ratio': self.tangency_sharpe
        }
    
    def calculate_minimum_variance_portfolio(self,covariance_matrix):
        """
       Calculate the minimum variance portfolio weights.
       Only uses the covariance matrix since minimizing variance 
       doesn't require expected returns.

       Returns:
       --------
       dict
           Dictionary with ticker symbols as keys and optimal weights as values
        """


       # Convert covariance matrix to numpy array if not already
        cov_matrix = covariance_matrix

       # Define the portfolio variance function to minimize
        def portfolio_variance(weights):
            return np.dot(weights.T, np.dot(cov_matrix, weights))

       # Define constraints
        constraints = [
           {'type': 'eq', 'fun': lambda x: np.sum(x) - 1}  # weights sum to 1
       ]

       # Define bounds (no short selling: weights between 0 and 1)
        bounds = tuple((0, 1) for _ in range(len(self.tickers)))

       # Initial guess (equal weights)
        initial_weights = np.array([1/len(self.tickers)] * len(self.tickers))

       # Optimize!
        result = minimize(portfolio_variance,
                           initial_weights,
                           method='SLSQP',
                           bounds=bounds,
                           constraints=constraints)

        if not result.success:
            
            raise ValueError("Optimization failed to converge!")

       # Convert optimal weights to dictionary
        optimal_weights = {ticker: weight for ticker, weight 
                           in zip(self.tickers, result.x)}

       # Calculate portfolio metrics
        self.min_var_risk = np.sqrt(portfolio_variance(result.x))
        self.min_var_return = np.sum(result.x * np.array(self.current_expected_returns))
        self.min_var_sharpe = (self.min_var_return - self.rf_rate) / self.min_var_risk

        return optimal_weights

    def get_minimum_variance_metrics(self):
        """
       Returns the metrics for the minimum variance portfolio.
       Should be called after calculate_minimum_variance_portfolio().

       Returns:
       --------
       dict
           Dictionary containing expected return, risk, and Sharpe ratio
        """
        return {
           
            'expected_return': self.min_var_return,          
            'risk': self.min_var_risk,          
            'sharpe_ratio': self.min_var_sharpe
        }
    
    def calculate_optimal_allocation(self, portfolio_weights, portfolio_return, portfolio_std):
        
    
        """
        Calculate optimal allocation between risky portfolio and risk-free asset
        based on risk aversion and utility maximization.
       
        Parameters:
        -----------
        portfolio_weights : dict
           Dictionary of current weights for each stock in the risky portfolio
        portfolio_return : float
           Expected return of the risky portfolio
        portfolio_std : float
           Standard deviation (risk) of the risky portfolio
       
        Returns:
        --------
        dict
           Dictionary with all assets (stocks + risk-free) and their new weights
           after optimal allocation
        float
           Proportion invested in risky portfolio
        """
        # Calculate optimal allocation to risky portfolio using utility function
        # U = E(R) - (A/2)σ²
        # Optimal proportion in risky portfolio = (E(R) - rf)/(A * σ²)
       
        risky_proportion = (portfolio_return - self.rf_rate) / (self.risk_aversion * portfolio_std**2)
        
        # Cap the risky proportion between 0 and 1 (no leverage)
        risky_proportion = max(0, min(1, risky_proportion))
       
        # Calculate risk-free proportion
        rf_proportion = 1 - risky_proportion
       
        # Adjust the weights of stocks based on optimal allocation
        new_weights = {}
        for ticker, weight in portfolio_weights.items():
            new_weights[ticker] = weight * risky_proportion
       
        # Add risk-free asset to the weights dictionary
        new_weights['Risk_Free'] = rf_proportion
       
        # Calculate expected return and risk of the complete portfolio
        complete_portfolio_return = (risky_proportion * portfolio_return + 
                                   rf_proportion * self.rf_rate)
        complete_portfolio_risk = risky_proportion * portfolio_std
       
        # Store metrics as instance variables
        self.complete_portfolio_metrics = {
            
            'expected_return': complete_portfolio_return,
            'risk': complete_portfolio_risk,
            'risky_proportion': risky_proportion,
            'rf_proportion': rf_proportion,
            'utility': complete_portfolio_return - (self.risk_aversion/2) * complete_portfolio_risk**2
        }
       
        return new_weights, risky_proportion

    def get_complete_portfolio_metrics(self):
        """
        Returns the metrics for the complete portfolio including risk-free asset.
        Should be called after calculate_optimal_allocation().
       
        Returns:
        --------
        dict
            Dictionary containing portfolio metrics
        """
        return self.complete_portfolio_metrics
    
    def calculate_portfolio_quantities(self, final_weights):
        """
        Calculate the number of shares to be purchased for each asset based on
        final portfolio weights and available investment amount, allowing fractional shares.

        Parameters:
        -----------
        final_weights : dict
            Dictionary containing final weights for each asset (including Risk_Free)

        Returns:
        --------
        dict
            Dictionary containing for each asset - Investment amount and fractional
            number of shares to buy (for stocks)
        """        
        wealth = self.wealth
        portfolio_allocation = {}

        # Calculate investment amount for each asset
        for asset, weight in final_weights.items():
            investment_amount = weight * self.investment_amount

            if asset == 'Risk_Free':
                portfolio_allocation[asset] = {
                    '%_of_portfolio': investment_amount,
                    'investment_amount': investment_amount*wealth
                    
                }
            else:
                # Get current price for the stock
                current_price = self.current_prices[asset]
                # Calculate fractional number of shares that can be bought
                shares = investment_amount*wealth / current_price

                portfolio_allocation[asset] = {
                    '%_of_portfolio': investment_amount,
                    'investment_amount': investment_amount*wealth,
                    'quantity': shares,
                    'price_per_share': current_price
                }

        return portfolio_allocation                                             

    def calculate_buy_sell_decisions(self,initial_allocation, rebalanced_allocation):
        """
        Calculate the number of shares to be bought or sold for each asset
        to transition from the initial portfolio allocation to the rebalanced allocation.

        Parameters:
        -----------
        initial_allocation : dict
            Initial portfolio allocation with details for each asset.
        rebalanced_allocation : dict
            Rebalanced portfolio allocation with details for each asset.

        Returns:
        --------
        dict
            Dictionary with buy/sell decisions for each asset.
        """
        buy_sell_decisions = {}

        # Get the union of all assets in both initial and rebalanced allocations
        all_assets = set(initial_allocation.keys()) | set(rebalanced_allocation.keys())

        for asset in all_assets:
            initial_quantity = initial_allocation.get(asset, {}).get('quantity', 0)
            rebalanced_quantity = rebalanced_allocation.get(asset, {}).get('quantity', 0)

            # Calculate the quantity difference
            quantity_difference = rebalanced_quantity - initial_quantity

            # Determine action based on quantity difference
            if quantity_difference > 0:
                action = 'buy'
            elif quantity_difference < 0:
                action = 'sell'
            else:
                action = 'hold'

            # Store the buy/sell decision
            buy_sell_decisions[asset] = {
                'action': action,
                'quantity': abs(quantity_difference)
            }

        return buy_sell_decisions

