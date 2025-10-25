from django.urls import path
from .views import LoginView, RegisterView
from rest_framework.authtoken.views import obtain_auth_token

urlpatterns = [
    path("login/", LoginView.as_view(), name="login"),
    path('register/', RegisterView.as_view(), name='register'),
]
