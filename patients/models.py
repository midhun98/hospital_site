from django.db import models
from core.models import (
    CustomUser
)
from core import utils
from django.utils import timezone
from froala_editor.fields import FroalaField
from datetime import date

# Create your models here.
class Patient(models.Model):
    profile = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    existence_status = models.IntegerField(choices=utils.existence_status, default=utils.ACTIVE)
    inpatient_number = models.CharField(max_length=10, blank=True, null=True, unique=True)
    outpatient_number = models.CharField(max_length=10, blank=True, null=True, unique=True)
    medical_history = models.TextField(null=True, blank=True)
    allergies = models.TextField(null=True, blank=True)
    current_medications = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    additional_info = models.TextField(null=True, blank=True)
    insurance_provider = models.TextField(null=True, blank=True)
    policy_number = models.CharField(max_length=20, null=True, blank=True)
    address = models.TextField(null=True, blank=True)
    dob = models.DateField(null=True, blank=True)

    def calculate_age(self):
        if self.dob:
            today = date.today()
            birth_date = self.dob
            age = today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))
            return age
        return None

    def __str__(self):
        return "{}".format(self.profile.phone_number if self.profile.phone_number else "")


class EmergencyContact(models.Model):
    name = models.CharField(max_length=100, null=True, blank=True)
    phone_number = models.CharField(max_length=15, unique=True, null=True, blank=True)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)


class PatientVisit(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    admission_date = models.DateTimeField(null=True, blank=True)
    discharge_date = models.DateTimeField(null=True, blank=True)
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    balance_amount_paid = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    follow_up_appointments = models.DateTimeField(null=True, blank=True)
    reason_for_visit = models.TextField(null=True, blank=True)
    diagnosis = models.TextField(null=True, blank=True)
    treatment_notes = models.TextField(null=True, blank=True)
    visit_date = models.DateTimeField(null=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.visit_date:
            self.visit_date = timezone.now()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.patient.profile.phone_number} - {self.admission_date}"


class LabResult(models.Model):
    patient_visit = models.ForeignKey(PatientVisit, on_delete=models.CASCADE, null=True, blank=True)
    test_name = models.CharField(max_length=100, null=True, blank=True)
    test_result = models.TextField(null=True, blank=True)
    test_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return "{} - {}".format(self.test_name, self.test_result)


class ScanReport(models.Model):
    patient_visit = models.ForeignKey(PatientVisit, on_delete=models.CASCADE)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, null=True, blank=True)
    report_date = models.DateTimeField(null=True, blank=True)
    scan_type = models.CharField(max_length=50)
    findings = FroalaField(null=True, blank=True)
    conclusion = models.TextField(null=True, blank=True)
    technician = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, related_name='scans_technician', null=True, blank=True)
    doctor = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, related_name='scans_doctor', null=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.report_date:
            self.report_date = timezone.now()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.id} - {self.patient_visit.patient.profile.phone_number} - {self.report_date} - {self.scan_type}"


class ScanImage(models.Model):
    scan_report = models.ForeignKey(ScanReport, on_delete=models.CASCADE, related_name='scan_images')
    image_file = models.FileField(upload_to='scan_reports/')
    uploaded_at = models.DateTimeField(null=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.uploaded_at:
            self.uploaded_at = timezone.now()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Scan Image for {self.scan_report.id} - {self.scan_report.patient_visit.patient.profile.phone_number} - {self.scan_report.scan_type}"
