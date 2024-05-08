from django.test import TestCase

# Create your tests here.
from django.test import TestCase
from apps.accounts.models import User
from rest_framework.test import APIRequestFactory
from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response
from unittest.mock import patch
from apps.funds.models import Fund
from apps.funds.serializers import FundSerializers
from apps.funds.views import FundsViewset
from django.urls import reverse
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework.test import force_authenticate


class FundsViewsetTestCase(TestCase):
    def setUp(self):
        self.user, _ = User.objects.create_user(
            username="testuser", email="test@example.com", password="testpassword"
        )
        self.factory = APIRequestFactory()
        self.view = FundsViewset.as_view(
            {"get": "list", "post": "create", "put": "update", "delete": "destroy"}
        )
        self.list_url = reverse("funds-list")

    def test_list_funds(self):
        Fund.objects.create(
            fund_name="Fund 1", fund_description="Test fund1", fund_size="1000"
        )
        Fund.objects.create(
            fund_name="Fund 2", fund_description="Test fund2", fund_size="2000"
        )

        request = self.factory.get(self.list_url)
        force_authenticate(request, user=self.user)
        response = self.view(request)
        response_data = response.data.get("results")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data.get("count"), 2)
        self.assertEqual(response_data[1]["fund_name"], "Fund 1")
        self.assertEqual(response_data[0]["fund_name"], "Fund 2")

    def test_create_fund(self):
        data = {
            "fund_name": "New Fund",
            "fund_description": "New fund",
            "fund_size": "500",
        }

        request = self.factory.post(self.list_url, data)
        force_authenticate(request, user=self.user)
        response = self.view(request)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(
            Fund.objects.filter(fund_name="New Fund", fund_size="500").exists()
        )

    def test_update_fund(self):
        fund = Fund.objects.create(
            fund_name="Old Fund",
            fund_description="old fund description",
            fund_size="100",
        )
        update_url = reverse("funds-detail", kwargs={"pk": fund.pk})
        data = {"fund_name": "Updated Fund", "fund_size": "200"}

        request = self.factory.put(update_url, data)
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=fund.pk)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(
            Fund.objects.filter(fund_name="Updated Fund", fund_size="200").exists()
        )

    def test_delete_fund(self):
        fund = Fund.objects.create(
            fund_name="Fund to be deleted",
            fund_description="Fund for remove",
            fund_size="500",
        )
        delete_url = reverse("funds-detail", kwargs={"pk": fund.pk})

        request = self.factory.delete(delete_url)
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=fund.pk)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Fund.objects.filter(fund_name="Fund to be deleted").exists())

    def teardown(self):
        User.objects.all.delete()
        Fund.objects.all.delete()
