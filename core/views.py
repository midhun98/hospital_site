import json
from rest_framework.exceptions import ValidationError
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import JsonResponse
from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from core.models import (
    Appointment,
    Enquiries,
    Career,
    Document,
)
from core.serializers import (
    AppointmentSerializer,
    ContactFormSerializer,
    CareerSerializer,
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


class CareerAPIView(APIView):
    def get(self, request):
        careers = Career.objects.all()
        serializer = CareerSerializer(careers, context={'request': request}, many=True)
        return Response(serializer.data)

    def post(self, request):
        name = request.data.get('name')
        email = request.data.get('email')
        phone = request.data.get('phone')
        message = request.data.get('message')
        documents = request.FILES.getlist('document')

        career = Career(name=name, email=email, phone=phone, message=message)

        try:
            career.full_clean()
            career.save()
        except ValidationError as err:
            errors = dict(err)
            return Response({'errors': errors}, status=status.HTTP_400_BAD_REQUEST)

        for document in documents:
            Document.objects.create(career=career, file=document)

        return Response({'success': True}, status=status.HTTP_201_CREATED)
