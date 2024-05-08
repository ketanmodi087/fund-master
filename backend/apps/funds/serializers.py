import uuid
import boto3
from django.conf import settings
from botocore.exceptions import ClientError
from apps.funds.models import Fund, FundDocuments
from rest_framework import serializers
from django.db import transaction
from apps.common.helpers import s3_helpers

s3_hp_service = s3_helpers.BucketService()


class FundDocumentsSerializer(serializers.ModelSerializer):
    """
    Serializer for FundDocuments model.

    This serializer is used for serializing FundDocuments model instances.
    """

    document_url = serializers.SerializerMethodField()

    class Meta:
        model = FundDocuments
        fields = ("id", "document_name", "document_url")

    def get_document_url(self, obj):
        """
        Get the presigned URL for the S3 document.

        Args:
            obj (FundDocuments): The FundDocuments instance.

        Returns:
            str: The presigned URL for the document.
        """
        document_name = obj.document_name
        return s3_hp_service.generate_presigned_url(key=document_name)


class FundSerializers(serializers.ModelSerializer):
    """
    Serializer for Fund model.

    This serializer is used for serializing and deserializing Fund model instances.
    """

    fund_documents = FundDocumentsSerializer(many=True, read_only=True)

    class Meta:
        model = Fund
        fields = ("id", "fund_name", "fund_description", "fund_size", "fund_documents")

        extra_kwargs = {"id": {"read_only": True}}

    # Create a new Fund instance.
    def create(self, validated_data):
        """
        Create a new Fund instance.

        Args:
            validated_data (dict): Validated data for creating a new Fund.

        Returns:
            Fund: The newly created Fund instance.
        """
        fund_documents_data = self.context["request"].FILES.getlist("fund_documents")
        with transaction.atomic():
            fund = Fund.objects.create(**validated_data)
            for document_data in fund_documents_data:
                document_name = f"{validated_data.get('fund_name').replace(' ', '-')}-{uuid.uuid4()}"
                try:
                    s3_hp_service.upload_to_s3(document_name, document_data)
                except ClientError as e:
                    # Handle S3 upload error
                    print("S3 Upload Error:", e)
                    # Rollback fund creation if S3 upload fails
                    fund.delete()
                    raise serializers.ValidationError(
                        "Failed to upload document to S3"
                    ) from e

                FundDocuments.objects.create(fund=fund, document_name=document_name)
        return fund

    # Update an existing Fund instance.
    def update(self, instance, validated_data):
        """
        Update an existing Fund instance.

        Args:
            instance (Fund): The Fund instance to update.
            validated_data (dict): Validated data for updating the Fund.

        Returns:
            Fund: The updated Fund instance.

        """
        fund_documents_data = self.context["request"].FILES.getlist(
            "fund_documents", []
        )

        with transaction.atomic():
            if fund_documents_ids := self.context["request"].data.get(
                "existing_documents", []
            ):
                if "," in fund_documents_ids:
                    exclude_delete_documents = [
                        int(document_id)
                        for document_id in fund_documents_ids.split(",")
                    ]
                else:
                    exclude_delete_documents = [int(fund_documents_ids)]
                fund_documents_to_delete = FundDocuments.objects.filter(
                    fund=instance
                ).exclude(id__in=exclude_delete_documents)
            else:
                fund_documents_to_delete = FundDocuments.objects.filter(fund=instance)
            for document in fund_documents_to_delete:
                s3_hp_service.delete_document_s3(key=document.document_name)

                # Delete all existing documents
                document.delete()

            for attr, value in validated_data.items():
                setattr(instance, attr, value)

            for document_data in fund_documents_data:
                document_name = f"{validated_data.get('fund_name').replace(' ', '-')}-{uuid.uuid4()}"
                try:
                    s3_hp_service.upload_to_s3(document_name, document_data)
                except ClientError as e:
                    # Handle S3 upload error
                    print("S3 Upload Error:", e)
                    raise serializers.ValidationError(
                        "Failed to upload document to S3"
                    ) from e

                FundDocuments.objects.create(fund=instance, document_name=document_name)
            instance.save()
        return instance

    def to_representation(self, instance):
        """
        Convert Fund instance to its representation.

        Args:
            instance (Fund): The Fund instance to represent.

        Returns:
            dict: The representation of the Fund instance.
        """
        representation = super().to_representation(instance)
        fund_documents = FundDocuments.objects.filter(fund=instance)
        representation["fund_documents"] = FundDocumentsSerializer(
            fund_documents, many=True
        ).data
        return representation
