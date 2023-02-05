from rest_framework import serializers

from core.models import (
    Appointment,
    Profile,
    Enquiries,
)


class AppointmentSerializer(serializers.ModelSerializer):
    doctor = serializers.PrimaryKeyRelatedField(queryset=Profile.objects.filter(role__name='Doctor'), required=False)

    class Meta:
        model = Appointment
        fields = ['id', 'name', 'email', 'phone', 'date', 'message', 'doctor']


class ContactFormSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enquiries
        fields = ['name', 'email', 'subject', 'message']
