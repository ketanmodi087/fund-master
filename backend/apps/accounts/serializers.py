from rest_framework import serializers
from apps.accounts.models import User
from django.core.validators import validate_email
from apps.common.constant import ErrorMsg
from django.contrib.auth import authenticate
from apps.common.helpers.custom_exception_helper import ExceptionError


def validate_email_address(email):
    """
    Validate the format of an email address.

    """
    try:
        validate_email(email)
    except Exception as e:
        raise ExceptionError(ErrorMsg.INVALID_EMAIL) from e


class LoginSerializer(serializers.Serializer):
    """
    Serializer for user login.

    This serializer is used for validating user login credentials.

    """

    email = serializers.EmailField()
    password = serializers.CharField(style={"input_type": "password"})

    def validate(self, attrs):
        """
        Validate user login credentials.

        Args:
            attrs (dict): The dictionary containing login credentials.

        Returns:
            dict: Validated attributes.

        Raises:
            ExceptionError: If any validation fails.

        """
        # Retrieving email from input data
        email = attrs.get("email")
        password = attrs.get("password")

        if not email or not password:
            raise ExceptionError(ErrorMsg.EMAIL_PASSWORD_NOT_FOUND)

        validate_email_address(email)

        # Querying the user based on the provided email
        user = User.objects.filter(email__iexact=email).first()

        # Checking various conditions for user validation
        if not user:
            raise ExceptionError(ErrorMsg.USER_NOT_FOUND)

        if not user.is_active:
            raise ExceptionError(ErrorMsg.NOT_ACTIVATE_ACCOUNT)

        # Authenticating user based on email and password
        user = authenticate(email=email, password=password)
        if not user:
            raise ExceptionError(ErrorMsg.INVALID_CREDENTIALS)

        # Adding the validated user to the attributes
        attrs["user"] = user
        return attrs


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for User model.

    This serializer is used for serializing and deserializing User objects.

    """

    class Meta:
        model = User
        fields = ("id", "first_name", "last_name", "email", "password")
        extra_kwargs = {
            "password": {"write_only": True},
            "username": {"read_only": True},
        }

    def create(self, validated_data):
        """
        Create a new user.

        Args:
            validated_data (dict): Validated data for creating a new user.

        Returns:
            User: The newly created user object.

        """
        user, _password = User.objects.create_user(**validated_data)
        return user
