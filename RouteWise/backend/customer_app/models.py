from django.db import models
class Customer(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15)

    address = models.TextField()
    district = models.CharField(max_length=100)

    latitude = models.FloatField()
    longitude = models.FloatField()

    request_created_at = models.DateTimeField(auto_now_add=True)
    is_assigned = models.BooleanField(default=False)

    # -------------------------
    # ✅ APPENDED LOAN FIELDS
    # -------------------------

    LOAN_TYPES = (
        ("PERSONAL", "Personal Loan"),
        ("HOME", "Home Loan"),
        ("VEHICLE", "Vehicle Loan"),
        ("BUSINESS", "Business Loan"),
    )

    loan_type = models.CharField(max_length=20, choices=LOAN_TYPES, null=True, blank=True)
    loan_amount = models.FloatField(null=True, blank=True)
    annual_income = models.FloatField(null=True, blank=True)

    bank_name = models.CharField(max_length=150, null=True, blank=True)
    ifsc_code = models.CharField(max_length=20, null=True, blank=True)
    account_number = models.CharField(max_length=30, null=True, blank=True)

    pan_number = models.CharField(max_length=10, null=True, blank=True)
    aadhar_number = models.CharField(max_length=12, null=True, blank=True)

    def __str__(self):
        return self.name

