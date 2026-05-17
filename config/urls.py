from django.contrib import admin
from django.urls import path, re_path
from django.conf import settings
from django.views.static import serve
from .views import frontend

urlpatterns = [
    path('admin/', admin.site.urls),
    re_path(r'^assets/(?P<path>.*)$', serve, {'document_root': settings.BASE_DIR / 'dist' / 'assets'}),
    re_path(r'^.*$', frontend),
]
