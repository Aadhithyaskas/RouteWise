import math
from .models import JobQueue, SalesPerson
from customer_app.models import Customer


# ================= DISTANCE (HAVERSINE - REAL WORLD) =================
def calculate_distance(lat1, lon1, lat2, lon2):
    """
    Returns distance in KM between two lat/long points
    """
    R = 6371  # Earth radius in KM

    lat1 = math.radians(float(lat1))
    lon1 = math.radians(float(lon1))
    lat2 = math.radians(float(lat2))
    lon2 = math.radians(float(lon2))

    dlat = lat2 - lat1
    dlon = lon2 - lon1

    a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))

    return round(R * c, 2)


# ================= CHECK IF OPTIMIZATION NEEDED =================
def should_optimize(salesperson):
    pending_jobs = JobQueue.objects.filter(
        salesperson=salesperson,
        status="PENDING"
    ).count()

    return pending_jobs >= salesperson.max_job_threshold


# ================= OPTIMIZE JOBS (NEAREST NEIGHBOR) =================
def optimize_jobs_for_salesperson(salesperson):
    jobs = list(JobQueue.objects.filter(
        salesperson=salesperson,
        status="PENDING"
    ))

    if len(jobs) <= 1:
        return jobs

    optimized = [jobs.pop(0)]

    while jobs:
        last = optimized[-1]

        next_job = min(
            jobs,
            key=lambda j: calculate_distance(
                last.customer_latitude,
                last.customer_longitude,
                j.customer_latitude,
                j.customer_longitude
            )
        )

        optimized.append(next_job)
        jobs.remove(next_job)

    # 🔥 THIS PART IS REQUIRED
    for index, job in enumerate(optimized):
        job.status = "OPTIMIZED"
        job.priority_order = index
        job.save()

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
                    salesperson.latitude,
                    salesperson.longitude,
                    c.latitude,
                    c.longitude
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

from django.utils import timezone
from datetime import timedelta
from .models import JobQueue


def check_thresholds(salesperson):
    now = timezone.now()

    pending_jobs = JobQueue.objects.filter(
        salesperson=salesperson,
        status="PENDING"
    )

    job_count = pending_jobs.count()

    count_trigger = (
        job_count >= salesperson.max_job_threshold
    )

    time_trigger = False
    alerts = []

    for job in pending_jobs:
        waiting_minutes = (now - job.assigned_at).total_seconds() / 60

        if waiting_minutes >= salesperson.min_time_threshold:
            alerts.append(
                f"Job {job.id} reached minimum waiting time."
            )

        if waiting_minutes >= salesperson.max_time_threshold:
            time_trigger = True
            alerts.append(
                f"Job {job.id} exceeded maximum waiting time!"
            )

    optimize = count_trigger or time_trigger

    print(optimize)
    return optimize, alerts


