# core_app/serializers.py
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import JobQueue, SalesPerson
from .backends import MultiRoleBackend


class CustomTokenSerializer(TokenObtainPairSerializer):
    # Add role field so the login endpoint accepts it
    role = serializers.ChoiceField(choices=["ADMIN", "FINANCE", "SALESPERSON"])

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Make username optional — we use email + role instead
        self.fields.pop("username", None)
        self.fields["email"] = serializers.EmailField()

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")
        role = attrs.get("role")

        backend = MultiRoleBackend()
        user = backend.authenticate(request=self.context.get("request"), email=email, password=password, role=role)

        if not user:
            raise serializers.ValidationError("Invalid credentials or role.")

        # Temporarily attach so get_token can read them
        self.user = user

        data = {}
        refresh = self.get_token(user)
        data["refresh"] = str(refresh)
        data["access"] = str(refresh.access_token)
        data["role"] = role
        data["user_id"] = user._custom_id

        return data

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Embed role and email into the JWT payload
        token["role"] = getattr(user, "_custom_role", "")
        token["email"] = getattr(user, "_custom_email", user.email)
        token["custom_id"] = getattr(user, "_custom_id", None)
        return token


class JobQueueSerializer(serializers.ModelSerializer):
    customer = serializers.CharField(source="customer_name")
    customer_id = serializers.IntegerField(source="customer.id", read_only=True)
    address = serializers.CharField(source="customer_address")
    lat = serializers.FloatField(source="customer_latitude")
    lng = serializers.FloatField(source="customer_longitude")
    priority_order = serializers.IntegerField(read_only=True)

    class Meta:
        model = JobQueue
        fields = ["id", "customer", "customer_id", "address", "lat", "lng", "status", "assigned_at", "priority_order"]


class SalespersonThresholdSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalesPerson
        fields = [
            "id",
            "name",
            "district",
            "min_job_threshold",
            "max_job_threshold",
            "min_time_threshold",
            "max_time_threshold",
            "is_active",
        ]

    def validate(self, attrs):
        min_job = attrs.get("min_job_threshold", getattr(self.instance, "min_job_threshold", None))
        max_job = attrs.get("max_job_threshold", getattr(self.instance, "max_job_threshold", None))
        min_time = attrs.get("min_time_threshold", getattr(self.instance, "min_time_threshold", None))
        max_time = attrs.get("max_time_threshold", getattr(self.instance, "max_time_threshold", None))

        if min_job is not None and max_job is not None and min_job > max_job:
            raise serializers.ValidationError("Minimum job threshold cannot be greater than maximum job threshold.")

        if min_time is not None and max_time is not None and min_time > max_time:
            raise serializers.ValidationError("Minimum time threshold cannot be greater than maximum time threshold.")

        return attrs


class BootstrapAdminSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100)
    company_name = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)

    def validate_password(self, value):
        validate_password(value)
        return value


class PasswordResetRequestSerializer(serializers.Serializer):
    role = serializers.ChoiceField(choices=["ADMIN", "FINANCE", "SALESPERSON"])
    email = serializers.EmailField()


class PasswordResetVerifySerializer(PasswordResetRequestSerializer):
    otp = serializers.CharField(max_length=6)


class PasswordResetConfirmSerializer(PasswordResetVerifySerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    def validate_password(self, value):
        validate_password(value)
        return value
