from rest_framework import status, viewsets
from .models import (Patient,
                     ScanReport,
                     PatientVisit)
from .serializers import (PatientSerializer,
                          CustomUserSerializer,
                          ScanReportSerializer,
                          PatientVisitSerializer)
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from core.views import CustomPageNumberPagination
from rest_framework.permissions import IsAuthenticated
from .filters import PatientFilter
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
import datetime
from django.db.models import Q

User = get_user_model()


class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all().order_by('id')
    serializer_class = PatientSerializer
    pagination_class = CustomPageNumberPagination
    permission_classes = [IsAuthenticated]  # Require authenticated users

    # Use the filter class
    filter_backends = [DjangoFilterBackend]
    filterset_class = PatientFilter

    def create(self, request, *args, **kwargs):

        phone_number = request.data.get('phone_number')
        first_name = request.data.get('first_name')
        last_name = request.data.get('last_name')
        email = request.data.get('email') or None
        existing_user = User.objects.filter(phone_number=phone_number)

        errors = {}
        fields_to_check = ['outpatient_number', 'inpatient_number']
        user_fields_check = ['phone_number', 'email']

        for field in user_fields_check:
            value = request.data.get(field)
            if value and User.objects.filter(**{field: value}).exists():
                errors[field] = [f"This {field.replace('_', ' ')} is already in use."]

        for field in fields_to_check:
            value = request.data.get(field)
            if value and Patient.objects.filter(**{field: value}).exists():
                errors[field] = [f"This {field.replace('_', ' ')} is already in use."]

        if errors:
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)

        if not existing_user:
            userobj = User.objects.create(phone_number=phone_number, first_name=first_name, last_name=last_name,
                                          email=email)
            patients_group = Group.objects.get(name='patients')
            userobj.groups.add(patients_group)
        else:
            userobj = existing_user.first()

        patient_data = {
            'profile': userobj,
            'medical_history': request.data.get('medical_history'),
            'allergies': request.data.get('allergies'),
            'current_medications': request.data.get('current_medications'),
            'outpatient_number': request.data.get('outpatient_number') or None,
            'inpatient_number': request.data.get('inpatient_number') or None,
            'additional_info': request.data.get('additional_info') or None,
        }
        Patient.objects.create(**patient_data)
        return Response({'success': True}, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()

        user_data = {
            'phone_number': request.data.get('phone_number'),
            'first_name': request.data.get('first_name'),
            'last_name': request.data.get('last_name'),
            'email': request.data.get('email') or None,
        }

        user_serializer = CustomUserSerializer(instance.profile, data=user_data, partial=True)
        errors = {}

        if not user_serializer.is_valid():
            errors.update(user_serializer.errors)

        serializer = self.get_serializer(instance, data=request.data, partial=True)

        if not serializer.is_valid():
            errors.update(serializer.errors)

        if errors:
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)

        user_serializer.save()
        serializer.save()

        return Response(serializer.data)


class ScanReportViewset(viewsets.ModelViewSet):
    queryset = ScanReport.objects.all().order_by('id')
    serializer_class = ScanReportSerializer
    pagination_class = CustomPageNumberPagination
    permission_classes = [IsAuthenticated]  # Require authenticated users

    def get_queryset(self):
        # Filter patient visits by the patient's ID
        patient_id = self.kwargs['patient_id']
        return ScanReport.objects.filter(Q(patient_id=patient_id) | Q(patient_visit__patient_id=patient_id))


class PatientVisitViewSet(viewsets.ModelViewSet):
    serializer_class = PatientVisitSerializer
    pagination_class = CustomPageNumberPagination
    permission_classes = [IsAuthenticated]  # Require authenticated users

    def get_queryset(self):
        # Filter patient visits by the patient's ID
        patient_id = self.kwargs['patient_id']
        return PatientVisit.objects.filter(patient_id=patient_id)

    def create(self, request, *args, **kwargs):
        patient_id = self.kwargs['patient_id']

        admission_date = None
        admission_date_str = request.data.get('admission_date')
        if admission_date_str:
            admission_date = timezone.make_aware(datetime.datetime.strptime(admission_date_str, '%Y-%m-%d %H:%M'))

        discharge_date = None
        discharge_date_str = request.data.get('discharge_date')
        if discharge_date_str:
            discharge_date = timezone.make_aware(datetime.datetime.strptime(discharge_date_str, '%Y-%m-%d %H:%M'))

        visit_date = None
        visit_date_str = request.data.get('visit_date')
        if visit_date_str:
            visit_date = timezone.make_aware(datetime.datetime.strptime(visit_date_str, '%Y-%m-%d %H:%M'))

        follow_up_appointments = None
        follow_up_appointments_str = request.data.get('follow_up_appointments')
        if follow_up_appointments_str:
            follow_up_appointments = timezone.make_aware(datetime.datetime.strptime(follow_up_appointments_str, '%Y-%m-%d %H:%M'))

        patient_data = {
            'patient_id': patient_id,
            'admission_date': admission_date,
            'discharge_date': discharge_date,
            'follow_up_appointments': follow_up_appointments,
            'reason_for_visit': request.data.get('reason_for_visit'),
            'diagnosis': request.data.get('diagnosis'),
            'treatment_notes': request.data.get('treatment_notes'),
            'visit_date': visit_date or timezone.now(),
        }

        patient_visit = PatientVisit(**patient_data)
        patient_visit.save()
        return Response({'success': True}, status=status.HTTP_201_CREATED)
