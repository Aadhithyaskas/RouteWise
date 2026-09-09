from django.urls import path
from .views import (
    CustomerRequest,
    UnassignedCustomers,
    FinanceReviewQueue,
    CustomerDetail,
    UploadCustomerPhoto,
    FinanceDecision
)

urlpatterns = [
    path("request/", CustomerRequest.as_view()),

    path("unassigned/", UnassignedCustomers.as_view()),

    path("finance-queue/", FinanceReviewQueue.as_view()),

    path("detail/<int:customer_id>/", CustomerDetail.as_view()),

    path("upload-photo/<int:customer_id>/", UploadCustomerPhoto.as_view()),

    path("finance/<int:customer_id>/decision/", FinanceDecision.as_view()),
]
