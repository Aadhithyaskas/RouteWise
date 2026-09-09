from django.db import models
from django.utils import timezone

# ================= ROLES =================
ROLE_CHOICES = (
    ("ADMIN", "Admin"),
    ("FINANCE", "Finance"),
    ("SALESPERSON", "Salesperson"),
)

# ================= ADMIN =================
class Admin(models.Model):
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="ADMIN")
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    company_name = models.CharField(max_length=150)


# ================= FINANCE =================
class Finance(models.Model):
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="FINANCE")
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)


# ================= SALESPERSON =================
class SalesPerson(models.Model):
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="SALESPERSON")

    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15)

    district = models.CharField(max_length=100)
    address = models.TextField()
    age = models.PositiveIntegerField()
    aadhar_number = models.CharField(max_length=12, unique=True)
    password = models.CharField(max_length=255)

    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)

    min_job_threshold = models.PositiveIntegerField(default=1)
    max_job_threshold = models.PositiveIntegerField(default=10)
    min_time_threshold = models.PositiveIntegerField(default=30)
    max_time_threshold = models.PositiveIntegerField(default=120)

    is_active = models.BooleanField(default=True)


# ================= JOB QUEUE =================
class JobQueue(models.Model):
    STATUS_CHOICES = (
        ("PENDING", "Pending"),
        ("OPTIMIZED", "Optimized"),
        ("COMPLETED", "Completed"),
    )

    salesperson = models.ForeignKey(SalesPerson, on_delete=models.CASCADE)
    customer = models.ForeignKey("customer_app.Customer", on_delete=models.CASCADE, null=True, blank=True)

    customer_name = models.CharField(max_length=100)
    customer_latitude = models.FloatField()
    customer_longitude = models.FloatField()
    customer_address = models.TextField()

    assigned_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="PENDING")

    priority_order = models.PositiveIntegerField(null=True, blank=True)


class PasswordResetOTP(models.Model):
    PURPOSE_CHOICES = (
        ("PASSWORD_RESET", "Password Reset"),
    )

    email = models.EmailField()
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    code = models.CharField(max_length=6)
    purpose = models.CharField(max_length=30, choices=PURPOSE_CHOICES, default="PASSWORD_RESET")
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def is_expired(self):
        return timezone.now() >= self.expires_at
