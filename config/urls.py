from django.contrib import admin
from django.urls import path, re_path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve
from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('accounts.urls')),
    path('', views.home_view, name='home'),
    path('browse/', views.browse_view, name='browse'),
    path('create/', views.create_view, name='create'),
    path('create/success/<slug:slug>/', views.create_success_view, name='create_success'),
    path('edit/<slug:slug>/', views.edit_view, name='edit_memorial'),
    path('contact/', views.contact_view, name='contact'),
    path('account/', views.account_view, name='account'),
    path('terms/', views.terms_view, name='terms'),
    path('privacy/', views.privacy_view, name='privacy'),
    path('memorial/<slug:slug>/', views.memorial_view, name='memorial'),
    path('memorial/<slug:slug>/light-candle/', views.light_candle_view, name='light_candle'),
    re_path(r'^assets/(?P<path>.*)$', serve, {'document_root': settings.BASE_DIR / 'dist' / 'assets'}),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
