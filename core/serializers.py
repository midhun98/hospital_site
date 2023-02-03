from django.contrib.auth.models import User
from rest_framework import serializers

from core.models import (
    Appointment,
    Profile,
    Enquiries,
    EmergencyContact,
    PatientVisit,
    LabResult,
    Patient,
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


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'email')


class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Profile
        fields = ('user', 'mobile', 'gender', 'address')

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = User.objects.create_user(username=user_data['username'], email=user_data['email'])
        profile = Profile.objects.create(user=user, **validated_data)
        return profile


class LabResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = LabResult
        fields = '__all__'
        extra_kwargs = {
            'patient_visit': {'allow_null': True}
        }


class EmergencyContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmergencyContact
        fields = '__all__'


class PatientVisitSerializer(serializers.ModelSerializer):
    lab_results = LabResultSerializer(many=True, allow_null=True)

    class Meta:
        model = PatientVisit
        fields = ['patient', 'admission_date', 'discharge_date', 'amount_paid', 'balance_amount_paid',
                  'follow_up_appointments', 'reason_for_visit', 'diagnosis', 'treatment_notes',
                  'insurance_provider', 'policy_number', 'lab_results']


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
        profile_data = validated_data.pop('profile')
        emergency_contacts_data = validated_data.pop('emergency_contacts')
        patient_visits_data = validated_data.pop('patient_visits')
        profile = Profile.objects.create(**profile_data)
        patient = Patient.objects.create(profile=profile, **validated_data)
        for emergency_contact_data in emergency_contacts_data:
            EmergencyContact.objects.create(patient=patient, **emergency_contact_data)
        for patient_visit_data in patient_visits_data:
            PatientVisit.objects.create(patient=patient, **patient_visit_data)
        return patient
