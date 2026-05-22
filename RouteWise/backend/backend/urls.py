from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from admin_app.views import CustomTokenView

urlpatterns = [
    # JWT auth
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/login/', CustomTokenView.as_view(), name='jwt_login'),

    # Django admin
    path('admin/', admin.site.urls),

    # App APIs
    path('admin-api/', include('admin_app.urls')),
    path('customer-api/', include('customer_app.urls')),

    # Media files (always serve, not just DEBUG)
    *static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT),

    # React — catches ALL other routes, must be last
    re_path(r'^.*$', TemplateView.as_view(template_name='index.html')),
]