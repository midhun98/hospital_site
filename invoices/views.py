import datetime

from django.db import transaction
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from core.views import CustomPageNumberPagination
from .models import (
    Invoice,
    InvoiceItem,
)
from .serializers import (
    InvoiceSerializer,
    InvoiceItemSerializer,
)


class InvoiceViewSet(viewsets.ModelViewSet):
    queryset = Invoice.objects.all().order_by('id')
    serializer_class = InvoiceSerializer
    pagination_class = CustomPageNumberPagination
    permission_classes = [IsAuthenticated]  # Require authenticated users

    def create(self, request, *args, **kwargs):
        try:
            data = request.data
            patient_visit_id = data.get('patient_visit')
            items = data.get('items')
            total_amount = data.get('total_amount')

            due_date = None
            due_date_str = request.data.get('due_date')
            if due_date_str:
                due_date = timezone.make_aware(datetime.datetime.strptime(due_date_str, '%Y-%m-%d %H:%M'))

            # Create Invoice instance
            # The code block `with transaction.atomic():` is used to ensure that the database operations within it
            # are executed as a single transaction.
            with transaction.atomic():
                invoice = Invoice.objects.create(patient_visit_id=patient_visit_id, due_date=due_date,
                                                 total_amount=total_amount)

                # Create InvoiceItem instances and associate with the created Invoice
                for item_data in items:
                    description = item_data.get('description')
                    quantity = item_data.get('quantity')
                    unit_price = item_data.get('unit_price')
                    InvoiceItem.objects.create(invoice=invoice, description=description, quantity=quantity,
                                               unit_price=unit_price)

            return Response({'success': True}, status=status.HTTP_201_CREATED)
        except Exception as e:
            print(e)
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def partial_update(self, request, *args, **kwargs):
        try:
            invoice_id = kwargs.get('pk')
            invoice = get_object_or_404(Invoice, pk=invoice_id)

            data = request.data

            # Update due_date and total_amount if provided
            if 'due_date' in data:
                due_date_str = data['due_date']
                if due_date_str:
                    invoice.due_date = due_date_str

            if 'total_amount' in data:
                invoice.total_amount = data['total_amount']

            invoice.save()

            # Update or create InvoiceItem instances
            items = data.get('items', [])
            for item_data in items:
                item_id = item_data.get('id')
                description = item_data.get('description')
                quantity = item_data.get('quantity')
                unit_price = item_data.get('unit_price')

                if item_id:
                    # Update existing InvoiceItem
                    invoice_item = get_object_or_404(InvoiceItem, pk=item_id)
                    invoice_item.description = description
                    invoice_item.quantity = quantity
                    invoice_item.unit_price = unit_price
                    invoice_item.save()
                else:
                    # Create new InvoiceItem
                    InvoiceItem.objects.create(invoice=invoice, description=description, quantity=quantity, unit_price=unit_price)

            return Response({'success': True}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    """
    This function retrieves all invoices associated with a specific patient and returns a
    paginated response.

    :param request: The request object contains information about the current HTTP request, such as
    the headers, body, and query parameters
    :param pk: The "pk" parameter in the code refers to the primary key of the patient for whom the
    invoices are being retrieved. It is used to filter the invoices based on the patient's primary key
    :return: The code is returning a paginated response containing a list of serialized invoice data
    for a specific patient. If no invoices are found for the patient, it will return a response with a
    count of 0 and an empty list of results.
    """

    @action(detail=True, methods=["get"], url_path="invoice-patient")
    def invoices_for_patient(self, request, pk=None):
        try:
            invoices = Invoice.objects.filter(patient_visit__patient=pk)

            # Paginate the response using the main list pagination class
            page = self.paginate_queryset(invoices)
            serializer = self.get_serializer(page, many=True)

            return self.get_paginated_response(serializer.data)
        except Invoice.DoesNotExist:
            return Response(
                {
                    "count": 0,
                    "next": None,
                    "previous": None,
                    "results": []
                })


class InvoiceItemViewSet(viewsets.ModelViewSet):
    queryset = InvoiceItem.objects.all().order_by('id')
    serializer_class = InvoiceItemSerializer
    pagination_class = CustomPageNumberPagination
    permission_classes = [IsAuthenticated]  # Require authenticated users
