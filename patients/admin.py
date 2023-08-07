from django.contrib import admin

# Register your models here.
from patients import models

admin.site.register(models.Patient)
admin.site.register(models.EmergencyContact)
