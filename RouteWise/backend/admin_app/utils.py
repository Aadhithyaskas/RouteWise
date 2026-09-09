# core_app/utils.py
import math
from .models import JobQueue, SalesPerson
from customer_app.models import Customer
from django.utils import timezone


# ================= DISTANCE (HAVERSINE) =================
def calculate_distance(lat1, lon1, lat2, lon2):
    """Returns distance in KM between two lat/long points."""
    R = 6371
    lat1, lon1, lat2, lon2 = map(math.radians, [float(lat1), float(lon1), float(lat2), float(lon2)])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = math.sin(dlat / 2) ** 2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2) ** 2
    return round(R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a)), 2)


# ================= ACTIVE JOBS =================
def get_active_jobs_for_salesperson(salesperson):
    return list(
        JobQueue.objects.filter(salesperson=salesperson, status__in=["PENDING", "OPTIMIZED"]).order_by("assigned_at", "id")
    )


# ================= OPTIMIZE JOBS (NEAREST NEIGHBOR) =================
def optimize_jobs_for_salesperson(salesperson):
    jobs = get_active_jobs_for_salesperson(salesperson)

    if not jobs:
        return []

    if len(jobs) == 1:
        jobs[0].status = "OPTIMIZED"
        jobs[0].priority_order = 0
        jobs[0].save(update_fields=["status", "priority_order"])
        return jobs

    if salesperson.latitude is not None and salesperson.longitude is not None:
        current_lat = salesperson.latitude
        current_lng = salesperson.longitude
        first_job = min(
            jobs,
            key=lambda j: calculate_distance(current_lat, current_lng, j.customer_latitude, j.customer_longitude)
        )
        jobs.remove(first_job)
        optimized = [first_job]
    else:
        optimized = [jobs.pop(0)]

    while jobs:
        last = optimized[-1]
        next_job = min(
            jobs,
            key=lambda j: calculate_distance(
                last.customer_latitude, last.customer_longitude,
                j.customer_latitude, j.customer_longitude
            )
        )
        optimized.append(next_job)
        jobs.remove(next_job)

    for index, job in enumerate(optimized):
        job.status = "OPTIMIZED"
        job.priority_order = index
        job.save(update_fields=["status", "priority_order"])

    return optimized


# ================= SORT UNASSIGNED CUSTOMERS BY SALESPERSON LOCATION =================
def get_nearby_customers_for_salesperson(sp_id):
    try:
        salesperson = SalesPerson.objects.get(id=sp_id)

        if not salesperson.latitude or not salesperson.longitude:
            return []

        customers = Customer.objects.filter(is_assigned=False)
        customer_list = []

        for c in customers:
            if c.latitude and c.longitude:
                distance = calculate_distance(
                    salesperson.latitude, salesperson.longitude,
                    c.latitude, c.longitude
                )
                customer_list.append({
                    "customer_id": c.id,
                    "name": c.name,
                    "address": c.address,
                    "latitude": c.latitude,
                    "longitude": c.longitude,
                    "distance_km": distance
                })

        return sorted(customer_list, key=lambda x: x["distance_km"])

    except SalesPerson.DoesNotExist:
        return []


# ================= CHECK THRESHOLDS =================
def check_thresholds(salesperson):
    now = timezone.now()
    pending_jobs = JobQueue.objects.filter(salesperson=salesperson, status__in=["PENDING", "OPTIMIZED"])
    job_count = pending_jobs.count()

    count_trigger = job_count >= salesperson.max_job_threshold
    time_trigger = False
    alerts = []

    for job in pending_jobs:
        waiting_minutes = (now - job.assigned_at).total_seconds() / 60

        if waiting_minutes >= salesperson.min_time_threshold:
            alerts.append(f"Job {job.id} reached minimum waiting time.")

        if waiting_minutes >= salesperson.max_time_threshold:
            time_trigger = True
            alerts.append(f"Job {job.id} exceeded maximum waiting time!")

    return count_trigger or time_trigger, alerts
