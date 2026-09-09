from django.conf import settings
from django.core.mail import send_mail


def send_platform_email(subject, message, recipient_list):
    if not recipient_list:
        return False

    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=recipient_list,
            fail_silently=False,
        )
        return True
    except Exception:
        return False
