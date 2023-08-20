from rest_framework import serializers
from .models import Patient, CustomUser, ScanReport, PatientVisit


class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('phone_number', 'first_name', 'last_name', 'email')


class PatientSerializer(serializers.ModelSerializer):
    profile = CustomUserSerializer()  # Include the nested serializer for the CustomUser model

    class Meta:
        model = Patient
        fields = '__all__'


class ScanReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScanReport
        fields = '__all__'


class PatientVisitSerializer(serializers.ModelSerializer):
    patient = PatientSerializer()
    class Meta:
        model = PatientVisit
        fields = '__all__'