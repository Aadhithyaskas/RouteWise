from rest_framework import status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView

from admin_app.email_service import send_platform_email
from admin_app.models import JobQueue
from admin_app.permissions import role_required
from .models import Customer
from .serializers import (
    CustomerDetailSerializer,
    CustomerRequestSerializer,
    FinanceQueueCustomerSerializer,
    UnassignedCustomerSerializer,
)


class CustomerRequest(APIView):
    permission_classes = []

    def post(self, request):
        serializer = CustomerRequestSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(is_assigned=False)
            return Response({"msg": "Application submitted"}, status=201)

        return Response(serializer.errors, status=400)


class UnassignedCustomers(APIView):
    @role_required(["ADMIN", "FINANCE"])
    def get(self, request):
        customers = Customer.objects.filter(is_assigned=False)
        serializer = UnassignedCustomerSerializer(customers, many=True)
        return Response(serializer.data)


class FinanceReviewQueue(APIView):
    @role_required(["FINANCE"])
    def get(self, request):
        customer_ids = JobQueue.objects.filter(
            status="COMPLETED",
            customer__isnull=False,
            customer__status="PENDING",
        ).values_list("customer_id", flat=True).distinct()

        customers = Customer.objects.filter(id__in=customer_ids).order_by("-request_created_at")
        serializer = FinanceQueueCustomerSerializer(customers, many=True)
        return Response(serializer.data)


class CustomerDetail(APIView):
    @role_required(["FINANCE"])
    def get(self, request, customer_id):
        try:
            customer = Customer.objects.get(id=customer_id)
            serializer = CustomerDetailSerializer(customer)
            return Response(serializer.data)
        except Customer.DoesNotExist:
            return Response({"error": "Customer not found"}, status=404)


class UploadCustomerPhoto(APIView):
    parser_classes = [MultiPartParser, FormParser]

    @role_required(["SALESPERSON"])
    def post(self, request, customer_id):
        try:
            customer = Customer.objects.get(id=customer_id)
            photo = request.FILES.get("photo")

            if not photo:
                return Response({"error": "No photo uploaded"}, status=400)

            customer.visit_photo = photo
            customer.save(update_fields=["visit_photo"])

            return Response({"msg": "Photo uploaded successfully"})
        except Customer.DoesNotExist:
            return Response({"error": "Customer not found"}, status=404)


class FinanceDecision(APIView):
    @role_required(["FINANCE"])
    def post(self, request, customer_id):
        try:
            decision = request.data.get("decision")
            customer = Customer.objects.get(id=customer_id)

            if decision == "APPROVED":
                customer.status = "APPROVED"
                message = "Your Chakra Finance application has been approved. Our team will contact you with the next steps."
            elif decision == "REJECTED":
                customer.status = "REJECTED"
                message = "Your Chakra Finance application has been rejected. Please contact support if you need further clarification."
            else:
                return Response({"error": "Decision must be APPROVED or REJECTED"}, status=400)

            customer.save(update_fields=["status"])
            send_platform_email(
                subject="Chakra Finance application status",
                message=message,
                recipient_list=[customer.email],
            )

            return Response({"msg": "Decision updated", "status": customer.status})
        except Customer.DoesNotExist:
            return Response({"error": "Customer not found"}, status=404)
