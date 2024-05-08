from django.urls import re_path
from rest_framework_simplejwt.views import TokenRefreshView
from apps.accounts import views

urlpatterns = [
    re_path(r"^api/token/refresh/$", TokenRefreshView.as_view(), name="token_refresh"),
    re_path(r"^signup/$", views.SignUp.as_view(), name="signup"),
    re_path(r"^login/$", views.Login.as_view(), name="login"),
    re_path(
        r"^verify_email/$", views.VerifyEmailAPIView.as_view(), name="verify_email"
    ),
]
