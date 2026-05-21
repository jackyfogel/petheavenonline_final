from django.db import models
from django.contrib.auth.models import User


class Memorial(models.Model):
    SPECIES_CHOICES = [
        ('Dog', 'Dog'),
        ('Cat', 'Cat'),
        ('Bird', 'Bird'),
        ('Rabbit', 'Rabbit'),
        ('Hamster', 'Hamster'),
        ('Fish', 'Fish'),
        ('Reptile', 'Reptile'),
        ('Horse', 'Horse'),
        ('Other', 'Other'),
    ]
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='memorials')
    slug = models.SlugField(max_length=120, unique=True)
    pet_name = models.CharField(max_length=100)
    species = models.CharField(max_length=20, choices=SPECIES_CHOICES)
    breed = models.CharField(max_length=100, blank=True)
    birth_date = models.DateField(null=True, blank=True)
    passing_date = models.DateField()
    photo = models.ImageField(upload_to='memorials/photos/')
    epitaph = models.CharField(max_length=150)
    story = models.TextField()
    owner_name = models.CharField(max_length=100)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    candle_count = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.pet_name

    def get_absolute_url(self):
        return f'/memorial/{self.slug}/'


class MemorialTrait(models.Model):
    memorial = models.ForeignKey(Memorial, on_delete=models.CASCADE, related_name='traits')
    trait = models.CharField(max_length=50)

    def __str__(self):
        return self.trait


class TimelineMilestone(models.Model):
    memorial = models.ForeignKey(Memorial, on_delete=models.CASCADE, related_name='timeline')
    date = models.CharField(max_length=50)
    description = models.CharField(max_length=200)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f'{self.date}: {self.description}'


class GalleryPhoto(models.Model):
    memorial = models.ForeignKey(Memorial, on_delete=models.CASCADE, related_name='gallery')
    photo = models.ImageField(upload_to='memorials/gallery/')
    caption = models.CharField(max_length=200, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f'Photo for {self.memorial.pet_name} ({self.order})'


class Tribute(models.Model):
    memorial = models.ForeignKey(Memorial, on_delete=models.CASCADE, related_name='tributes')
    author_name = models.CharField(max_length=100)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'Tribute from {self.author_name} for {self.memorial.pet_name}'


class Scene(models.Model):
    title = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    background = models.CharField(max_length=200)
    ambient_color = models.CharField(max_length=7)
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.title


class Placement(models.Model):
    scene = models.ForeignKey(Scene, on_delete=models.CASCADE, related_name='placements')
    memorial = models.OneToOneField(Memorial, on_delete=models.CASCADE, related_name='placement')
    slot_index = models.PositiveIntegerField()

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['scene', 'slot_index'], name='unique_scene_slot')
        ]

    def __str__(self):
        return f'{self.memorial.pet_name} in {self.scene.title} slot {self.slot_index}'
