# core_app/permissions.py
from rest_framework.response import Response
from rest_framework import status
from functools import wraps


def get_role_from_token(request):
    """Extract the role embedded in the JWT token payload."""
    auth = request.auth  # This is the validated JWT token object (AccessToken)
    if auth is None:
        return None
    return auth.get("role", None)


def role_required(allowed_roles):
    def decorator(func):
        @wraps(func)
        def wrapper(self, request, *args, **kwargs):
            role = get_role_from_token(request)

            if not role:
                return Response(
                    {"error": "Role not found in token. Please login again."},
                    status=status.HTTP_401_UNAUTHORIZED
                )

            if role not in allowed_roles:
                return Response(
                    {"error": f"Access denied. Required: {allowed_roles}, your role: {role}"},
                    status=status.HTTP_403_FORBIDDEN
                )

            # Attach role to request for convenience in views
            request.user_role = role
            return func(self, request, *args, **kwargs)

        return wrapper
    return decorator