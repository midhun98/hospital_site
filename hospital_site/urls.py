"""hospital_site URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('core.urls')),
    path('', include('frontEnd.urls')),
    path('', include('patients.urls')),
    path('', include('invoices.urls')),
    path('froala_editor/', include('froala_editor.urls')),
    path("__debug__/", include("debug_toolbar.urls")),
]

handler401 = 'frontEnd.views.handler401'
handler404 = 'frontEnd.views.handler404'
handler500 = 'frontEnd.views.handler500'

urlpatterns += [
                   path("ckeditor5/", include('django_ckeditor_5.urls'), name="ck_editor_5_upload_file"),
               ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
