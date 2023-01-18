from django.urls import path
from . import views
from django.views.generic import TemplateView

urlpatterns = [
    path("base/", views.base, name='base'),
    path("", TemplateView.as_view(template_name="index.html"), name='index'),
    path("dashboard/", TemplateView.as_view(template_name="dashboard.html"), name='index'),
]