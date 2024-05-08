from rest_framework import routers
from apps.funds import views
from django.urls import re_path, include

# Create a router for handling API endpoints.
router = routers.SimpleRouter()

# Register the FundsViewset with the router, specifying the endpoint name as 'funds'.
router.register(r"funds", views.FundsViewset, basename="funds")

# Define the urlpatterns for the API endpoints.
urlpatterns = [
    # Include the router's URLs into the urlpatterns.
    re_path("", include(router.urls)),
]
