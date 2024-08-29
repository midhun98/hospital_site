from django.contrib.auth.decorators import login_required
from django.urls import path
from django.views.generic import TemplateView

from . import views

urlpatterns = [
    path("", TemplateView.as_view(template_name="index.html"), name="index"),
    path("dashboard/", login_required(views.dashboard), name="dashboard"),
    path("enquiries/", login_required(TemplateView.as_view(template_name="enquiries.html")), name="enquiries"),
    path("careers/", TemplateView.as_view(template_name="careers.html"), name="careers"),
    path(
        "admin-careers/", login_required(TemplateView.as_view(template_name="admin_careers.html")), name="admin-careers"
    ),
    path("login/", TemplateView.as_view(template_name="login.html"), name="login-page"),
    path("patient-create/", TemplateView.as_view(template_name="patients/patient_create.html"), name="patient-create"),
]
