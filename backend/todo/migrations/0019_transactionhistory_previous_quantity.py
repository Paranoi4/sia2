# Generated by Django 5.1.5 on 2025-02-04 18:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('todo', '0018_transactionhistory_stock_in_quantity_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='transactionhistory',
            name='previous_quantity',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]
