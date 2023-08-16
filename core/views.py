import json
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import JsonResponse
from django.shortcuts import render, get_object_or_404
from rest_framework import status, viewsets, pagination
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from core.models import (
    Appointment,
    Enquiries,
    Career,
    Document,
)
from core.permissions import AdminGroupPermission
from core.serializers import (
    AppointmentSerializer,
    ContactFormSerializer,
    CareerSerializer,
)
User = get_user_model()

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


def otplesslogin(request):
    if request.method == 'POST':
        body = json.loads(request.body)
        phone_number = body.get('waNumber')
        phone_number = phone_number[2:]
        try:
            user = User.objects.get(phone_number=phone_number)
            login(request, user)
            return JsonResponse({'status': 'success'})
        except User.DoesNotExist:
            return JsonResponse({'status': 'failed', 'message': 'User not found'})
    return JsonResponse({'status': 'failed', 'message': 'Invalid request method'})


@login_required
def logout_api(request):
    logout(request)
    return render(request, 'login.html')


@login_required
def get_current_user(request):
    user = request.user
    full_name = user.first_name + ' ' + user.last_name
    return JsonResponse({'username': full_name})


class CareerViewSet(viewsets.ViewSet):
    """
    A viewset to create, view, delete the applications in the career page of the site.
    """

    permission_classes = [AdminGroupPermission]

    def list(self, request):
        careers = Career.objects.all()
        serializer = CareerSerializer(careers, context={'request': request}, many=True)
        return Response(serializer.data)

    def create(self, request):
        name = request.data.get('name')
        email = request.data.get('email')
        phone = request.data.get('phone')
        message = request.data.get('message')
        documents = request.FILES.getlist('document')

        career = Career(name=name, email=email, phone=phone, message=message)

        try:
            career.full_clean()
            career.save()
        except Exception as err:
            errors = dict(err)
            return Response({'errors': errors}, status=status.HTTP_400_BAD_REQUEST)

        for document in documents:
            Document.objects.create(career=career, file=document)

        return Response({'success': True}, status=status.HTTP_201_CREATED)

    def destroy(self, request, pk):
        career = get_object_or_404(Career, pk=pk)
        career.delete()
        return Response({'success': True}, status=status.HTTP_204_NO_CONTENT)


class CustomPageNumberPagination(pagination.PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100
