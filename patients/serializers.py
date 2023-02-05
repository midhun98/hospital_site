from django.contrib.auth.models import User
from rest_framework import serializers

from core.models import Profile
from patients.models import (
    EmergencyContact,
    PatientVisit,
    LabResult,
    Patient,
)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'email', 'username')


class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Profile
        fields = ('user', 'mobile', 'gender', 'address', 'role')

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = User.objects.create_user(**user_data)
        profile = Profile.objects.create(user=user, **validated_data)
        return profile


class LabResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = LabResult
        fields = '__all__'

    patient_visit = serializers.PrimaryKeyRelatedField(queryset=PatientVisit.objects.all(), required=False)


class EmergencyContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmergencyContact
        fields = '__all__'

    patient = serializers.PrimaryKeyRelatedField(queryset=Patient.objects.all(), required=False)


class PatientVisitSerializer(serializers.ModelSerializer):
    lab_results = LabResultSerializer(many=True, allow_null=True)

    class Meta:
        model = PatientVisit
        fields = '__all__'

    patient = serializers.PrimaryKeyRelatedField(write_only=True, queryset=Patient.objects.all(), required=False)

    def create(self, validated_data):
        lab_results_data = validated_data.pop('lab_results', [])
        patient_visit = PatientVisit.objects.create(**validated_data)
        for lab_result_data in lab_results_data:
            LabResult.objects.create(patient_visit=patient_visit, **lab_result_data)
        return patient_visit


class PatientSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer()
    emergency_contacts = EmergencyContactSerializer(many=True, allow_null=True)
    patient_visits = PatientVisitSerializer(many=True, allow_null=True)

    class Meta:
        model = Patient
        fields = '__all__'

    def create(self, validated_data):
        profile_data = validated_data.pop('profile', [])
        emergency_contacts_data = validated_data.pop('emergency_contacts', [])
        patient_visits_data = validated_data.pop('patient_visits', [])

        profile = ProfileSerializer.create(ProfileSerializer(), validated_data=profile_data)
        patient = Patient.objects.create(profile=profile, **validated_data)
        for emergency_contact_data in emergency_contacts_data:
            emergency_contact_data['patient'] = patient
            EmergencyContact.objects.create(**emergency_contact_data)
        for patient_visit_data in patient_visits_data:
            lab_results_data = patient_visit_data.pop('lab_results', [])
            patient_visit = PatientVisit.objects.create(patient=patient, **patient_visit_data)
            for lab_result_data in lab_results_data:
                LabResult.objects.create(patient_visit=patient_visit, **lab_result_data)
        return patient
