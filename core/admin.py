from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from core import models
from .forms import CustomUserCreationForm, CustomUserChangeForm
from .models import CustomUser

# Register your models here.
admin.site.register(models.Career)
admin.site.register(models.Document)
admin.site.register(models.Appointment)



class CustomUserAdmin(UserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    filter_horizontal = ('groups', 'user_permissions')

    model = CustomUser
    list_display = ("phone_number", "email", "is_staff", "is_active",)
    list_filter = ("is_staff", "is_active",)
    fieldsets = (
        (None, {"fields": ("phone_number", "email", "password")}),
        ("Personal Info", {"fields": ("first_name", "last_name", "profile_picture", "date")}),
        ("Permissions", {"fields": ("is_staff", "is_active", "groups", "user_permissions")}),
    )
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": (
                "phone_number", "password1", "password2", "is_staff",
                "is_active", "groups", "user_permissions"
            )}
        ),
    )
    search_fields = ("phone_number",)
    ordering = ("phone_number",)

admin.site.register(models.CustomUser, CustomUserAdmin)
