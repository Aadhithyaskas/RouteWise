from rest_framework import serializers
from .models import Customer

class UnassignedCustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ['id', 'name', 'address', 'district', 'latitude', 'longitude']
