# Generated by Django 5.0.5 on 2024-05-07 12:10

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('funds', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='funddocuments',
            name='document_url',
        ),
    ]