import random

from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from apps.accounts.models import RegistrationOtp
from django.conf import settings


def create_email_link(user, forget_password_link=False):
    # Encode the user ID to base64
    uid = urlsafe_base64_encode(force_bytes(user.id))
    otp = random.SystemRandom().randint(100000, 999999)
    RegistrationOtp.objects.create(email=user.email, otp=otp)
    otpb64 = urlsafe_base64_encode(force_bytes(otp))
    return f"{settings.FRONTEND_URL}verify-user?useridb64={uid}&otpb64={otpb64}"
