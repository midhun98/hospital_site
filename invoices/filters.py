from datetime import datetime

import django_filters

from core import utils

from .models import Invoice


class InvoiceFilter(django_filters.FilterSet):
    id = django_filters.CharFilter(field_name="id", lookup_expr="icontains")
    is_paid = django_filters.BooleanFilter(field_name="is_paid")
    from_date = django_filters.DateFilter(field_name="payment_date", lookup_expr="gte")
    to_date = django_filters.DateFilter(field_name="payment_date", lookup_expr="lte")
    payment_mode = django_filters.ChoiceFilter(field_name="payment_mode", choices=utils.payment_mode)

    class Meta:
        model = Invoice
        fields = ["id", "is_paid", "from_date", "to_date", "payment_mode"]

    def filter_queryset(self, queryset):
        request = self.request
        paid = request.query_params.get("paid", None)
        unpaid = request.query_params.get("unpaid", None)
        filter_date_range = request.query_params.get("filter_date_range", None)
        payment_mode = request.query_params.get("payment_mode", None)

        # Filter by ID if provided
        id = request.query_params.get("id", None)
        if id:
            queryset = queryset.filter(id=id)

        # Handle payment status filtering
        if paid == "true":
            queryset = queryset.filter(is_paid=True)
        elif unpaid == "true":
            queryset = queryset.filter(is_paid=False)
        elif paid == "false" and unpaid == "false":
            queryset = queryset

        # Handle custom date range filtering
        if filter_date_range:
            try:
                from_date_str, to_date_str = filter_date_range.split(" to ")
                from_date = datetime.strptime(from_date_str, "%d-%m-%Y")
                to_date = datetime.strptime(to_date_str, "%d-%m-%Y")
                print(from_date, to_date)
                queryset = queryset.filter(payment_date__range=[from_date, to_date])
            except ValueError:
                # Handle error if date format is incorrect
                pass

        # Filter by payment_mode if provided
        if payment_mode is not None:
            queryset = queryset.filter(payment_mode=payment_mode)

        return queryset
