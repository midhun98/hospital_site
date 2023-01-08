from django.contrib import admin
from core import models
# Register your models here.
admin.site.register(models.Profile)
admin.site.register(models.Role)
admin.site.register(models.Appointment)
