# Project -

This project covers variety of concepts from different modules suggested to demonstrate. Since its main service endpoint's body data heavily dependent on frontend(due to data structure complexity), I have included some dummy body data for testing APIs.

# Background -
sylva was name of our course project in last semester in financial economics course. It was about developing a portfolio advisory site.


# Components - 
It basically has 3 main components. 
- 1. Authentication and user management, an APIView class defining APIs for creating, updating, fetching, and deleting user.
- 2. Risk Aversion coefficient calculation endpoint, using fuzzy logic concepts, we developed a function that takes different scores (respective to question) into account to calculate risk aversion coefficient (A)
- 3. Portfolio Optimization endpoint, using Random matrix theory and python libraries, we developed a class for optimizing the weights of portfolio based on user risk tolerence and risk of selected stock
- 4. Proccess data endpoint to delegate task of calculating risk aversion, portfolio and user update, to celery workers in MSA style with rabbitMQ

# Steps to run - 
- 1. Create and activate the virtual environment | python3 -m venv venv / source venv/bin/activate
- 2. Install the dependencies and mongoURL string in settings | pip install -r requirements.txt
- 3. make migrations | python manage.py makemigrations / python manage.py migrate (after running the previous command)
- 4. Run server | python manage.py runserver 7000
- 5. Start rabbitMQ container with docker
- 6. Start celery | celery -A sylva worker --loglevel=info

# Detail 

Here User model is created that stores data about user, and its portfolio as JSON field. For authentication firebase is used with google auth on frontend. 

[Module-6] If we want to add a column, we can define model in the same way User is defined here, its neccessary to run - python manage.py makemigrations to migrate new schema. This changes can be done live, but it's good to restart the server to keep things syncronous with each other.

[Module-7] I also have implmeneted caching with get endpoint for user, in setting.py I have set redis as default caching mechanism, but if redis connection is not available it uses django's in memory as caching database.

[Module-10] Users can login with google firebase, request for a service and get it. Implmented MSA architecture for it using rabbitMQ and celery workers

[Module-11] Implmented some best practices 
- Verion control using git
- Caching
- Logging
- added README 
- Error handling

# In order to convert it into microservice architecture, we can simply use celery workers with redis or rabbitMQ, by creating tasks which handles execution for calculating A and portfolio generation. By creating an endpoint, where runtime delegates work to celery workers. However, due to unavailibility of free cloud instances, I did not choosen to go with that flow, as I had to deploy it.

# Microservices achitecture for this project -
- Make it really fast for user experiance as user dont have to wait for time expensive operations, celery worker can consume tasks from message queues. As significiantly response time from almost 20-25s to 2-3s, as tasks are delegated to celery workers. Can be tested by sending
requests to each services seprately like for calculating risk_aversion coefficient, portfiolio generation and database call
- Message queues, queue and stage the incoming tasks/user services to be consumed by celery workers at any time accurately
- Can be easy to scale with incoming load using dockerised environment with container orchastration tools like kubernates.

I could not quantify the benefits on hardware side, as it needs to have benchmarks to be tested against. currently in production mode, no cloud platforms provides free instance without credit card. I have mentioned the user experiance benefits


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