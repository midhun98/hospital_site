from rest_framework import serializers

from core.models import (
	Appointment,
	Career,
	Document,
	# Profile,
	Enquiries,
	Hospital,
)


class AppointmentSerializer(serializers.ModelSerializer):
	class Meta:
		model = Appointment
		fields = ["id", "name", "email", "phone", "date", "message"]


class ContactFormSerializer(serializers.ModelSerializer):
	class Meta:
		model = Enquiries
		fields = ["name", "email", "subject", "message"]


class DocumentSerializer(serializers.ModelSerializer):
	"""
	A serializer for Document
	"""

	class Meta:
		model = Document
		fields = ["id", "file"]


class CareerSerializer(serializers.ModelSerializer):
	"""
	A serializer for Career
	"""

	documents = DocumentSerializer(many=True)

	class Meta:
		model = Career
		fields = ["id", "name", "email", "phone", "message", "date", "documents"]


class HospitalSerializer(serializers.ModelSerializer):
	class Meta:
		model = Hospital
		fields = "__all__"
