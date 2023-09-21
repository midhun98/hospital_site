import django_filters
from .models import Invoice


class InvoiceFilter(django_filters.FilterSet):
    id = django_filters.CharFilter(field_name='id', lookup_expr='icontains')
    is_paid = django_filters.BooleanFilter(field_name='is_paid')
    from_date = django_filters.DateFilter(field_name='payment_date', lookup_expr='gte')
    to_date = django_filters.DateFilter(field_name='payment_date', lookup_expr='lte')

    class Meta:
        model = Invoice
        fields = ['id', 'is_paid', 'from_date', 'to_date']

    def filter_queryset(self, queryset):
        # Get the 'paid' parameter from the request
        paid = self.request.query_params.get('paid', None)

        # Get the 'unpaid' parameter from the request
        unpaid = self.request.query_params.get('unpaid', None)

        # Get the 'from_date' and 'to_date' parameters from the request
        from_date = self.request.query_params.get('from_date', None)
        to_date = self.request.query_params.get('to_date', None)
        print("from_date and to_date", from_date, to_date)

        # Handle filtering based on 'paid', 'unpaid', 'from_date', and 'to_date' parameters
        if paid == 'true':
            queryset = queryset.filter(is_paid=True)
        elif unpaid == 'true':
            queryset = queryset.filter(is_paid=False)

        if from_date and to_date:
            print("from_date and to_date", from_date, to_date)
            queryset = queryset.filter(payment_date__range=[from_date, to_date])
            print(len(queryset))
        return queryset

