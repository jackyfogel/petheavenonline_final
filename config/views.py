from django.http import HttpResponse
from django.conf import settings


def frontend(request):
    index_path = settings.BASE_DIR / 'dist' / 'index.html'
    with open(index_path, 'rb') as f:
        return HttpResponse(f.read(), content_type='text/html')
