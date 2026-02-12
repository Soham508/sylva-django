# Steps to run - 
- 1. Create and activate the virtual environment | python3 -m venv venv / source venv/bin/activate
- 2. Install the dependencies and mongoURL string in settings | pip install -r requirements.txt
- 3. make migrations | python manage.py makemigrations / python manage.py migrate (after running the previous command)
- 4. Run server | python manage.py runserver 7000
- 5. Start rabbitMQ container with docker
- 6. Start celery | celery -A sylva worker --loglevel=info

# Components - 
It basically has 3 main components. 
- 1. Authentication and user management, an APIView class defining APIs for creating, updating, fetching, and deleting user.
- 2. Risk Aversion coefficient calculation endpoint, using fuzzy logic concepts, we developed a function that takes different scores (respective to question) into account to calculate risk aversion coefficient (A)
- 3. Portfolio Optimization endpoint, using Random matrix theory and python libraries, we developed a class for optimizing the weights of portfolio based on user risk tolerence and risk of selected stock
- 4. Proccess data endpoint to delegate task of calculating risk aversion, portfolio and user update, to celery workers in MSA style with rabbitMQ


# Checks
In the Views, User APIView class have dispatch, which run before any requests comes to class's binding endpoint (basically act as middleware for it only) which makes endpoints private. It basically used as decorator over API methods, inside it I have droped authentication for some request methods for testing purpose here.  

In order to test it, hit a post request on http://127.0.0.1:3000/api/users/ with JSON body containing fields username and email (or other optional fields).

Try hitting same endpoint with different method, it asks for token to authenticate 

Main endpoint - http://localhost:7000/api/proccess/

It extracats data from body and delgates task of calculating risk aversion coefficient to a celery worker, after calculating score worker delegates the task of portflio generation to another worker, after it finished its calculation it in turn delegates task of DB update for user to another worker which updates the user profile in mongoDB

#change the username field to the one of created user
{
    "stocks": [
            "SUNPHARMA.NS",
            "DRREDDY.NS",
            "CIPLA.NS",
            "ABBOTINDIA.NS",
            "ZYDUSLIFE.NS",
            "JBCHEPHARM.NS"
        ],
    "wealth": 100000,
    "questions": [
                {
                    "value": "You have accumulated wealth and stable income but are still investing for future goals.",
                    "score": 7
                },
                {
                    "value": "''",
                    "score": -1
                },
                {
                    "value": "6 months to a year",
                    "score": 6
                },
                {
                    "value": "2 - 4 people other than myself",
                    "score": 5
                },
                {
                    "value": "Balance current income and long-term growth",
                    "score": 6
                },
                {
                    "value": "''",
                    "score": 3
                },
                {
                    "value": "Portfolio C: Rs. 80,000 - Rs. 1,20,000",
                    "score": 7
                },
                {
                    "value": "Comfortable",
                    "score": 7
                },
                {
                    "value": "Within 6 - 10 years",
                    "score": 7
                },
                {
                    "value": "You would sell your stocks at a profit and take an exit position.",
                    "score": 4
                } ],
    "username": {username}
}

Try following endpoints to see proccesses independently

// JSON body for http://127.0.0.1:7000/api/generate_portfolio/ endpoint
{
    "a": 5.2,
    "stocks": [
            "SUNPHARMA.NS",
            "DRREDDY.NS",
            "CIPLA.NS",
            "ABBOTINDIA.NS",
            "ZYDUSLIFE.NS",
            "JBCHEPHARM.NS"
        ],
    "wealth": 100000
}


// JSON body for http://127.0.0.1:7000/api/risk_aversion/ endpoint
{"questions": [
                {
                    "value": "You have accumulated wealth and stable income but are still investing for future goals.",
                    "score": 7
                },
                {
                    "value": "''",
                    "score": -1
                },
                {
                    "value": "6 months to a year",
                    "score": 6
                },
                {
                    "value": "2 - 4 people other than myself",
                    "score": 5
                },
                {
                    "value": "Balance current income and long-term growth",
                    "score": 6
                },
                {
                    "value": "''",
                    "score": 3
                },
                {
                    "value": "Portfolio C: Rs. 80,000 - Rs. 1,20,000",
                    "score": 7
                },
                {
                    "value": "Comfortable",
                    "score": 7
                },
                {
                    "value": "Within 6 - 10 years",
                    "score": 7
                },
                {
                    "value": "You would sell your stocks at a profit and take an exit position.",
                    "score": 4
                } ]
}