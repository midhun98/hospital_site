import datetime
from django.contrib.auth.models import AbstractBaseUser, Group, User, PermissionsMixin
from django.db import models
from mptt.models import MPTTModel
from core.manger import CustomUserManager

class CustomUser(AbstractBaseUser, PermissionsMixin):
    phone_number = models.CharField(max_length=15, unique=True, db_index=True)
    email = models.EmailField(unique=True, null=True, blank=True)
    first_name = models.CharField(max_length=30, blank=True)
    last_name = models.CharField(max_length=30, blank=True)
    profile_picture = models.ImageField(upload_to='profile/', blank=True, null=True)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date = models.DateTimeField(default=datetime.datetime.now())

    USERNAME_FIELD = "phone_number"
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return self.phone_number


class Appointment(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    date = models.DateTimeField(default=datetime.datetime.now())
    message = models.TextField()
    # doctor = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='doctor_role', null=True, blank=True)
    subject = models.CharField(max_length=255)


class Enquiries(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField()
    message = models.TextField()
    subject = models.CharField(max_length=255)


class Career(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField()
    message = models.TextField()
    phone = models.IntegerField()
    date = models.DateTimeField(default=datetime.datetime.now())

class Document(models.Model):
    career = models.ForeignKey(Career, on_delete=models.CASCADE, related_name='documents')
    file = models.FileField(upload_to='documents/')
    uploaded_at = models.DateTimeField(auto_now_add=True)