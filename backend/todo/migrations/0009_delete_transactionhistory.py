# Generated by Django 5.1.5 on 2025-01-30 16:27

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('todo', '0008_transactionhistory'),
    ]

    operations = [
        migrations.DeleteModel(
            name='TransactionHistory',
        ),
    ]
