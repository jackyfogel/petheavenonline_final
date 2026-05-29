from django.core.management.base import BaseCommand
from memorials.models import Scene


class Command(BaseCommand):
    help = 'Seed the three initial scene records (backgrounds uploaded via admin)'

    def handle(self, *args, **options):
        scenes = [
            {'title': 'Meadow Dawn',     'slug': 'meadow-dawn',     'ambient_color': '#e8d5a8', 'order': 1},
            {'title': 'Sunset Lake',     'slug': 'sunset-lake',     'ambient_color': '#e8b078', 'order': 2},
            {'title': 'Twilight Garden', 'slug': 'twilight-garden', 'ambient_color': '#b8a5d4', 'order': 3},
        ]
        for data in scenes:
            _, created = Scene.objects.get_or_create(slug=data['slug'], defaults=data)
            status = 'created' if created else 'already exists'
            self.stdout.write(f"  {data['title']}: {status}")
        self.stdout.write(self.style.SUCCESS('Scenes seeded.'))
