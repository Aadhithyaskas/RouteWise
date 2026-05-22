from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Customer
from .serializers import UnassignedCustomerSerializer
from rest_framework.views import APIView
class CustomerRequest(APIView):
    def post(self, request):
        data = request.data

        customer = Customer.objects.create(
            name=data.get("name"),
            email=data.get("email"),
            phone=data.get("phone"),
            address=data.get("address"),
            district=data.get("district"),
            latitude=data.get("latitude"),
            longitude=data.get("longitude"),
            is_assigned=False
        )

        return Response(
            {"message": "Application submitted successfully"},
            status=status.HTTP_201_CREATED
        )


class UnassignedCustomers(APIView):
    def get(self, request):
        customers = Customer.objects.filter(is_assigned=False)
        serializer = UnassignedCustomerSerializer(customers, many=True)
        return Response(serializer.data)

