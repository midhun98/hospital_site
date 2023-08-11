import django_filters
from patients.models import Patient

class PatientFilter(django_filters.FilterSet):
    search = django_filters.CharFilter(field_name='profile__phone_number', lookup_expr='icontains')

    class Meta:
        model = Patient
        fields = ['search']