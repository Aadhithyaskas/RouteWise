from django.contrib import admin
from .models import Admin, SalesPerson, JobQueue

@admin.register(Admin)
class AdminAdmin(admin.ModelAdmin):
    list_display = ("name", "company_name", "email")
    search_fields = ("name", "company_name", "email")


@admin.register(SalesPerson)
class SalesPersonAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "phone", "district", "max_job_threshold")
    search_fields = ("name", "email", "district")
    list_filter = ("district",)


@admin.register(JobQueue)
class JobQueueAdmin(admin.ModelAdmin):
    list_display = ("customer_name", "salesperson", "status", "assigned_at")
    list_filter = ("status",)
