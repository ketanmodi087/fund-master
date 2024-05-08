from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models

class TimeStampModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

# Create your models here.
class UserManager(BaseUserManager):
    def create_user(self, **kwargs):
        """
        Creates and saves a User details.
        """
        kwargs.setdefault("is_staff", False)
        kwargs.setdefault("is_superuser", False)

        if not kwargs.get("email"):
            raise ValueError("Users must have an email address")

        kwargs["email"] = self.normalize_email(kwargs.get("email"))
        kwargs["username"] = kwargs["email"]
        password = kwargs["password"]
        user = self.model(**kwargs)

        user.set_password(password)
        user.save(using=self._db)
        return user, password

    def create_superuser(self, **kwargs):
        """
        Creates and saves a superuser with the given email, name and password.
        """
        user, password = self.create_user(**kwargs)
        user.is_superuser = True
        user.is_staff = True
        user.save(using=self._db)
        return user, password


class User(AbstractUser):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    is_verified = models.BooleanField(default=False)
    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []


class RegistrationOtp(TimeStampModel):
    email = models.CharField(max_length=150, blank=True, null=True)
    otp = models.CharField(max_length=10, unique=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        get_latest_by = ("created_at",)
