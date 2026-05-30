from django.contrib.sitemaps import Sitemap
from django.urls import reverse
from memorials.models import Memorial


class StaticViewSitemap(Sitemap):
    protocol = 'https'

    def items(self):
        return ['home', 'browse', 'create', 'contact']

    def location(self, item):
        return reverse(item)

    def priority(self, item):
        return {'home': 1.0, 'browse': 0.6, 'create': 0.5, 'contact': 0.3}.get(item, 0.5)


class MemorialSitemap(Sitemap):
    protocol = 'https'
    priority = 0.8
    changefreq = 'weekly'

    def items(self):
        return Memorial.objects.filter(status='approved').order_by('-updated_at')

    def lastmod(self, obj):
        return obj.updated_at

    def location(self, obj):
        return obj.get_absolute_url()
