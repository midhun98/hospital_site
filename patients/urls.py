from django.urls import path
from . import views
from django.views.generic import TemplateView


urlpatterns = [
    path('api/patients/', views.PatientAPIView.as_view(), name='patient-view'),
    path("patient-list/", TemplateView.as_view(template_name="patients/patient_list.html"), name='patient-list'),
]
