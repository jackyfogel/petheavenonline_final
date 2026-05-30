from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.http import Http404, HttpResponseForbidden, JsonResponse
from django.views.decorators.http import require_POST
from django.utils.text import slugify
from memorials.forms import MemorialForm, MemorialEditForm
from memorials.models import Memorial, MemorialTrait, TimelineMilestone, GalleryPhoto, Scene, Candle


def _approved_scene_pages():
    """Returns {slug: 1-based scene page number} for all approved memorials."""
    slugs = list(
        Memorial.objects.filter(status='approved')
        .order_by('created_at')
        .values_list('slug', flat=True)
    )
    return {slug: (i // 5 + 1) for i, slug in enumerate(slugs)}


def home_view(request):
    scenes = list(Scene.objects.filter(is_active=True).order_by('order'))
    approved = list(Memorial.objects.filter(status='approved').order_by('created_at'))

    scene_data = []
    for i in range(0, max(len(approved), 1), 5):
        batch = approved[i:i + 5]
        page_index = i // 5
        sc = scenes[page_index] if page_index < len(scenes) else scenes[0] if scenes else None
        scene_data.append({
            'background': sc.background.url if sc and sc.background else '',
            'ambientColor': sc.ambient_color if sc else '#e8d5a8',
            'memorials': [
                {
                    'slug': m.slug,
                    'name': m.pet_name,
                    'born': str(m.birth_date.year) if m.birth_date else '—',
                    'passed': str(m.passing_date.year) if m.passing_date else '—',
                    'epitaph': m.epitaph,
                    'photo': m.photo.url if m.photo else None,
                    'owner': m.owner_name,
                }
                for m in batch
            ],
        })

    return render(request, "home.html", {"scene_data": scene_data})


def memorial_view(request, slug):
    try:
        db_m = Memorial.objects.get(slug=slug)
    except Memorial.DoesNotExist:
        return render(request, "memorial.html", {"not_found": True, "slug": slug}, status=404)

    m = {
        "slug": db_m.slug,
        "name": db_m.pet_name,
        "born": str(db_m.birth_date.year) if db_m.birth_date else "—",
        "passed": str(db_m.passing_date.year) if db_m.passing_date else "—",
        "species": db_m.species,
        "epitaph": db_m.epitaph,
        "photo": db_m.photo.url if db_m.photo else None,
        "owner": db_m.owner_name,
        "story": db_m.story,
        "traits": [t.trait for t in db_m.traits.all()],
        "timeline": [
            {"year": item.date, "event": item.description}
            for item in db_m.timeline.all()
        ],
    }
    is_owner = request.user.is_authenticated and request.user == db_m.user
    scene_pages = _approved_scene_pages()
    scene_page = scene_pages.get(slug)
    candle_count = Candle.objects.filter(memorial=db_m).count()
    if request.user.is_authenticated:
        already_lit = Candle.objects.filter(memorial=db_m, user=request.user).exists()
    else:
        already_lit = bool(
            request.session.session_key and
            Candle.objects.filter(memorial=db_m, session_key=request.session.session_key).exists()
        )
    return render(request, "memorial.html", {
        "not_found": False, "m": m, "gallery_range": range(6),
        "is_owner": is_owner, "scene_page": scene_page,
        "candle_count": candle_count, "already_lit": already_lit,
    })


def browse_view(request):
    species_filter = request.GET.get('species', '').strip()
    q = request.GET.get('q', '').strip()
    sort = request.GET.get('sort', 'newest')

    qs = Memorial.objects.filter(status='approved').prefetch_related('traits')
    all_memorials = []
    for m in qs:
        all_memorials.append({
            'slug': m.slug,
            'name': m.pet_name,
            'born': str(m.birth_date.year) if m.birth_date else '—',
            'passed': str(m.passing_date.year) if m.passing_date else '—',
            'species': m.species,
            'epitaph': m.epitaph,
            'photo': m.photo.url if m.photo else None,
            'owner': m.owner_name,
            'story': m.story,
            'traits': [t.trait for t in m.traits.all()],
        })

    def _year(m):
        try:
            return int(m.get('passed') or 0)
        except (ValueError, TypeError):
            return 0

    featured = sorted(all_memorials, key=_year, reverse=True)[:3]

    if species_filter:
        all_memorials = [m for m in all_memorials if m.get('species') == species_filter]

    if q:
        ql = q.lower()
        all_memorials = [m for m in all_memorials if ql in m.get('name', '').lower()]

    if sort == 'oldest':
        all_memorials.sort(key=_year)
    elif sort == 'visited':
        all_memorials.sort(key=lambda m: m.get('name', '').lower())
    else:
        all_memorials.sort(key=_year, reverse=True)

    scene_pages = _approved_scene_pages()
    for m in all_memorials:
        m['scene_page'] = scene_pages.get(m['slug'])
    for m in featured:
        m['scene_page'] = scene_pages.get(m['slug'])

    return render(request, 'browse.html', {
        'memorials': all_memorials,
        'featured': featured,
        'active_species': species_filter,
        'q': q,
        'sort': sort,
    })


@require_POST
def light_candle_view(request, slug):
    try:
        memorial = Memorial.objects.get(slug=slug)
    except Memorial.DoesNotExist:
        return JsonResponse({'error': 'not found'}, status=404)

    if request.user.is_authenticated:
        already_lit = Candle.objects.filter(memorial=memorial, user=request.user).exists()
        if not already_lit:
            Candle.objects.create(memorial=memorial, user=request.user)
    else:
        if not request.session.session_key:
            request.session.create()
        session_key = request.session.session_key
        already_lit = Candle.objects.filter(memorial=memorial, session_key=session_key).exists()
        if not already_lit:
            Candle.objects.create(memorial=memorial, session_key=session_key)

    count = Candle.objects.filter(memorial=memorial).count()
    return JsonResponse({'already_lit': already_lit, 'count': count})


@login_required(login_url='/register/')
def create_view(request):
    if request.method == 'POST':
        form = MemorialForm(request.POST, request.FILES)
        if form.is_valid():
            memorial = form.save(commit=False)
            memorial.user = request.user
            memorial.status = 'pending'

            base_slug = slugify(memorial.pet_name) or 'memorial'
            slug = base_slug
            counter = 1
            while Memorial.objects.filter(slug=slug).exists():
                slug = f'{base_slug}-{counter}'
                counter += 1
            memorial.slug = slug
            memorial.save()

            for trait in request.POST.getlist('traits'):
                trait = trait.strip()
                if trait:
                    MemorialTrait.objects.create(memorial=memorial, trait=trait)

            dates = request.POST.getlist('timeline_date')
            descs = request.POST.getlist('timeline_desc')
            for i, (date, desc) in enumerate(zip(dates, descs)):
                date = date.strip()
                desc = desc.strip()
                if date or desc:
                    TimelineMilestone.objects.create(
                        memorial=memorial, date=date, description=desc, order=i
                    )

            for idx, photo_file in enumerate(request.FILES.getlist('gallery')):
                GalleryPhoto.objects.create(memorial=memorial, photo=photo_file, order=idx)

            return redirect('create_success', slug=memorial.slug)
    else:
        form = MemorialForm()

    return render(request, 'create.html', {'form': form})


def create_success_view(request, slug):
    try:
        memorial = Memorial.objects.get(slug=slug)
    except Memorial.DoesNotExist:
        return redirect('home')
    return render(request, 'create_success.html', {'memorial': memorial})


@login_required
def edit_view(request, slug):
    try:
        memorial = Memorial.objects.get(slug=slug)
    except Memorial.DoesNotExist:
        raise Http404

    if memorial.user != request.user:
        return HttpResponseForbidden("You do not have permission to edit this memorial.")

    if request.method == 'POST':
        form = MemorialEditForm(request.POST, request.FILES, instance=memorial)
        if form.is_valid():
            m = form.save(commit=False)
            if not request.FILES.get('photo'):
                m.photo = memorial.photo
            m.save()

            memorial.traits.all().delete()
            for trait in request.POST.getlist('traits'):
                trait = trait.strip()
                if trait:
                    MemorialTrait.objects.create(memorial=m, trait=trait)

            memorial.timeline.all().delete()
            dates = request.POST.getlist('timeline_date')
            descs = request.POST.getlist('timeline_desc')
            for i, (date, desc) in enumerate(zip(dates, descs)):
                date = date.strip()
                desc = desc.strip()
                if date or desc:
                    TimelineMilestone.objects.create(memorial=m, date=date, description=desc, order=i)

            remove_ids = [x for x in request.POST.getlist('remove_gallery') if x.isdigit()]
            if remove_ids:
                GalleryPhoto.objects.filter(memorial=m, id__in=remove_ids).delete()

            existing_count = m.gallery.count()
            for idx, photo_file in enumerate(request.FILES.getlist('gallery')):
                GalleryPhoto.objects.create(memorial=m, photo=photo_file, order=existing_count + idx)

            return redirect('memorial', slug=m.slug)

    traits = [t.trait for t in memorial.traits.all()]
    timeline = [{'date': item.date, 'description': item.description} for item in memorial.timeline.all()]
    gallery = [{'id': g.id, 'url': g.photo.url} for g in memorial.gallery.all() if g.photo]

    edit_data = {
        'slug': memorial.slug,
        'pet_name': memorial.pet_name,
        'species': memorial.species,
        'breed': memorial.breed,
        'birth_date': memorial.birth_date.strftime('%Y-%m-%d') if memorial.birth_date else '',
        'passing_date': memorial.passing_date.strftime('%Y-%m-%d') if memorial.passing_date else '',
        'photoUrl': memorial.photo.url if memorial.photo else '',
        'epitaph': memorial.epitaph,
        'story': memorial.story,
        'traits': traits,
        'timeline': timeline,
        'gallery': gallery,
        'owner_name': memorial.owner_name,
    }

    return render(request, 'edit.html', {
        'memorial': memorial,
        'edit_data': edit_data,
    })


def contact_view(request):
    return render(request, "contact.html")


@login_required
def account_view(request):
    user = request.user
    full_name = user.get_full_name()
    if full_name.strip():
        parts = full_name.split()
        initials = parts[0][0].upper() + (parts[-1][0].upper() if len(parts) > 1 else "")
    else:
        initials = user.username[0].upper() if user.username else "?"
    memorials = list(Memorial.objects.filter(user=user).order_by('-created_at'))
    scene_pages = _approved_scene_pages()
    for m in memorials:
        m.scene_page = scene_pages.get(m.slug)
    return render(request, "account.html", {"initials": initials, "memorials": memorials})


def terms_view(request):
    return render(request, "terms.html")


def privacy_view(request):
    return render(request, "privacy.html")
