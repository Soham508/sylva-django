from django.urls import path
from . import views
from .views import UserAPIView, protected_view, verify_token, test


urlpatterns = [
    path('health/', test, name="health"),
    path('proccess/', views.calculate_portfolio, name="calculate_portfolio"),
    path('protected/', protected_view, name='protected'),
    path('verify-token/', verify_token, name='verify-token'),
    path('risk_aversion/', views.generate_risk_score, name='generate_risk_score'),
    path('generate_portfolio/', views.generate_portfolio, name='generate_portfolio'),
    path('users/', UserAPIView.as_view(), name='user-create')
]