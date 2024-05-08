from django.db import models
from apps.accounts.models import TimeStampModel


# Create your models here.
class Fund(TimeStampModel):
    fund_name = models.CharField(max_length=200)
    fund_description = models.TextField(null=True, default=None, blank=True)
    fund_size = models.CharField(max_length=50)


class FundDocuments(TimeStampModel):
    fund = models.ForeignKey(
        "Fund",
        to_field="id",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="fund_document_fund_id",
    )
    document_name = models.CharField(max_length=200)
