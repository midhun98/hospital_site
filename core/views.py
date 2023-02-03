import json

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import JsonResponse
from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from core.models import Appointment, Enquiries, Patient, PatientVisit
from core.serializers import (
    AppointmentSerializer,
    ContactFormSerializer,
    PatientSerializer,
    EmergencyContactSerializer,
    PatientVisitSerializer,
    LabResultSerializer,
    ProfileSerializer,
)


# Create your views here.

class AppointmentView(LoginRequiredMixin, APIView):
    def get(self, request):
        appointments = Appointment.objects.all()
        serializer = AppointmentSerializer(appointments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = AppointmentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            errors = serializer.errors
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)


class AppointmentModify(LoginRequiredMixin, APIView):
    def delete(self, request, *args, **kwargs):
        pk = kwargs.get('pk')
        print("pk", pk)
        try:
            brand = Appointment.objects.get(id=pk)
        except:
            return Response('Appointment doesnt exist')
        brand.delete()
        return Response({"Message": 'Appointment deleted'})


class ContactMessage(LoginRequiredMixin, APIView):
    def get(self, request):
        contacts = Enquiries.objects.all()
        serializer = ContactFormSerializer(contacts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = ContactFormSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            errors = serializer.errors
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)


def login_api(request):
    if request.method == 'POST':
        body = json.loads(request.body)
        username = body.get('username')
        password = body.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return JsonResponse({'status': 'success'})
        else:
            return JsonResponse({'status': 'failed'})
    return JsonResponse({'status': 'failed'})


@login_required
def logout_api(request):
    logout(request)
    return render(request, 'login.html')


@login_required
def get_current_user(request):
    user = request.user
    full_name = user.first_name + ' ' + user.last_name
    return JsonResponse({'username': full_name})


class PatientAPIView(APIView):

    def get(self, request, format=None):

        patients = Patient.objects.all()
        serializer = PatientSerializer(patients, many=True)
        patients_data = serializer.data

        for patient_data in patients_data:
            patient_id = patient_data.get('id')
            patient = Patient.objects.get(id=patient_id)
            emergency_contacts = patient.emergencycontact_set.all()
            patient_visits = patient.patientvisit_set.all()
            patient_visits_data = PatientVisitSerializer(patient_visits, many=True).data
            patient_data['emergency_contacts'] = EmergencyContactSerializer(emergency_contacts, many=True).data
            patient_data['patient_visits'] = patient_visits_data

            for patient_visit_data in patient_visits_data:
                patient_visit_id = patient_visit_data.get('patient')
                patient_visit = PatientVisit.objects.get(id=patient_visit_id)
                lab_results = patient_visit.labresult_set.all()
                patient_visit_data['lab_results'] = LabResultSerializer(lab_results, many=True).data

        return Response(patients_data)
