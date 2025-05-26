from django.contrib.auth.forms import UserChangeForm, UserCreationForm

from .models import CustomUser


class CustomUserCreationForm(UserCreationForm):
	class Meta:
		model = CustomUser
		fields = ("phone_number",)


class CustomUserChangeForm(UserChangeForm):
	class Meta:
		model = CustomUser
		fields = ("phone_number",)
