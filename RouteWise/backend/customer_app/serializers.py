from rest_framework import serializers
from .models import Customer


class CustomerRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = "__all__"


class UnassignedCustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ['id', 'name', 'address', 'district', 'latitude', 'longitude']


class FinanceQueueCustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ['id', 'name', 'address', 'district', 'status', 'visit_photo']


class CustomerDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = "__all__"
