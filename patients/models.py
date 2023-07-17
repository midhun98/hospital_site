from django.db import models
from core.models import (
    Profile
)
from core import utils


# Create your models here.
class Patient(models.Model):
    profile = models.OneToOneField(Profile, on_delete=models.CASCADE)
    existence_status = models.IntegerField(choices=utils.existence_status, default=utils.ACTIVE)
    inpatient_number = models.CharField(max_length=10, blank=True, null=True, unique=True)
    outpatient_number = models.CharField(max_length=10, blank=True, null=True, unique=True)
    medical_history = models.TextField(null=True, blank=True)
    allergies = models.TextField(null=True, blank=True)
    current_medications = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return "{}".format(self.profile.user if self.profile.user else "")


class EmergencyContact(models.Model):
    name = models.CharField(max_length=100, null=True, blank=True)
    phone_number = models.CharField(max_length=15, unique=True, null=True, blank=True)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)


class PatientVisit(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    admission_date = models.DateField(null=True, blank=True)
    discharge_date = models.DateField(null=True, blank=True)
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    balance_amount_paid = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    follow_up_appointments = models.DateField(null=True, blank=True)
    reason_for_visit = models.TextField(null=True, blank=True)
    diagnosis = models.TextField(null=True, blank=True)
    treatment_notes = models.TextField(null=True, blank=True)
    insurance_provider = models.TextField(null=True, blank=True)
    policy_number = models.CharField(max_length=20, null=True, blank=True)

    def __str__(self):
        return f"{self.patient.profile.user} - {self.admission_date}"


class LabResult(models.Model):
    patient_visit = models.ForeignKey(PatientVisit, on_delete=models.CASCADE, null=True, blank=True)
    test_name = models.CharField(max_length=100, null=True, blank=True)
    test_result = models.TextField(null=True, blank=True)
    test_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return "{} - {}".format(self.test_name, self.test_result)
