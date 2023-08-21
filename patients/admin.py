from django.contrib import admin
from core.models import  CustomUser
from django.contrib.auth.models import Group

# Register your models here.
from patients import models

admin.site.register(models.Patient)
admin.site.register(models.EmergencyContact)
admin.site.register(models.PatientVisit)
admin.site.register(models.LabResult)
admin.site.register(models.ScanImage)

class ScanReportAdmin(admin.ModelAdmin):

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == 'technician':
            technicians_group = Group.objects.get(name='technician')
            kwargs['queryset'] = technicians_group.user_set.all()

        if db_field.name == 'doctor':
            doctors_group = Group.objects.get(name='doctor')
            kwargs['queryset'] = doctors_group.user_set.all()

        return super().formfield_for_foreignkey(db_field, request, **kwargs)


admin.site.register(models.ScanReport, ScanReportAdmin)