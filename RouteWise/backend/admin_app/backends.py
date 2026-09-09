# core_app/backends.py
from django.contrib.auth.backends import BaseBackend
from django.contrib.auth.models import User
from .models import Admin, Finance, SalesPerson
from django.contrib.auth.hashers import check_password


class MultiRoleBackend(BaseBackend):
    """
    Custom auth backend that authenticates against Admin, Finance, SalesPerson models
    and maps them to a real Django User so SimpleJWT can issue tokens.
    """

    MODEL_MAP = {
        "ADMIN": Admin,
        "FINANCE": Finance,
        "SALESPERSON": SalesPerson,
    }

    def authenticate(self, request, email=None, password=None, role=None):
        if not email or not password or not role:
            return None

        model = self.MODEL_MAP.get(role)
        if not model:
            return None

        try:
            custom_user = model.objects.get(email=email)
        except model.DoesNotExist:
            return None

        if not check_password(password, custom_user.password):
            return None

        # Get or create a linked Django User
        django_user, created = User.objects.get_or_create(
            username=f"{role.lower()}_{custom_user.id}",
            defaults={"email": email}
        )

        # Attach role/id so the serializer can embed them in the token
        django_user._custom_role = role
        django_user._custom_id = custom_user.id
        django_user._custom_email = email

        return django_user

    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None