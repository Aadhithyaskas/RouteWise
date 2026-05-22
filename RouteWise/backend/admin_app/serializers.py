from rest_framework import serializers
from .models import JobQueue


class JobQueueSerializer(serializers.ModelSerializer):

    # Rename fields to match frontend expectation
    customer = serializers.CharField(source="customer_name")
    address = serializers.CharField(source="customer_address")
    lat = serializers.FloatField(source="customer_latitude")
    lng = serializers.FloatField(source="customer_longitude")

    class Meta:
        model = JobQueue
        fields = [
            "id",
            "customer",
            "address",
            "lat",
            "lng",
            "status",
            "assigned_at",
        ]
