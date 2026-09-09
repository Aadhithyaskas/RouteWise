from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView, TokenVerifyView
from .views import (
    BootstrapStatusView,
    BootstrapAdminView,
    RegisterView,
    LoginView,
    PasswordResetRequestOTPView,
    PasswordResetVerifyOTPView,
    PasswordResetConfirmView,
    AssignJob,
    SalespersonJobs,
    CompleteJob,
    UpdateSalespersonLocation,
    NearbyCustomers,
    DashboardStats,
    FinanceDecision,
    AllSalespersons,
    SalespersonThresholdSettings,
    MySalespersonThresholdSettings,
    CustomTokenView,
    LogoutView
)

urlpatterns = [
    # ================= AUTH =================
    path('auth/bootstrap-status/', BootstrapStatusView.as_view(), name="bootstrap-status"),
    path('auth/bootstrap-admin/', BootstrapAdminView.as_view(), name="bootstrap-admin"),
    path('auth/register/', RegisterView.as_view(), name="register"),    
    path('auth/login/', LoginView.as_view(), name="login"),
    path('auth/password-reset/request-otp/', PasswordResetRequestOTPView.as_view(), name="password-reset-request-otp"),
    path('auth/password-reset/verify-otp/', PasswordResetVerifyOTPView.as_view(), name="password-reset-verify-otp"),
    path('auth/password-reset/confirm/', PasswordResetConfirmView.as_view(), name="password-reset-confirm"),
    
    # JWT Endpoints
    path('auth/jwt/login/', CustomTokenView.as_view(), name="jwt_login"),
    path('auth/jwt/refresh/', TokenRefreshView.as_view(), name="token_refresh"),
    path('auth/jwt/verify/', TokenVerifyView.as_view(), name="token_verify"),
    path('auth/logout/', LogoutView.as_view(), name="logout"),

    # ================= ADMIN =================
    path('assign-job/', AssignJob.as_view(), name="assign-job"),
    path('dashboard/', DashboardStats.as_view(), name="dashboard"),
    path('salespersons/', AllSalespersons.as_view(), name="all-salespersons"),
    path('salespersons/<int:salesperson_id>/thresholds/', SalespersonThresholdSettings.as_view(), name="salesperson-thresholds"),

    # ================= SALESPERSON =================
    path('salesperson/<int:sp_id>/jobs/', SalespersonJobs.as_view(), name="sp-jobs"),
    path('job/<int:job_id>/complete/', CompleteJob.as_view(), name="complete-job"),
    path('salesperson/update-location/', UpdateSalespersonLocation.as_view(), name="update-location"),
    path('salesperson/<int:sp_id>/nearby-customers/', NearbyCustomers.as_view(), name="nearby-customers"),
    path('salesperson/me/thresholds/', MySalespersonThresholdSettings.as_view(), name="my-salesperson-thresholds"),

    # ================= FINANCE =================
    path('finance/<int:customer_id>/decision/', FinanceDecision.as_view(), name="finance-decision"),
]
