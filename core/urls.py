from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter
router = DefaultRouter()

router.register('careers', views.CareerViewSet, basename='career')
urlpatterns = [
    path('api/appointments/', views.AppointmentView.as_view(), name='appointment-view'),
    path('api/appointments/<int:pk>/', views.AppointmentModify.as_view(), name='appointment-modify'),
    path('api/message/', views.ContactMessage.as_view(), name='message-view'),
    path('api/login/', views.login_api, name='login-api'),
    path('api/otplesslogin/', views.otplesslogin, name='otpless-login-api'),
    path('api/logout/', views.logout_api, name='logout-api'),
    path('api/get_current_user/', views.get_current_user, name='logout-api'),
    path('api/get_hospital/', views.HospitalView.as_view(), name='hospital-api'),
    path('api/', include(router.urls)),
]
