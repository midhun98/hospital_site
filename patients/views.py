from rest_framework import status, viewsets, pagination
from .models import Patient
from .serializers import PatientSerializer
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from core.views import CustomPageNumberPagination

User = get_user_model()


class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    pagination_class = CustomPageNumberPagination

    def create(self, request, *args, **kwargs):

        phone_number = request.data.get('phone_number')
        first_name = request.data.get('first_name')
        last_name = request.data.get('last_name')
        email = request.data.get('email') or None
        existing_user = User.objects.filter(phone_number=phone_number)

        if not existing_user:
            userobj = User.objects.create(phone_number=phone_number, first_name=first_name, last_name=last_name, email=email)
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
        }
        Patient.objects.create(**patient_data)
        return Response({'success': True}, status=status.HTTP_201_CREATED)
