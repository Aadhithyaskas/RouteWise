from django.contrib import admin
from .models import Admin, Finance, SalesPerson, JobQueue


# ================= ADMIN =================
@admin.register(Admin)
class AdminAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "email", "company_name", "role")
    search_fields = ("name", "email", "company_name")


# ================= FINANCE =================
@admin.register(Finance)
class FinanceAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "email", "role")
    search_fields = ("name", "email")


# ================= SALESPERSON =================
@admin.register(SalesPerson)
class SalesPersonAdmin(admin.ModelAdmin):
    list_display = (
        "id", "name", "email", "phone",
        "district", "is_active",
        "min_job_threshold", "max_job_threshold"
    )

    search_fields = ("name", "email", "phone", "district")

    list_filter = ("district", "is_active")

    readonly_fields = ("latitude", "longitude")


# ================= JOB QUEUE =================
@admin.register(JobQueue)
class JobQueueAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "salesperson",
        "customer_name",
        "status",
        "priority_order",
        "assigned_at"
    )

    list_filter = ("status",)

    search_fields = ("customer_name",)

    ordering = ("priority_order", "assigned_at")
