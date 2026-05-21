from django.contrib import admin
from .models import Memorial, MemorialTrait, TimelineMilestone, GalleryPhoto, Tribute, Scene, Placement


class MemorialTraitInline(admin.TabularInline):
    model = MemorialTrait
    extra = 1


class TimelineMilestoneInline(admin.TabularInline):
    model = TimelineMilestone
    extra = 1


class GalleryPhotoInline(admin.TabularInline):
    model = GalleryPhoto
    extra = 1


@admin.register(Memorial)
class MemorialAdmin(admin.ModelAdmin):
    list_display = ('pet_name', 'species', 'user', 'status', 'created_at')
    list_filter = ('status', 'species')
    search_fields = ('pet_name', 'owner_name')
    prepopulated_fields = {'slug': ('pet_name',)}
    inlines = [MemorialTraitInline, TimelineMilestoneInline, GalleryPhotoInline]


@admin.register(Scene)
class SceneAdmin(admin.ModelAdmin):
    list_display = ('title', 'order', 'is_active')
    prepopulated_fields = {'slug': ('title',)}


@admin.register(Placement)
class PlacementAdmin(admin.ModelAdmin):
    list_display = ('scene', 'memorial', 'slot_index')


@admin.register(Tribute)
class TributeAdmin(admin.ModelAdmin):
    list_display = ('memorial', 'author_name', 'created_at')
