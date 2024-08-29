from django.contrib import admin
from django.contrib.auth.models import Group

# Register your models here.
from patients import models


class PatientAdmin(admin.ModelAdmin):
    list_display = ("profile", "existence_status", "dob", "display_age")
    readonly_fields = ("display_age",)

    def display_age(self, obj):
        age = obj.calculate_age() if obj.dob else None
        return age

    display_age.short_description = "Age"  # This sets the column header in the admin


admin.site.register(models.Patient, PatientAdmin)
admin.site.register(models.EmergencyContact)
admin.site.register(models.PatientVisit)
admin.site.register(models.LabResult)
admin.site.register(models.ScanImage)


class ScanReportAdmin(admin.ModelAdmin):
    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "technician":
            technicians_group = Group.objects.get(name="technician")
            kwargs["queryset"] = technicians_group.user_set.all()

        if db_field.name == "doctor":
            doctors_group = Group.objects.get(name="doctor")
            kwargs["queryset"] = doctors_group.user_set.all()

        return super().formfield_for_foreignkey(db_field, request, **kwargs)


admin.site.register(models.ScanReport, ScanReportAdmin)
