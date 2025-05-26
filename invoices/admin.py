from django.contrib import admin

# Register your models here.
from invoices import models

admin.site.register(models.Invoice)


class InvoiceItemAdmin(admin.ModelAdmin):
	list_display = ("invoice", "description", "quantity", "unit_price", "total_price")
	readonly_fields = ("total_price",)


admin.site.register(models.InvoiceItem, InvoiceItemAdmin)
