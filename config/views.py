import time
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.http import Http404, HttpResponse, HttpResponseForbidden, JsonResponse
from django.views.decorators.http import require_POST
from django.core.mail import EmailMultiAlternatives, BadHeaderError
from django.utils.html import escape
from django.conf import settings
from django.utils.text import slugify
from memorials.forms import MemorialForm, MemorialEditForm
from memorials.models import Memorial, MemorialTrait, TimelineMilestone, GalleryPhoto, Scene, Candle, Tribute


def _email_subject(subject):
    prefix = "[DEV] " if settings.DEBUG else ""
    return f"{prefix}{subject}"


def _base_url():
    return "http://localhost:8000" if settings.DEBUG else "https://petheavenonline.com"


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

    featured_memorials = [
        {
            'slug': m.slug,
            'pet_name': m.pet_name,
            'born': str(m.birth_date.year) if m.birth_date else '—',
            'passed': str(m.passing_date.year) if m.passing_date else '—',
            'photo': m.photo.url if m.photo else None,
        }
        for m in Memorial.objects.filter(status='approved').order_by('-created_at')[:4]
    ]

    return render(request, "home.html", {
        "scene_data": scene_data,
        "featured_memorials": featured_memorials,
    })


def memorial_view(request, slug):
    try:
        db_m = Memorial.objects.get(slug=slug)
    except Memorial.DoesNotExist:
        return render(request, "memorial.html", {"not_found": True, "slug": slug}, status=404)

    if db_m.status != 'approved':
        is_authorized = (
            request.user.is_authenticated and
            (request.user == db_m.user or request.user.is_staff)
        )
        if not is_authorized:
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

    tributes = Tribute.objects.filter(memorial=db_m, is_approved=True).select_related('user')
    user_full_name = ''
    if request.user.is_authenticated:
        user_full_name = request.user.get_full_name().strip() or request.user.username

    gallery_photos = [g.photo.url for g in db_m.gallery.all().order_by('order') if g.photo]

    return render(request, "memorial.html", {
        "not_found": False, "m": m, "gallery_photos": gallery_photos,
        "is_owner": is_owner, "scene_page": scene_page,
        "candle_count": candle_count, "already_lit": already_lit,
        "tributes": tributes, "user_full_name": user_full_name,
        "memorial_status": db_m.status,
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
            if memorial.user and memorial.user != request.user and memorial.user.email:
                try:
                    count = Candle.objects.filter(memorial=memorial).count()
                    owner_first = memorial.user.first_name or (memorial.user.get_full_name().split()[0] if memorial.user.get_full_name() else memorial.user.username)
                    plain = (
                        f"Hi {owner_first},\n\n"
                        f"Someone lit a candle for {memorial.pet_name}. "
                        f"{count} candle{'s have' if count != 1 else ' has'} been lit in {memorial.pet_name}'s memory.\n\n"
                        f"Visit {memorial.pet_name}'s memorial: {_base_url()}/memorial/{slug}/\n\n"
                        "With warmth,\nThe PetHeavenOnline Team"
                    )
                    html = (
                        '<div style="font-family:Arial,sans-serif;max-width:600px;color:#2e2640;">'
                        f'<p>Hi {escape(owner_first)},</p>'
                        f'<p>Someone lit a candle for <strong>{escape(memorial.pet_name)}</strong>. '
                        f'{count} candle{"s have" if count != 1 else " has"} been lit in {escape(memorial.pet_name)}\'s memory.</p>'
                        f'<p><a href="{_base_url()}/memorial/{slug}/" style="color:#9a89b5;">Visit {escape(memorial.pet_name)}\'s memorial</a></p>'
                        '<p>With warmth,<br>The PetHeavenOnline Team</p>'
                        '</div>'
                    )
                    msg = EmailMultiAlternatives(
                        subject=_email_subject(f'🐾 Someone lit a candle for {memorial.pet_name}'),
                        body=plain,
                        from_email=settings.DEFAULT_FROM_EMAIL,
                        to=[memorial.user.email],
                    )
                    msg.attach_alternative(html, 'text/html')
                    msg.send()
                except Exception as e:
                    print(f"Candle notification email error: {e}")
    else:
        if not request.session.session_key:
            request.session.create()
        session_key = request.session.session_key
        already_lit = Candle.objects.filter(memorial=memorial, session_key=session_key).exists()
        if not already_lit:
            Candle.objects.create(memorial=memorial, session_key=session_key)

    count = Candle.objects.filter(memorial=memorial).count()
    return JsonResponse({'already_lit': already_lit, 'count': count})


@login_required(login_url='/login/')
@require_POST
def leave_tribute_view(request, slug):
    try:
        memorial = Memorial.objects.get(slug=slug)
    except Memorial.DoesNotExist:
        raise Http404

    message = request.POST.get('message', '').strip()
    if message:
        author_name = request.user.get_full_name().strip() or request.user.first_name.strip() or 'Anonymous'
        Tribute.objects.create(
            memorial=memorial,
            user=request.user,
            author_name=author_name,
            message=message,
        )
        if memorial.user and memorial.user != request.user and memorial.user.email:
            try:
                owner_first = memorial.user.first_name or (memorial.user.get_full_name().split()[0] if memorial.user.get_full_name() else memorial.user.username)
                plain = (
                    f"Hi {owner_first},\n\n"
                    f"{author_name} left a tribute for {memorial.pet_name}:\n\n"
                    f'"{message}"\n\n'
                    f"View tribute: {_base_url()}/memorial/{slug}/#tributes\n\n"
                    "With warmth,\nThe PetHeavenOnline Team"
                )
                html = (
                    '<div style="font-family:Arial,sans-serif;max-width:600px;color:#2e2640;">'
                    f'<p>Hi {escape(owner_first)},</p>'
                    f'<p><strong>{escape(author_name)}</strong> left a tribute for <strong>{escape(memorial.pet_name)}</strong>:</p>'
                    f'<p style="font-style:italic;border-left:3px solid #d5cde5;padding-left:12px;">&ldquo;{escape(message)}&rdquo;</p>'
                    f'<p><a href="{_base_url()}/memorial/{slug}/#tributes" style="color:#9a89b5;">View tribute</a></p>'
                    '<p>With warmth,<br>The PetHeavenOnline Team</p>'
                    '</div>'
                )
                msg = EmailMultiAlternatives(
                    subject=_email_subject(f'🐾 Someone left a tribute for {memorial.pet_name}'),
                    body=plain,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    to=[memorial.user.email],
                )
                msg.attach_alternative(html, 'text/html')
                msg.send()
            except Exception as e:
                print(f"Tribute notification email error: {e}")

    return redirect(f'/memorial/{slug}/#tributes')


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

            try:
                first_name = request.user.first_name or request.user.get_full_name().split()[0] if request.user.get_full_name() else request.user.username
                plain = (
                    f"Hi {first_name},\n\n"
                    f"Your memorial for {memorial.pet_name} has been submitted and is pending review.\n\n"
                    "We'll notify you once it's been approved and placed in our garden.\n\n"
                    f"You can preview your memorial here: {_base_url()}/memorial/{memorial.slug}/\n\n"
                    "With warmth,\n"
                    "The PetHeavenOnline Team"
                )
                html = (
                    '<div style="font-family:Arial,sans-serif;max-width:600px;color:#2e2640;">'
                    f'<p>Hi {escape(first_name)},</p>'
                    f'<p>Your memorial for <strong>{escape(memorial.pet_name)}</strong> has been submitted and is pending review.</p>'
                    "<p>We'll notify you once it's been approved and placed in our garden.</p>"
                    f'<p><a href="{_base_url()}/memorial/{memorial.slug}/" style="color:#9a89b5;">View preview</a></p>'
                    '<p>With warmth,<br>The PetHeavenOnline Team</p>'
                    '</div>'
                )
                msg = EmailMultiAlternatives(
                    subject=_email_subject(f'🐾 Memorial for {memorial.pet_name} submitted!'),
                    body=plain,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    to=[request.user.email],
                )
                msg.attach_alternative(html, 'text/html')
                msg.send()
            except Exception as e:
                print(f"Memorial confirmation email error: {e}")

            try:
                submitter_name = request.user.get_full_name().strip() or request.user.username
                admin_plain = (
                    f"A new memorial has been submitted and is awaiting review.\n\n"
                    f"Pet: {memorial.pet_name}\n"
                    f"Species: {memorial.species}\n"
                    f"Submitted by: {submitter_name} ({request.user.email})\n\n"
                    f"Review it: {_base_url()}/admin/memorials/memorial/{memorial.id}/change/"
                )
                admin_html = (
                    '<div style="font-family:Arial,sans-serif;max-width:600px;color:#2e2640;">'
                    '<p>A new memorial has been submitted and is awaiting review.</p>'
                    f'<p><strong>Pet:</strong> {escape(memorial.pet_name)}<br>'
                    f'<strong>Species:</strong> {escape(memorial.species)}<br>'
                    f'<strong>Submitted by:</strong> {escape(submitter_name)} ({escape(request.user.email)})</p>'
                    f'<p><a href="{_base_url()}/admin/memorials/memorial/{memorial.id}/change/" style="color:#9a89b5;">Open in admin</a></p>'
                    '</div>'
                )
                admin_msg = EmailMultiAlternatives(
                    subject=_email_subject(f'New memorial submitted: {memorial.pet_name}'),
                    body=admin_plain,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    to=['admin@petheavenonline.com'],
                    cc=['jackyfogel@gmail.com'],
                )
                admin_msg.attach_alternative(admin_html, 'text/html')
                admin_msg.send()
            except Exception as e:
                print(f"Memorial admin notification error: {e}")

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
    if request.method == 'POST':
        # Honeypot — bots fill this, humans never see it
        if request.POST.get('website', ''):
            return JsonResponse({'ok': True})

        # Time check — reject if submitted in under 3 seconds
        try:
            elapsed = time.time() - int(request.POST.get('form_time', 0)) / 1000
            if elapsed < 3:
                return JsonResponse({'ok': True})
        except (ValueError, TypeError):
            pass

        name    = request.POST.get('name', '').strip()
        email   = request.POST.get('email', '').strip()
        subject = request.POST.get('subject', '').strip()
        message = request.POST.get('message', '').strip()

        if not all([name, email, subject, message]):
            return JsonResponse({'ok': False, 'error': 'All fields are required.'})

        plain = f"Name: {name}\nEmail: {email}\nSubject: {subject}\n\n{message}"
        html = (
            '<div style="font-family:Arial,sans-serif;max-width:600px;color:#2e2640;">'
            f'<p><strong>Name:</strong> {escape(name)}</p>'
            f'<p><strong>Email:</strong> <a href="mailto:{escape(email)}" style="color:#9a89b5;">{escape(email)}</a></p>'
            f'<p><strong>Subject:</strong> {escape(subject)}</p>'
            '<p><strong>Message:</strong></p>'
            f'<p style="white-space:pre-wrap;">{escape(message)}</p>'
            '</div>'
        )
        try:
            msg = EmailMultiAlternatives(
                subject=_email_subject(f'[PetHeavenOnline Contact] {subject}'),
                body=plain,
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=['admin@petheavenonline.com'],
                reply_to=[email],
            )
            msg.attach_alternative(html, 'text/html')
            msg.send()
        except (BadHeaderError, Exception):
            return JsonResponse({'ok': False, 'error': 'Failed to send your message. Please try again.'})

        return JsonResponse({'ok': True})

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


def robots_txt_view(request):
    lines = [
        'User-agent: *',
        'Allow: /',
        'Disallow: /admin/',
        'Disallow: /account/',
        'Disallow: /login/',
        'Disallow: /register/',
        'Disallow: /logout/',
        'Disallow: /edit/',
        '',
        'Sitemap: https://petheavenonline.com/sitemap.xml',
    ]
    return HttpResponse('\n'.join(lines), content_type='text/plain')
