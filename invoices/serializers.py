from rest_framework import serializers

from .models import Invoice, InvoiceItem


class InvoiceItemSerializer(serializers.ModelSerializer):
	class Meta:
		model = InvoiceItem
		fields = "__all__"


class InvoiceSerializer(serializers.ModelSerializer):
	class Meta:
		model = Invoice
		fields = "__all__"


class InvoiceRetrieveSerializer(serializers.ModelSerializer):
	items = InvoiceItemSerializer(many=True, read_only=True)

	class Meta:
		model = Invoice
		fields = "__all__"


class InvoiceListingSerializer(serializers.ModelSerializer):
	patient_id = serializers.SerializerMethodField()  # Custom field to include patient ID

	class Meta:
		model = Invoice
		fields = "__all__"

	def get_patient_id(self, obj):
		# Get the patient ID from the related PatientVisit
		return obj.patient_visit.patient_id
