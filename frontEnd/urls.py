from django.urls import path
from . import views
from django.views.generic import TemplateView
from django.contrib.auth.decorators import login_required

urlpatterns = [
    path("", TemplateView.as_view(template_name="index.html"), name='index'),
    path("dashboard/", login_required(TemplateView.as_view(template_name="dashboard.html")), name='dashboard'),
    path("enquiries/", login_required(TemplateView.as_view(template_name="enquiries.html")), name='enquiries'),
    path("login/", TemplateView.as_view(template_name="login.html"), name='login-page'),
]