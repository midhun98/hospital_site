from rest_framework import serializers

from core.models import Appointment, Profile


class AppointmentSerializer(serializers.ModelSerializer):


    class Meta:
        model = Appointment
        fields = ['name', 'email', 'phone', 'date', 'message']
