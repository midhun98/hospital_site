from django.urls import path
from . import views

urlpatterns = [
    path('api/appointments/', views.AppointmentView.as_view(), name='appointment-view'),
    path('api/appointments/<int:pk>/', views.AppointmentModify.as_view(), name='appointment-modify'),
    path('api/message/', views.ContactMessage.as_view(), name='message-view'),
]