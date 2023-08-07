# Generated by Django 4.2.3 on 2023-08-07 06:13

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Patient',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('existence_status', models.IntegerField(choices=[(0, 'DELETED'), (1, 'ACTIVE'), (2, 'INACTIVE')], default=1)),
                ('inpatient_number', models.CharField(blank=True, max_length=10, null=True, unique=True)),
                ('outpatient_number', models.CharField(blank=True, max_length=10, null=True, unique=True)),
                ('medical_history', models.TextField(blank=True, null=True)),
                ('allergies', models.TextField(blank=True, null=True)),
                ('current_medications', models.TextField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('profile', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='core.profile')),
            ],
        ),
        migrations.CreateModel(
            name='PatientVisit',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('admission_date', models.DateField(blank=True, null=True)),
                ('discharge_date', models.DateField(blank=True, null=True)),
                ('amount_paid', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('balance_amount_paid', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('follow_up_appointments', models.DateField(blank=True, null=True)),
                ('reason_for_visit', models.TextField(blank=True, null=True)),
                ('diagnosis', models.TextField(blank=True, null=True)),
                ('treatment_notes', models.TextField(blank=True, null=True)),
                ('insurance_provider', models.TextField(blank=True, null=True)),
                ('policy_number', models.CharField(blank=True, max_length=20, null=True)),
                ('patient', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='patients.patient')),
            ],
        ),
        migrations.CreateModel(
            name='LabResult',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('test_name', models.CharField(blank=True, max_length=100, null=True)),
                ('test_result', models.TextField(blank=True, null=True)),
                ('test_date', models.DateField(blank=True, null=True)),
                ('patient_visit', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='patients.patientvisit')),
            ],
        ),
        migrations.CreateModel(
            name='EmergencyContact',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, max_length=100, null=True)),
                ('phone_number', models.CharField(blank=True, max_length=15, null=True, unique=True)),
                ('patient', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='patients.patient')),
            ],
        ),
    ]
