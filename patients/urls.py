from django.urls import include, path
from django.views.generic import TemplateView
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()

router.register("patients", views.PatientViewSet)
router.register("scanreport/(?P<patient_id>[0-9]+)", views.ScanReportViewset)
router.register("patients/(?P<patient_id>[0-9]+)/patient-visits", views.PatientVisitViewSet, basename="patient-visit")
urlpatterns = [
	path("patient-list/", TemplateView.as_view(template_name="patients/patient_list.html"), name="list-patients"),
	path("patient-create/", TemplateView.as_view(template_name="patients/patient_create.html"), name="patient-create"),
	path("patient-detail/", TemplateView.as_view(template_name="patients/patient_create.html"), name="patient-detail"),
	path(
		"patient/<int:patient_id>/",
		TemplateView.as_view(template_name="patients/patient_detail.html"),
		name="patient-detail",
	),  # Add this line
	path(
		"patient-visit/<int:patient_id>/",
		TemplateView.as_view(template_name="patients/patient_visit.html"),
		name="patient-visit",
	),  # Add this line
	path(
		"patient-visit/<int:patient_id>/create/",
		TemplateView.as_view(template_name="patients/patient_visit_create.html"),
		name="patient-visit-create",
	),
	path(
		"patient/<int:patient_id>/patient-visit/<int:visit_id>/update/",
		TemplateView.as_view(template_name="patients/patient_visit_update.html"),
		name="patient-visit-update",
	),
	path(
		"patient-report/<int:patient_id>/create/<int:visit_id>/",
		TemplateView.as_view(template_name="patients/patient_report_create.html"),
		name="patient-report-create",
	),
	path(
		"patient/<int:patient_id>/scan-report/<int:scan_id>/view/",
		TemplateView.as_view(template_name="patients/patient_scan_report_view.html"),
		name="patient-scan-report-view",
	),
	path(
		"patient/<int:patient_id>/scan-report/<int:scan_id>/update/",
		TemplateView.as_view(template_name="patients/patient_scan_report_update.html"),
		name="patient-scan-report-update",
	),
	path(
		"patient/<int:patient_id>/scan-report/<int:scan_id>/view/print/",
		TemplateView.as_view(template_name="scan_report_template.html"),
		name="scan-report-template",
	),
	path("api/", include(router.urls)),
]
