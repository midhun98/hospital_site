from django.db import models
from patients.models import PatientVisit
from core import utils


class Invoice(models.Model):
    patient_visit = models.ForeignKey(PatientVisit, on_delete=models.CASCADE, related_name='invoice')
    invoice_date = models.DateTimeField(auto_now_add=True)
    due_date = models.DateTimeField()
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    is_paid = models.BooleanField(default=False)
    payment_date = models.DateTimeField(null=True, blank=True)
    invoice_name = models.TextField()
    existence_status = models.IntegerField(choices=utils.existence_status, default=utils.ACTIVE)

    def __str__(self):
        return f"Invoice for {self.id} - {self.invoice_date}"


class InvoiceItem(models.Model):
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name='items')
    description = models.CharField(max_length=255)
    quantity = models.PositiveIntegerField()
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)

    def total_price(self):
        return self.quantity * self.unit_price

    def __str__(self):
        return self.description
