from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.views.static import serve
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('core.urls')),
    path('', include('frontEnd.urls')),
    path('', include('patients.urls')),
    path('', include('invoices.urls')),
    path('froala_editor/', include('froala_editor.urls')),
    path("__debug__/", include("debug_toolbar.urls")),
]

urlpatterns += [re_path(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT})]
handler401 = 'frontEnd.views.handler401'
handler404 = 'frontEnd.views.handler404'
handler500 = 'frontEnd.views.handler500'

urlpatterns += [
    path("ckeditor5/", include('django_ckeditor_5.urls'), name="ck_editor_5_upload_file"),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)