from django.urls import path
from . import views


urlpatterns = [
    path('api/patients/', views.PatientAPIView.as_view(), name='patient-view'),
]
