from django.contrib import admin
from django.core.mail import EmailMultiAlternatives
from django.conf import settings
from django.utils.html import escape
from .models import Memorial, MemorialTrait, TimelineMilestone, GalleryPhoto, Tribute, Scene, Placement, Candle
from config.views import _email_subject, _approved_scene_pages


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

    def save_model(self, request, obj, form, change):
        old_status = Memorial.objects.get(pk=obj.pk).status if change else None
        super().save_model(request, obj, form, change)

        if old_status != 'approved' and obj.status == 'approved' and obj.user and obj.user.email:
            try:
                first_name = obj.user.first_name or (obj.user.get_full_name().split()[0] if obj.user.get_full_name() else obj.user.username)
                scene_pages = _approved_scene_pages()
                scene_page = scene_pages.get(obj.slug)

                plain = (
                    f"Hi {first_name},\n\n"
                    f"Great news! Your memorial for {obj.pet_name} has been approved and is now live in our garden.\n\n"
                    f"Visit {obj.pet_name}'s memorial: https://petheavenonline.com/memorial/{obj.slug}/\n\n"
                    + (f"Visit {obj.pet_name} in the garden: https://petheavenonline.com/?scene={scene_page}\n\n" if scene_page else "")
                    + "With warmth,\nThe PetHeavenOnline Team"
                )
                html = (
                    '<div style="font-family:Arial,sans-serif;max-width:600px;color:#2e2640;">'
                    f'<p>Hi {escape(first_name)},</p>'
                    f'<p>Great news! Your memorial for <strong>{escape(obj.pet_name)}</strong> has been approved and is now live in our garden.</p>'
                    f'<p><a href="https://petheavenonline.com/memorial/{obj.slug}/" style="color:#9a89b5;">Visit {escape(obj.pet_name)}\'s memorial</a></p>'
                    + (f'<p><a href="https://petheavenonline.com/?scene={scene_page}" style="color:#9a89b5;">Visit {escape(obj.pet_name)} in the garden</a></p>' if scene_page else '')
                    + '<p>With warmth,<br>The PetHeavenOnline Team</p>'
                    '</div>'
                )
                msg = EmailMultiAlternatives(
                    subject=_email_subject(f"🐾 {obj.pet_name}'s memorial is now live!"),
                    body=plain,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    to=[obj.user.email],
                )
                msg.attach_alternative(html, 'text/html')
                msg.send()
            except Exception as e:
                print(f"Approval email error: {e}")


@admin.register(Scene)
class SceneAdmin(admin.ModelAdmin):
    list_display = ('title', 'order', 'is_active')
    prepopulated_fields = {'slug': ('title',)}


@admin.register(Placement)
class PlacementAdmin(admin.ModelAdmin):
    list_display = ('scene', 'memorial', 'slot_index')


@admin.register(Tribute)
class TributeAdmin(admin.ModelAdmin):
    list_display = ('memorial', 'author_name', 'user', 'is_approved', 'created_at')
    list_filter = ('is_approved',)
    list_editable = ('is_approved',)
    search_fields = ('author_name', 'message')


@admin.register(Candle)
class CandleAdmin(admin.ModelAdmin):
    list_display = ('memorial', 'user', 'session_key', 'created_at')
    list_filter = ('created_at',)
    readonly_fields = ('created_at',)
