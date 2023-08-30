from django.urls import path, include
from django.views.generic import TemplateView
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()

router.register('invoices', views.InvoiceViewSet)
router.register('invoice-item', views.InvoiceItemViewSet)
urlpatterns = [
    path("patient-invoice/<int:patient_id>/create/<int:visit_id>/",
         TemplateView.as_view(template_name="invoices/patient_invoice_create.html"), name='patient-invoice-create'),
    path("patient/<int:patient_id>/patient-invoice/<int:invoice_id>/view/", TemplateView.as_view(template_name="invoice_card.html"),
         name='patient-invoice-generate'),
    path("patient/<int:patient_id>/patient-invoice/<int:invoice_id>/update/", TemplateView.as_view(template_name="invoices/patient_invoice_update.html"), name='patient-invoice-update'),
    path('api/', include(router.urls)),
]
