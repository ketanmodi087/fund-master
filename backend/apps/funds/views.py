from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from apps.common.constant import SystemMsg
from apps.funds.serializers import FundSerializers
from apps.funds.models import Fund
from apps.common.helpers.custom_return_response_helper import return_response
from rest_framework import status, filters
from apps.common.helpers import s3_helpers
from apps.common.paginations import OffsetPagination
from apps.common.helpers.common_helper import get_common_queryset

s3_hp_service = s3_helpers.BucketService()


# Create your views here.
class FundsViewset(ModelViewSet):
    """
    A viewset for handling CRUD operations related to Funds.
    """

    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    serializer_class = FundSerializers
    pagination_class = OffsetPagination

    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["fund_name", "fund_description", "fund_size"]
    ordering_fields = ["id", "fund_name", "fund_description", "fund_size"]

    def list(self, request, *args, **kwargs):
        """
        Retrieve a paginated list of Funds.

        Args:
            request: The request object.
            *args: Additional positional arguments.
            **kwargs: Additional keyword arguments.

        Returns:
            Response: Paginated list of Funds.
        """
        queryset = self.get_queryset()
        page = self.paginate_queryset(queryset)
        serializer = self.get_serializer(page, many=True)
        return self.get_paginated_response(serializer.data)

    def get_queryset(self):
        """
        Get the queryset of Fund objects.

        This method retrieves all Fund objects from the database and orders them by descending id.
        It then filters the queryset based on the request and search fields using a helper function.

        Returns:
            QuerySet: A filtered queryset of Fund objects.
        """
        queryset = Fund.objects.all().order_by("-id")
        return get_common_queryset(self.request, queryset, self.search_fields)

    def create(self, request, *args, **kwargs):
        """
        Create a new Fund instance.

        Args:
            request: The request object.
            *args: Additional positional arguments.
            **kwargs: Additional keyword arguments.

        Returns:
            Response: Response with created Fund data.
        """
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return return_response(
                message=serializer.errors,
                error=True,
                status_code=status.HTTP_400_BAD_REQUEST,
            )
        serializer.save()
        return return_response(
            message=SystemMsg.FUND_CREATED_SUCCESS,
            data=serializer.data,
            status_code=status.HTTP_201_CREATED,
        )
