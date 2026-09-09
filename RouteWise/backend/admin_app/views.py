# core_app/views.py
import random
from datetime import timedelta

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.hashers import make_password
from django.utils import timezone

from .models import Admin, Finance, SalesPerson, JobQueue, PasswordResetOTP
from .permissions import role_required
from .utils import (
    calculate_distance,
    optimize_jobs_for_salesperson,
    check_thresholds,
    get_nearby_customers_for_salesperson,
)
from .serializers import (
    JobQueueSerializer,
    CustomTokenSerializer,
    SalespersonThresholdSerializer,
    BootstrapAdminSerializer,
    PasswordResetRequestSerializer,
    PasswordResetVerifySerializer,
    PasswordResetConfirmSerializer,
)
from .email_service import send_platform_email
from customer_app.models import Customer


ROLE_MODEL_MAP = {
    "ADMIN": Admin,
    "FINANCE": Finance,
    "SALESPERSON": SalesPerson,
}


def get_role_model(role):
    return ROLE_MODEL_MAP.get(role)


def get_role_user(role, email):
    model = get_role_model(role)
    if not model:
        return None
    return model.objects.filter(email=email).first()


def generate_otp():
    return f"{random.randint(100000, 999999)}"


# ================= JWT LOGIN =================
class CustomTokenView(TokenObtainPairView):
    serializer_class = CustomTokenSerializer


class BootstrapStatusView(APIView):
    permission_classes = []

    def get(self, request):
        return Response({"has_admin": Admin.objects.exists()}, status=200)


class BootstrapAdminView(APIView):
    permission_classes = []

    def post(self, request):
        if Admin.objects.exists():
            return Response({"error": "Chakra Finance admin is already configured."}, status=403)

        serializer = BootstrapAdminSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        admin = Admin.objects.create(
            role="ADMIN",
            name=serializer.validated_data["name"],
            company_name=serializer.validated_data["company_name"],
            email=serializer.validated_data["email"],
            password=make_password(serializer.validated_data["password"]),
        )

        return Response(
            {
                "message": "Chakra Finance admin account created successfully.",
                "admin_id": admin.id,
            },
            status=201,
        )


# ================= REGISTER =================
class RegisterView(APIView):
    permission_classes = []

    def post(self, request):
        role = request.data.get("role")

        try:
            if role == "ADMIN":
                if Admin.objects.exists():
                    return Response(
                        {"error": "The first Chakra Finance admin has already been created. Please contact an existing admin."},
                        status=403,
                    )
                if Admin.objects.filter(email=request.data.get("email")).exists():
                    return Response({"error": "Email already registered"}, status=400)
                Admin.objects.create(
                    name=request.data.get("name"),
                    company_name=request.data.get("company_name"),
                    email=request.data.get("email"),
                    password=make_password(request.data.get("password"))
                )

            elif role == "FINANCE":
                if Finance.objects.filter(email=request.data.get("email")).exists():
                    return Response({"error": "Email already registered"}, status=400)
                Finance.objects.create(
                    name=request.data.get("name"),
                    email=request.data.get("email"),
                    password=make_password(request.data.get("password"))
                )

            elif role == "SALESPERSON":
                if SalesPerson.objects.filter(email=request.data.get("email")).exists():
                    return Response({"error": "Email already registered"}, status=400)
                SalesPerson.objects.create(
                    name=request.data.get("name"),
                    email=request.data.get("email"),
                    phone=request.data.get("phone"),
                    district=request.data.get("district"),
                    address=request.data.get("address"),
                    age=request.data.get("age"),
                    aadhar_number=request.data.get("aadhar_number"),
                    password=make_password(request.data.get("password"))
                )

            else:
                return Response({"error": "Invalid role"}, status=400)

            return Response({"message": "Registered successfully"}, status=201)

        except Exception as e:
            return Response({"error": str(e)}, status=500)


# ================= LEGACY LOGIN =================
class LoginView(APIView):
    permission_classes = []

    def post(self, request):
        from django.contrib.auth.hashers import check_password as cp
        role = request.data.get("role")
        email = request.data.get("email")
        password = request.data.get("password")

        model_map = {"ADMIN": Admin, "FINANCE": Finance, "SALESPERSON": SalesPerson}
        model = model_map.get(role)

        if not model:
            return Response({"error": "Invalid role"}, status=400)

        user = model.objects.filter(email=email).first()
        if not user:
            return Response({"error": "User not found"}, status=404)
        if not cp(password, user.password):
            return Response({"error": "Invalid password"}, status=401)

        return Response({"message": "Login successful", "role": role, "user_id": user.id})


# ================= ASSIGN JOB (ADMIN) =================
class AssignJob(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    @role_required(["ADMIN"])
    def post(self, request):
        try:
            customer_id = request.data.get("customer_id")
            salesperson_id = request.data.get("salesperson_id")

            customer = Customer.objects.get(id=customer_id)
            salesperson = SalesPerson.objects.get(id=salesperson_id)

            if customer.is_assigned:
                return Response({"error": "Already assigned"}, status=400)

            active_jobs = JobQueue.objects.filter(
                salesperson=salesperson, status__in=["PENDING", "OPTIMIZED"]
            ).count()

            if active_jobs >= salesperson.max_job_threshold:
                return Response({"error": "Salesperson has reached maximum job limit"}, status=400)

            JobQueue.objects.create(
                salesperson=salesperson,
                customer=customer,
                customer_name=customer.name,
                customer_latitude=customer.latitude,
                customer_longitude=customer.longitude,
                customer_address=customer.address
            )

            customer.is_assigned = True
            customer.save()

            if salesperson.latitude and salesperson.longitude:
                distance = calculate_distance(
                    salesperson.latitude, salesperson.longitude,
                    customer.latitude, customer.longitude
                )
                travel_time = (distance / 30) * 60
                estimated_time = round(travel_time + salesperson.min_time_threshold)

                send_platform_email(
                    subject="Chakra Finance field visit scheduled",
                    message=f"Your Chakra Finance field verification is assigned. Expected arrival is about {estimated_time} minutes.",
                    recipient_list=[customer.email],
                )

            return Response({"msg": "Job assigned successfully"})

        except Customer.DoesNotExist:
            return Response({"error": "Customer not found"}, status=404)
        except SalesPerson.DoesNotExist:
            return Response({"error": "Salesperson not found"}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=500)


# ================= SALESPERSON JOBS =================
class SalespersonJobs(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    @role_required(["SALESPERSON"])
    def get(self, request, sp_id):
        try:
            sp = SalesPerson.objects.get(id=sp_id)
            _, alerts = check_thresholds(sp)
            jobs = optimize_jobs_for_salesperson(sp)

            serializer = JobQueueSerializer(jobs, many=True)
            return Response({"jobs": serializer.data, "alerts": alerts, "optimized_from_live_location": sp.latitude is not None and sp.longitude is not None})

        except SalesPerson.DoesNotExist:
            return Response({"error": "Salesperson not found"}, status=404)


# ================= COMPLETE JOB =================
class CompleteJob(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    @role_required(["SALESPERSON"])
    def post(self, request, job_id):
        try:
            job = JobQueue.objects.get(id=job_id)
            job.status = "COMPLETED"
            job.save()
            return Response({"msg": "Job completed successfully"})
        except JobQueue.DoesNotExist:
            return Response({"error": "Job not found"}, status=404)


# ================= UPDATE LOCATION =================
class UpdateSalespersonLocation(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    @role_required(["SALESPERSON"])
    def post(self, request):
        sp_id = request.data.get("salesperson_id")
        latitude = request.data.get("latitude")
        longitude = request.data.get("longitude")

        if not sp_id or latitude is None or longitude is None:
            return Response({"error": "Missing required fields"}, status=400)

        try:
            sp = SalesPerson.objects.get(id=sp_id)
            sp.latitude = latitude
            sp.longitude = longitude
            sp.save()
            return Response({"msg": "Location updated successfully"})
        except SalesPerson.DoesNotExist:
            return Response({"error": "Salesperson not found"}, status=404)


# ================= NEARBY CUSTOMERS =================
class NearbyCustomers(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    @role_required(["SALESPERSON"])
    def get(self, request, sp_id):
        data = get_nearby_customers_for_salesperson(sp_id)
        if not data:
            return Response({"message": "No nearby customers found"}, status=200)
        return Response(data)


# ================= DASHBOARD =================
class DashboardStats(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    @role_required(["ADMIN"])
    def get(self, request):
        total_customers = Customer.objects.count()
        assigned_customers = Customer.objects.filter(is_assigned=True).count()

        return Response({
            "total_customers": total_customers,
            "assigned_customers": assigned_customers,
            "pending_jobs": JobQueue.objects.filter(status="PENDING").count(),
            "completed_jobs": JobQueue.objects.filter(status="COMPLETED").count(),
            "total_salespersons": SalesPerson.objects.filter(is_active=True).count(),
            "active_salespersons": SalesPerson.objects.filter(is_active=True, latitude__isnull=False).count(),
            "unassigned_customers": total_customers - assigned_customers
        })


# ================= FINANCE DECISION =================
class FinanceDecision(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    @role_required(["FINANCE"])
    def post(self, request, customer_id):
        try:
            decision = request.data.get("decision")
            customer = Customer.objects.get(id=customer_id)

            if decision not in ["APPROVED", "REJECTED"]:
                return Response({"error": "Decision must be APPROVED or REJECTED"}, status=400)

            customer.status = decision
            customer.save()

            msg = (
                "Your Chakra Finance application has been approved. Our team will contact you with the next steps."
                if decision == "APPROVED"
                else "Your Chakra Finance application has been rejected. Please contact support if you need further clarification."
            )
            send_platform_email(
                subject="Chakra Finance application status",
                message=msg,
                recipient_list=[customer.email],
            )

            return Response({"msg": f"Customer {decision} successfully"})

        except Customer.DoesNotExist:
            return Response({"error": "Customer not found"}, status=404)


# ================= ALL SALESPERSONS =================
class AllSalespersons(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    @role_required(["ADMIN"])  # Now correctly reads from JWT token
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
            "is_active": sp.is_active,
            "active_jobs": JobQueue.objects.filter(
                salesperson=sp, status__in=["PENDING", "OPTIMIZED"]
            ).count()
        } for sp in salespersons]

        return Response(data, status=200)


class SalespersonThresholdSettings(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    @role_required(["ADMIN"])
    def get(self, request, salesperson_id):
        try:
            salesperson = SalesPerson.objects.get(id=salesperson_id, is_active=True)
            serializer = SalespersonThresholdSerializer(salesperson)
            return Response(serializer.data, status=200)
        except SalesPerson.DoesNotExist:
            return Response({"error": "Salesperson not found"}, status=404)

    @role_required(["ADMIN"])
    def put(self, request, salesperson_id):
        try:
            salesperson = SalesPerson.objects.get(id=salesperson_id, is_active=True)
            serializer = SalespersonThresholdSerializer(salesperson, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=200)
            return Response(serializer.errors, status=400)
        except SalesPerson.DoesNotExist:
            return Response({"error": "Salesperson not found"}, status=404)


class MySalespersonThresholdSettings(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    @role_required(["SALESPERSON"])
    def get(self, request):
        salesperson_id = request.auth.get("custom_id")

        try:
            salesperson = SalesPerson.objects.get(id=salesperson_id, is_active=True)
            serializer = SalespersonThresholdSerializer(salesperson)
            return Response(serializer.data, status=200)
        except SalesPerson.DoesNotExist:
            return Response({"error": "Salesperson not found"}, status=404)

    @role_required(["SALESPERSON"])
    def put(self, request):
        salesperson_id = request.auth.get("custom_id")

        try:
            salesperson = SalesPerson.objects.get(id=salesperson_id, is_active=True)
            serializer = SalespersonThresholdSerializer(salesperson, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=200)
            return Response(serializer.errors, status=400)
        except SalesPerson.DoesNotExist:
            return Response({"error": "Salesperson not found"}, status=404)


class PasswordResetRequestOTPView(APIView):
    permission_classes = []

    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        role = serializer.validated_data["role"]
        email = serializer.validated_data["email"]
        user = get_role_user(role, email)

        if not user:
            return Response({"error": "No user found for that role and email."}, status=404)

        PasswordResetOTP.objects.filter(email=email, role=role, is_used=False).update(is_used=True)
        otp = generate_otp()
        PasswordResetOTP.objects.create(
            email=email,
            role=role,
            code=otp,
            expires_at=timezone.now() + timedelta(minutes=10),
        )

        send_platform_email(
            subject="Chakra Finance password reset OTP",
            message=f"Your Chakra Finance password reset OTP is {otp}. It expires in 10 minutes.",
            recipient_list=[email],
        )

        return Response({"message": "OTP sent successfully."}, status=200)


class PasswordResetVerifyOTPView(APIView):
    permission_classes = []

    def post(self, request):
        serializer = PasswordResetVerifySerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        otp_record = PasswordResetOTP.objects.filter(
            email=serializer.validated_data["email"],
            role=serializer.validated_data["role"],
            code=serializer.validated_data["otp"],
            is_used=False,
        ).order_by("-created_at").first()

        if not otp_record or otp_record.is_expired():
            return Response({"error": "OTP is invalid or expired."}, status=400)

        return Response({"message": "OTP verified successfully."}, status=200)


class PasswordResetConfirmView(APIView):
    permission_classes = []

    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        email = serializer.validated_data["email"]
        role = serializer.validated_data["role"]
        otp = serializer.validated_data["otp"]
        password = serializer.validated_data["password"]

        otp_record = PasswordResetOTP.objects.filter(
            email=email,
            role=role,
            code=otp,
            is_used=False,
        ).order_by("-created_at").first()

        if not otp_record or otp_record.is_expired():
            return Response({"error": "OTP is invalid or expired."}, status=400)

        user = get_role_user(role, email)
        if not user:
            return Response({"error": "No user found for that role and email."}, status=404)

        user.password = make_password(password)
        user.save(update_fields=["password"])

        otp_record.is_used = True
        otp_record.save(update_fields=["is_used"])

        return Response({"message": "Password reset successfully."}, status=200)


# ================= LOGOUT =================
class LogoutView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        return Response({"message": "Successfully logged out"}, status=200)
