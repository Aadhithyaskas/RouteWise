from django.urls import path
from .views import (
    RegisterView,
    LoginView,
    AssignJob,
    SalespersonJobs,
    CompleteJob,
    UpdateSalespersonLocation,
    NearbyCustomersForSalesperson,AllSalespersons,SetThresholds
)

urlpatterns = [
    path('auth/register/', RegisterView.as_view()),
    path('auth/login/', LoginView.as_view()),
    path('assign-job/', AssignJob.as_view()),
    path('salesperson/<int:sp_id>/jobs/', SalespersonJobs.as_view()),
    path('job/<int:job_id>/complete/', CompleteJob.as_view()),
    path('salesperson/update-location/', UpdateSalespersonLocation.as_view()),
     path('salespersons/', AllSalespersons.as_view()),
 path(
    "salesperson/<int:sp_id>/threshold/",
    SetThresholds.as_view()
),



    # NEW ROUTE
    path(
        'salesperson/<int:sp_id>/nearby-customers/',
        NearbyCustomersForSalesperson.as_view()
    ),
]
