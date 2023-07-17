# Generated by Django 4.1.4 on 2023-02-05 09:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('patients', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='patient',
            name='inpatient_number',
            field=models.CharField(blank=True, max_length=10, null=True, unique=True),
        ),
        migrations.AlterField(
            model_name='patient',
            name='outpatient_number',
            field=models.CharField(blank=True, max_length=10, null=True, unique=True),
        ),
    ]