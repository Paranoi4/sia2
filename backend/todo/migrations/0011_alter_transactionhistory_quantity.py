# Generated by Django 5.1.5 on 2025-02-02 03:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('todo', '0010_transactionhistory'),
    ]

    operations = [
        migrations.AlterField(
            model_name='transactionhistory',
            name='quantity',
            field=models.IntegerField(blank=True, default=0, null=True),
        ),
    ]
