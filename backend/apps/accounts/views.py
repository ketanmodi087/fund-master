from rest_framework import status, generics
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from django.utils.http import urlsafe_base64_decode
from django.db import transaction
from apps.accounts.models import User, RegistrationOtp
from apps.accounts.serializers import LoginSerializer, UserSerializer
from apps.common.helpers.error_decorator_helper import track_error
from apps.common.helpers.custom_return_response_helper import return_response
from apps.common.constant import SystemMsg, ErrorMsg
from fund_project.jwt_custom_token import get_tokens_for_user
from fund_project.sendgrid import SendMail
from apps.common.utils import create_email_link


# Create your views here.
class Login(APIView):
    """
    A view for handling user authentication and login.
    """

    permission_classes = (AllowAny,)

    @track_error(validate_api_parameters=["email", "password"])
    def post(self, request, *args, **kwargs):
        """
        Handle POST requests for user login.

        Parameters:
        - request: The request object containing the user's credentials.
        - *args: Additional arguments.
        - **kwargs: Additional keyword arguments.

        Returns:
        - Response with appropriate status code and message.
        """
        # Creating an instance of the LoginSerializer
        serializer = LoginSerializer(data=request.data)
        # Validating the serializer, raising an exception if validation fails
        serializer.is_valid(raise_exception=True)
        # Retrieving the validated user from the serializer
        user = serializer.validated_data["user"]
        # Getting tokens for the authenticated user
        tokens = get_tokens_for_user(user=user)
        # Constructing the response data
        response_data = {
            "user_id": user.id,
            "email": request.data.get("email"),
            "first_name": user.first_name or "",
            "last_name": user.last_name or "",
            "is_verified": user.is_verified,
        }
        if user.is_verified:
            message = SystemMsg.LOGIN_SUCCESS
            response_data["tokens"] = tokens
            error = False
            status_code = status.HTTP_200_OK
        else:
            message = ErrorMsg.ACCOUNT_NOT_VERIFIED
            error = True
            status_code = status.HTTP_401_UNAUTHORIZED
        # Returning a successful response with the constructed data
        return return_response(
            message=message, error=error, data=response_data, status_code=status_code
        )


class SignUp(generics.CreateAPIView):
    permission_classes = (AllowAny,)
    serializer_class = UserSerializer

    @track_error(
        validate_api_parameters=[
            "email",
            "first_name",
            "last_name",
            "password",
        ]
    )
    @transaction.atomic
    def create(self, request, *args, **kwargs):
        request_data = request.data.copy()
        serializer = self.get_serializer(data=request_data)
        serializer.is_valid(raise_exception=True)
        user_data = serializer.save()

        verify_link = create_email_link(user=user_data)
        SendMail.send_verification_email(verify_link=verify_link, user_data=user_data)

        response_data = {
            "first_name": user_data.first_name,
            "last_name": user_data.last_name,
            "email": user_data.email,
            "is_verified": user_data.is_verified,
        }

        return return_response(
            message=SystemMsg.SUCCESSFULLY_REGISTERED,
            data=response_data,
            status_code=status.HTTP_201_CREATED,
        )


class VerifyEmailAPIView(APIView):
    """
    This view is used to verify the OTP sent to the user's email during registration process.
    """

    permission_classes = (AllowAny,)

    @track_error(validate_api_parameters=["useridb64", "otpb64"])
    def post(self, request, *args, **kwargs):
        useridb64, otpb64 = request.data.get("useridb64"), request.data.get("otpb64")
        user_id, otp = urlsafe_base64_decode(useridb64).decode(
            "utf-8"
        ), urlsafe_base64_decode(otpb64).decode("utf-8")

        user = User.objects.get(id=user_id)

        registration_otp = RegistrationOtp.objects.filter(
            email=user.email, is_active=True, otp=otp
        ).first()
        if registration_otp and registration_otp.otp == otp:
            user.is_verified = True
            user.save(update_fields=["is_verified"])

            tokens = get_tokens_for_user(user=user)

            registration_otp.is_active = False
            registration_otp.save(update_fields=["is_active"])

            response_data = {
                "first_name": user.first_name,
                "last_name": user.last_name,
                "user": user.email,
                "is_verified": user.is_verified,
                "tokens": tokens,
            }

            return return_response(
                message=SystemMsg.EMAIL_VERIFIED_SUCCESS,
                data=response_data,
            )
        else:
            return return_response(
                message=SystemMsg.EMAIL_VERIFICATION_FAILED,
                data={"is_valid_otp": False},
                status_code=status.HTTP_406_NOT_ACCEPTABLE,
                error=True,
            )
