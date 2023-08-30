import datetime

from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import status, viewsets
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from core.views import CustomPageNumberPagination
from .filters import PatientFilter
from .models import (Patient,
                     PatientVisit,
                     ScanImage,
                     ScanReport)
from .serializers import (CustomUserSerializer,
                          PatientSerializer,
                          PatientVisitSerializer,
                          ScanReportSerializer)

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
            'address': request.data.get('address') or None,
            'dob': request.data.get('dob') or None,
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
        return ScanReport.objects.filter(Q(patient_id=patient_id) | Q(patient_visit__patient_id=patient_id)).order_by('id')

    def create(self, request, *args, **kwargs):
        report_date = None
        report_date_str = request.data.get('report_date')
        if report_date_str:
            report_date = timezone.make_aware(datetime.datetime.strptime(report_date_str, '%Y-%m-%d %H:%M'))

        patient_visit_id = request.data.get('patient_visit')
        patient_visit = get_object_or_404(PatientVisit, pk=patient_visit_id)  # Retrieve the PatientVisit instance
        technician = get_object_or_404(User, phone_number=request.user)  # Retrieve the User instance

        report_data = {
            'patient_visit': patient_visit,
            'report_date': report_date,
            'conclusion': request.data.get('conclusion'),
            'findings': request.data.get('findings'),
            'scan_type': request.data.get('scan_type'),
            'technician': technician,
        }
        patient_report = ScanReport(**report_data)
        patient_report.save()

        # Process and save scan images

        scan_images = request.data.getlist('scan_files', [])  # Use getlist to get all uploaded files
        for scan_image_data in scan_images:
            scan_image = ScanImage(
                scan_report=patient_report,
                image_file=scan_image_data
            )
            scan_image.save()
        return Response({'success': True}, status=status.HTTP_201_CREATED)

    def partial_update(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
        except ScanReport.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        # Update fields using serializer (similar to your current implementation)
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        try:
            serializer.is_valid(raise_exception=True)
        except ValidationError as error:
            return Response({'errors': error.detail}, status=status.HTTP_400_BAD_REQUEST)

        # Perform the field update
        serializer.save()

        # Handle uploaded files update
        scan_images = request.FILES.getlist('scan_files', [])
        image_ids_to_delete = request.data.get('image_ids_to_delete', [])  # List of image IDs to delete

        for image_id in image_ids_to_delete:
            try:
                scan_image = instance.scan_images.get(id=image_id)
                scan_image.image_file.delete()  # Delete the associated image file from storage
                scan_image.delete()  # Delete the scan image object
            except ScanImage.DoesNotExist:
                pass  # Ignore if the image doesn't exist

        for scan_image_data in scan_images:
            scan_image = ScanImage(
                scan_report=instance,
                image_file=scan_image_data
            )
            scan_image.save()

        return Response({'success': True}, status=status.HTTP_200_OK)


class PatientVisitViewSet(viewsets.ModelViewSet):
    serializer_class = PatientVisitSerializer
    pagination_class = CustomPageNumberPagination
    permission_classes = [IsAuthenticated]  # Require authenticated users

    def get_queryset(self):
        # Filter patient visits by the patient's ID
        patient_id = self.kwargs['patient_id']
        return PatientVisit.objects.filter(patient_id=patient_id).order_by('id')

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

    def update(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
        except PatientVisit.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_serializer(instance, data=request.data, partial=True)
        try:
            serializer.is_valid(raise_exception=True)
        except ValidationError as error:
            return Response({'errors': error.detail}, status=status.HTTP_400_BAD_REQUEST)

        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            instance._prefetched_objects_cache = {}

        return Response({'success': True}, status=status.HTTP_201_CREATED)
