from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from patients.models import (
    Patient,
    PatientVisit,
)
from patients.serializers import (
    PatientSerializer,
    EmergencyContactSerializer,
    PatientVisitSerializer,
    LabResultSerializer,
)


class PatientAPIView(APIView):

    def get(self, request):

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
                patient_visit_id = patient_visit_data.get('id')
                patient_visit = PatientVisit.objects.get(id=patient_visit_id)
                lab_results = patient_visit.labresult_set.all()
                patient_visit_data['lab_results'] = LabResultSerializer(lab_results, many=True).data

        return Response(patients_data)

    def post(self, request):
        serializer = PatientSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            errors = serializer.errors
            print(errors)
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)
