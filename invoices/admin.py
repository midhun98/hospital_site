from django.contrib import admin

# Register your models here.
from invoices import models
from invoices.models import ServiceCategory, Service

admin.site.register(models.Invoice)


class InvoiceItemAdmin(admin.ModelAdmin):
	list_display = ("invoice", "description", "quantity", "unit_price", "total_price")
	readonly_fields = ("total_price",)


@admin.register(ServiceCategory)
class ServiceCategoryAdmin(admin.ModelAdmin):
	list_display = ('name', 'description')
	search_fields = ('name',)


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
	list_display = ('name', 'category', 'price', 'is_active')
	list_filter = ('category', 'is_active')
	search_fields = ('name', 'category__name')


admin.site.register(models.InvoiceItem, InvoiceItemAdmin)
