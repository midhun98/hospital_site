from django.urls import path, include
from . import views
from django.views.generic import TemplateView
from rest_framework.routers import DefaultRouter
router = DefaultRouter()

router.register('patients', views.PatientViewSet)
urlpatterns = [
    path("patient-list/", TemplateView.as_view(template_name="patients/patient_list.html"), name='patient-list'),
    path("patient-create/", TemplateView.as_view(template_name="patients/patient_create.html"), name='patient-create'),
    path('api/', include(router.urls)),

]
