# Generated by Django 4.2.3 on 2023-12-23 02:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('patients', '0011_alter_scanreport_findings'),
    ]

    operations = [
        migrations.AlterField(
            model_name='patient',
            name='policy_number',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
    ]