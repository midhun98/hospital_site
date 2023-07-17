from django.urls import path
from . import views

urlpatterns = [
    path('api/appointments/', views.AppointmentView.as_view(), name='appointment-view'),
    path('api/careers/', views.CareerAPIView.as_view(), name='appointment-view'),
    path('api/appointments/<int:pk>/', views.AppointmentModify.as_view(), name='appointment-modify'),
    path('api/message/', views.ContactMessage.as_view(), name='message-view'),
    path('api/login/', views.login_api, name='login-api'),
    path('api/logout/', views.logout_api, name='logout-api'),
    path('api/get_current_user/', views.get_current_user, name='logout-api'),
]
