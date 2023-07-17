import datetime
from django.contrib.auth.models import AbstractBaseUser, Group, User
from django.db import models
from mptt.models import MPTTModel
from core import utils


class Role(MPTTModel):
    name = models.CharField(max_length=64, blank=False, unique=True,
                            error_messages={'unique': "This name already exists.", }, )
    group = models.ForeignKey(Group, blank=False, null=True, on_delete=models.SET_NULL)
    parent = models.ForeignKey('self', null=True, blank=True, on_delete=models.SET_NULL)

    def __str__(self):
        return "{}".format(self.name)


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    mobile = models.CharField(max_length=10, blank=False, unique=True)
    role = models.ForeignKey(Role, on_delete=models.CASCADE)
    parent = models.ForeignKey('self', null=True, blank=True, on_delete=models.SET_NULL)
    gender = models.IntegerField(choices=utils.gender_choices, default=utils.MALE)
    address = models.TextField(null=True, blank=True)

    def __str__(self):
        return "{}".format(self.user if self.user else "")


class Appointment(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    date = models.DateTimeField(default=datetime.datetime.now())
    message = models.TextField()
    doctor = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='doctor_role', null=True, blank=True)
    subject = models.CharField(max_length=255)


class Enquiries(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField()
    message = models.TextField()
    subject = models.CharField(max_length=255)
