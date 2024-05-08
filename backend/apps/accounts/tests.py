from django.test import TestCase

# Create your tests here.
from unittest import mock
from rest_framework import status
from django.urls import reverse
from apps.accounts.models import User, RegistrationOtp
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode

# from apps.accounts.serializers import UserSerializer
from apps.accounts.views import VerifyEmailAPIView
from rest_framework.test import APIClient


class SignUpTestCase(TestCase):
    def setUp(self):
        self.signup_url = reverse("signup")

    @mock.patch("apps.accounts.views.create_email_link")
    @mock.patch("apps.accounts.views.SendMail.send_verification_email")
    def test_signup(self, mock_send_verification_email, mock_create_email_link):
        mock_create_email_link.return_value = "mocked_link"
        mock_send_verification_email.return_value = status.HTTP_200_OK

        # Mocking request data
        user_data = {
            "email": "test@example.com",
            "first_name": "test",
            "last_name": "User",
            "password": "testpassword",
        }

        response = self.client.post(self.signup_url, user_data, format="json")

        # Checking if create_email_link and send_verification_email were called with correct arguments
        mock_create_email_link.assert_called_once_with(user=mock.ANY)
        mock_send_verification_email.assert_called_once_with(
            verify_link="mocked_link", user_data=mock.ANY
        )
        response_data = response.data.get("data", {})
        # Checking response status code and content
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response_data["first_name"], "test")
        self.assertEqual(response_data["last_name"], "User")
        self.assertEqual(response_data["email"], "test@example.com")
        self.assertFalse(response_data["is_verified"])

        # Checking if user is created in the database
        self.assertTrue(User.objects.filter(email="test@example.com").exists())

    @mock.patch("apps.accounts.views.create_email_link")
    @mock.patch("apps.accounts.views.SendMail.send_verification_email")
    def test_signup_invalid_data(
        self, mock_send_verification_email, mock_create_email_link
    ):
        mock_create_email_link.return_value = "mocked_link"
        mock_send_verification_email.return_value = status.HTTP_200_OK

        # Mocking request data with missing 'email' field
        user_data = {
            "first_name": "test",
            "last_name": "user",
            "password": "testpassword",
        }

        response = self.client.post(self.signup_url, user_data, format="json")

        # Checking if create_email_link and send_verification_email were not called
        mock_create_email_link.assert_not_called()
        mock_send_verification_email.assert_not_called()

        # Checking response status code and content
        self.assertEqual(response.status_code, status.HTTP_406_NOT_ACCEPTABLE)
        self.assertTrue(response.data["error"])
        self.assertEqual(response.data["message"], "Missing parameters: email")

        # Checking if user is not created in the database
        self.assertFalse(
            User.objects.filter(first_name="test", last_name="user").exists()
        )

    def tearDown(self):
        User.objects.all().delete()


class LoginTestCase(TestCase):
    @classmethod
    def setUpClass(cls):
        cls.url = reverse("login")
        cls.valid_payload = {
            "email": "test@example.com",
            "password": "Password@123",
        }
        cls.user, _ = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="Password@123",
        )

    @mock.patch("apps.accounts.views.get_tokens_for_user")
    def test_login_with_verified_account(self, mock_get_tokens_for_user):
        self.user.is_verified = True
        self.user.save()

        # Mock the get_tokens_for_user function
        mock_get_tokens_for_user.return_value = {
            "access": "access_token",
            "refresh": "refresh_token",
        }

        # Make a POST request to the API
        response = self.client.post(self.url, data=self.valid_payload)

        # Check that get_tokens_for_user was called with the correct user
        mock_get_tokens_for_user.assert_called_once_with(
            user=User.objects.get(email="test@example.com")
        )

        response_data = response.data.get("data", {})

        # Check the response data
        self.assertIn("tokens", response_data)
        self.assertIn("user_id", response_data)
        self.assertIn("email", response_data)
        self.assertIn("first_name", response_data)
        self.assertIn("last_name", response_data)
        self.assertIn("is_verified", response_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response_data["email"], self.valid_payload["email"])

    @mock.patch("apps.accounts.views.get_tokens_for_user")
    def test_login_with_unverified_account(self, mock_get_tokens_for_user):
        self.user.is_verified = False
        self.user.save()

        # Mock the get_tokens_for_user function
        mock_get_tokens_for_user.return_value = {
            "access": "access_token",
            "refresh": "refresh_token",
        }

        # Make a POST request to the API
        response = self.client.post(self.url, data=self.valid_payload)

        # Check that get_tokens_for_user was called with the correct user
        mock_get_tokens_for_user.assert_called_once_with(
            user=User.objects.get(email="test@example.com")
        )
        response_data = response.data.get("data", {})

        self.assertFalse(response_data["is_verified"])
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_login_invalid_data(self):
        # Make a POST request with invalid data
        invalid_payload = {
            "email": "test@example.com",
        }
        response = self.client.post(self.url, data=invalid_payload)

        # Check that the API responds with status code 406
        self.assertEqual(response.status_code, status.HTTP_406_NOT_ACCEPTABLE)

    @classmethod
    def tearDownClass(cls):
        User.objects.all().delete()


class VerifyEmailTestCase(TestCase):
    @classmethod
    def setUpClass(cls):
        cls.url = reverse("verify_email")
        cls.user, _ = User.objects.create_user(
            username="testuser", email="test@example.com", password="testpassword"
        )

    @mock.patch("apps.accounts.views.get_tokens_for_user")
    def test_verify_email_success(self, mock_get_tokens_for_user):
        # Create a registration OTP for the user
        registration_otp = RegistrationOtp.objects.create(
            email=self.user.email, otp="123456", is_active=True
        )

        # Create a request with the required data
        request_data = {
            "useridb64": urlsafe_base64_encode(force_bytes(self.user.id)),
            "otpb64": urlsafe_base64_encode(force_bytes(registration_otp.otp)),
        }

        # Mock get_tokens_for_user return value
        mock_get_tokens_for_user.return_value = {
            "access": "mock_access_token",
            "refresh": "mock_refresh_token",
        }

        response = self.client.post(self.url, data=request_data)

        # Assertions
        mock_get_tokens_for_user.assert_called_once_with(user=self.user)
        response_data = response.data.get("data", {})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response_data.get("tokens", {}).get("access"), "mock_access_token"
        )
        self.assertEqual(
            response_data.get("tokens", {}).get("refresh"), "mock_refresh_token"
        )

    @mock.patch("apps.accounts.views.get_tokens_for_user")
    def test_verify_email_failure(self, mock_get_tokens_for_user):
        # Create a request with the required data
        request_data = {
            "useridb64": urlsafe_base64_encode(force_bytes(self.user.id)),
            "otpb64": "invalid_otp",
        }

        # Mock get_tokens_for_user return value
        mock_get_tokens_for_user.return_value = {
            "access": "mock_access_token",
            "refresh": "mock_refresh_token",
        }

        response = self.client.post(self.url, data=request_data)
        response_data = response.data
        self.assertEqual(response_data["error"], True)
        self.assertEqual(response.status_code, status.HTTP_406_NOT_ACCEPTABLE)

    @classmethod
    def tearDownClass(cls):
        User.objects.all().delete()
        RegistrationOtp.objects.all().delete()
