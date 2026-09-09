from django.contrib import admin
from .models import Customer


@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
        "email",
        "phone",
        "district",
        "loan_type",
        "loan_amount",
        "status",
        "is_assigned"
    )

    search_fields = ("name", "email", "phone")

    list_filter = (
        "district",
        "loan_type",
        "status",
        "is_assigned"
    )

    readonly_fields = ("request_created_at",)

    fieldsets = (
        ("Basic Info", {
            "fields": ("name", "email", "phone")
        }),

        ("Location", {
            "fields": ("address", "district", "latitude", "longitude")
        }),

        ("Loan Details", {
            "fields": ("loan_type", "loan_amount", "annual_income")
        }),

        ("Bank Details", {
            "fields": ("bank_name", "ifsc_code", "account_number")
        }),

        ("Identity", {
            "fields": ("pan_number", "aadhar_number")
        }),

        ("Status", {
            "fields": ("status", "is_assigned")
        }),

        ("Proof", {
            "fields": ("visit_photo",)
        }),
    )
