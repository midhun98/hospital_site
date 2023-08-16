import django_filters
from patients.models import Patient

class PatientFilter(django_filters.FilterSet):
    phone_number = django_filters.CharFilter(field_name='profile__phone_number', lookup_expr='icontains')
    inpatient_number = django_filters.CharFilter(field_name='inpatient_number', lookup_expr='icontains')
    outpatient_number = django_filters.CharFilter(field_name='outpatient_number', lookup_expr='icontains')

    class Meta:
        model = Patient
        fields = ['phone_number', 'inpatient_number', 'outpatient_number']
