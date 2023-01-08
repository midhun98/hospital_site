from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from core.serializers import AppointmentSerializer


# Create your views here.

class AppointmentView(APIView):
    def post(self, request):
        serializer = AppointmentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            errors = serializer.errors
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)
