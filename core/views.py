from django.contrib.auth.mixins import LoginRequiredMixin
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from core.models import Appointment, Enquiries
from core.serializers import AppointmentSerializer, ContactFormSerializer


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
