from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import make_password, check_password
from .models import Admin, SalesPerson, JobQueue
from customer_app.models import Customer
from .utils import should_optimize, optimize_jobs_for_salesperson,check_thresholds
from .serializers import JobQueueSerializer


# ================= REGISTER =================
class RegisterView(APIView):
    def post(self, request):
        role = request.data.get("role")

        try:
            if role == "ADMIN":
                Admin.objects.create(
                    name=request.data.get("name"),
                    company_name=request.data.get("company_name"),
                    email=request.data.get("email"),
                    password=make_password(request.data.get("password"))
                )

            elif role == "SALESPERSON":
                SalesPerson.objects.create(
                    name=request.data.get("name"),
                    email=request.data.get("email"),
                    phone=request.data.get("phone"),
                    # company_name=request.data.get("company_name"),
                    district=request.data.get("district"),
                    address=request.data.get("address"),
                    age=request.data.get("age"),
                    aadhar_number=request.data.get("aadhar_number"),
                    min_job_threshold=request.data.get("min_job_threshold", 1),
                    max_job_threshold=request.data.get("max_job_threshold", 10),
                    min_time_threshold=request.data.get("min_time_threshold", 30),
                    max_time_threshold=request.data.get("max_time_threshold", 120),
                    password=make_password(request.data.get("password"))
                )

            else:
                return Response({"error": "Invalid role"}, status=400)

            return Response({"message": "Registered successfully"}, status=201)

        except Exception as e:
            return Response({"error": str(e)}, status=500)


# ================= LOGIN =================
class LoginView(APIView):
    def post(self, request):
        role = request.data.get("role")
        email = request.data.get("email")
        password = request.data.get("password")

        if role == "ADMIN":
            user = Admin.objects.filter(email=email).first()
        elif role == "SALESPERSON":
            user = SalesPerson.objects.filter(email=email).first()
        else:
            return Response({"error": "Invalid role"}, status=400)

        if not user:
            return Response({"error": "User not found"}, status=404)

        if not check_password(password, user.password):
            return Response({"error": "Invalid password"}, status=401)

        return Response({
            "message": "Login successful",
            "role": role,
            "user_id": user.id
        })


# ================= ASSIGN JOB =================
class AssignJob(APIView):
    def post(self, request):
        try:
            customer_id = request.data.get("customer_id")
            salesperson_id = request.data.get("salesperson_id")

            if not customer_id or not salesperson_id:
                return Response({"error": "Missing IDs"}, status=400)

            customer = Customer.objects.get(id=customer_id)
            salesperson = SalesPerson.objects.get(id=salesperson_id)

            # ❌ Prevent assigning already assigned customer
            if customer.is_assigned:
                return Response(
                    {"error": "Customer already assigned"},
                    status=400
                )

            # 🔢 Count current active jobs (PENDING + OPTIMIZED)
            active_jobs_count = JobQueue.objects.filter(
                salesperson=salesperson,
                status__in=["PENDING", "OPTIMIZED"]
            ).count()

            # 🚫 Check MAX JOB THRESHOLD
            if active_jobs_count >= salesperson.max_job_threshold:
                return Response(
                    {"error": "Maximum job limit reached for this salesperson"},
                    status=400
                )

            # ⚠ Optional: Check MIN JOB THRESHOLD (Informational)
            if active_jobs_count < salesperson.min_job_threshold:
                print("Below minimum job threshold")

            # ✅ Create Job
            JobQueue.objects.create(
                salesperson=salesperson,
                customer_name=customer.name,
                customer_latitude=customer.latitude,
                customer_longitude=customer.longitude,
                customer_address=customer.address,
                status="PENDING"
            )

            # Mark customer as assigned
            customer.is_assigned = True
            customer.save()

            # 🔄 Auto optimization check
            if should_optimize(salesperson):
                optimize_jobs_for_salesperson(salesperson)

            return Response({"msg": "Job Assigned Successfully"})

        except Customer.DoesNotExist:
            return Response({"error": "Customer not found"}, status=404)

        except SalesPerson.DoesNotExist:
            return Response({"error": "Salesperson not found"}, status=404)

        except Exception as e:
            return Response({"error": str(e)}, status=500)



# ================= SALESPERSON JOB LIST =================
# ================= SALESPERSON JOB LIST =================
class SalespersonJobs(APIView):
    def get(self, request, sp_id):
        try:
            salesperson = SalesPerson.objects.get(id=sp_id)

            # 🔍 Check threshold logic (time + count)
            optimize_needed, alerts = check_thresholds(salesperson)

            if optimize_needed:
                jobs = optimize_jobs_for_salesperson(salesperson)
            else:
                jobs = JobQueue.objects.filter(
                    salesperson=salesperson,
                    status__in=["PENDING", "OPTIMIZED"]
                )

            return Response({
                "jobs": JobQueueSerializer(jobs, many=True).data,
                "alerts": alerts
            })

        except SalesPerson.DoesNotExist:
            return Response(
                {"error": "Salesperson not found"},
                status=404
            )

# ================= COMPLETE JOB =================
class CompleteJob(APIView):
    def post(self, request, job_id):
        try:
            job = JobQueue.objects.get(id=job_id)
            job.status = "COMPLETED"
            job.save()
            return Response({"msg": "Job Completed Successfully"})
        except JobQueue.DoesNotExist:
            return Response({"error": "Job not found"}, status=404)

class SetThresholds(APIView):
    def post(self, request, sp_id):
        try:
            salesperson = SalesPerson.objects.get(id=sp_id)

            salesperson.min_time_threshold = request.data.get("min_time")
            salesperson.max_time_threshold = request.data.get("max_time")
            salesperson.min_job_threshold = request.data.get("min_job")
            salesperson.max_job_threshold = request.data.get("max_job")

            salesperson.save()

            return Response({"msg": "Threshold Successfully set"}, status=200)

        except SalesPerson.DoesNotExist:
            return Response({"error": "Salesperson not found"}, status=404)



class UpdateSalespersonLocation(APIView):
    def post(self, request):
        sp_id = request.data.get("salesperson_id")
        lat = request.data.get("latitude")
        lng = request.data.get("longitude")

        if not sp_id or not lat or not lng:
            return Response({"error": "Missing data"}, status=400)

        try:
            sp = SalesPerson.objects.get(id=sp_id)
            sp.latitude = lat
            sp.longitude = lng
            sp.save()

            return Response({"message": "Salesperson location updated"})
        except SalesPerson.DoesNotExist:
            return Response({"error": "Salesperson not found"}, status=404)

from .utils import (
    should_optimize,
    optimize_jobs_for_salesperson,
    get_nearby_customers_for_salesperson
)


# ================= NEARBY CUSTOMERS API =================
class NearbyCustomersForSalesperson(APIView):
    def get(self, request, sp_id):
        data = get_nearby_customers_for_salesperson(sp_id)

        if not data:
            return Response(
                {"message": "No nearby customers found or salesperson not found"},
                status=200
            )

        return Response(data, status=200)
# ================= ALL SALESPERSON LIST =================
class AllSalespersons(APIView):
    def get(self, request):
        salespersons = SalesPerson.objects.filter(is_active=True)

        data = [{
            "id": sp.id,
            "name": sp.name,
            "email": sp.email,
            "phone": sp.phone,
            "district": sp.district,
            "address": sp.address,
            "latitude": sp.latitude,
            "longitude": sp.longitude,
            "min_job_threshold": sp.min_job_threshold,
            "max_job_threshold": sp.max_job_threshold,
            "min_time_threshold": sp.min_time_threshold,
            "max_time_threshold": sp.max_time_threshold,
            "is_active": sp.is_active
        } for sp in salespersons]

        return Response(data, status=200)

