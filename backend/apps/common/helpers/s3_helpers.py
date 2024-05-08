import uuid
import boto3
from botocore.exceptions import ClientError
from django.conf import settings


class BucketService:
    """
    A service class to interact with AWS S3 bucket.

    This class provides methods for uploading, generating presigned URLs,
    and deleting documents from an S3 bucket.
    """

    def __init__(self):
        """
        Initialize the S3 client with AWS credentials.
        """
        self.s3_client = boto3.client(
            "s3",
            region_name=settings.AWS_S3_REGION_NAME,
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
        )

    def upload_to_s3(self, document_name, document_content):
        """
        Upload a document to the S3 bucket.

        Args:
            document_name (str): The name of the document.
            document_content (file-like object): The content of the document.

        Returns:
            dict or None: The S3 response or None if upload fails.
        """
        try:
            response = self.s3_client.put_object(
                Bucket=settings.AWS_STORAGE_BUCKET_NAME,
                Key=document_name,
                Body=document_content.read(),
                ACL="public-read",
            )
        except ClientError as e:
            return None
        return response

    def generate_presigned_url(self, key=None, time=36000):
        """
        Generate a presigned URL for accessing a document in the S3 bucket.

        Args:
            key (str): The key (filename) of the document.
            time (int): The expiration time for the presigned URL in seconds.

        Returns:
            str: The presigned URL for the document.

        Raises:
            Exception: If there's an error generating the presigned URL.
        """
        try:
            return self.s3_client.generate_presigned_url(
                "get_object",
                Params={
                    "Bucket": settings.AWS_STORAGE_BUCKET_NAME,
                    "Key": key,
                },
                ExpiresIn=time,
            )

        except ClientError as e:
            raise Exception(e) from e

    def delete_document_s3(self, key=None):
        """
        Delete a document from the S3 bucket.

        Args:
            key (str): The key (filename) of the document.

        Returns:
            dict: The S3 response.

        Raises:
            Exception: If there's an error deleting the document.
        """
        try:
            return self.s3_client.delete_object(
                Bucket=settings.AWS_STORAGE_BUCKET_NAME, Key=key
            )
        except ClientError as e:
            raise Exception(e) from e
