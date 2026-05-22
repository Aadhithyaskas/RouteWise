from django.urls import path
from .views import  CustomerRequest,UnassignedCustomers

urlpatterns = [
    path("request/", CustomerRequest.as_view(), name="customer-request"),
    path('unassigned/', UnassignedCustomers.as_view())
]
