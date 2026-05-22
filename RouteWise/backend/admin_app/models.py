from django.db import models

class Admin(models.Model):
    role = models.CharField(max_length=20, default="ADMIN")
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    company_name = models.CharField(max_length=150)

class SalesPerson(models.Model):
    role = models.CharField(max_length=20, default="SALESPERSON")
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15)

    district = models.CharField(max_length=100)
    address = models.TextField()
    age = models.PositiveIntegerField()
    aadhar_number = models.CharField(max_length=12, unique=True)
    password = models.CharField(max_length=255)

    # ✅ ADD THESE
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)

    min_job_threshold = models.PositiveIntegerField(default=1)
    max_job_threshold = models.PositiveIntegerField(default=10)
    min_time_threshold = models.PositiveIntegerField(default=30)
    max_time_threshold = models.PositiveIntegerField(default=120)

    is_active = models.BooleanField(default=True)



class JobQueue(models.Model):
    STATUS_CHOICES = (
        ("PENDING", "Pending"),
        ("OPTIMIZED", "Optimized"),
        ("COMPLETED", "Completed"),
    )

    salesperson = models.ForeignKey(SalesPerson, on_delete=models.CASCADE)
    customer_name = models.CharField(max_length=100)
    customer_latitude = models.FloatField()
    customer_longitude = models.FloatField()
    customer_address = models.TextField()
    assigned_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="PENDING")
