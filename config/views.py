from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.utils.text import slugify
from memorials.forms import MemorialForm
from memorials.models import Memorial, MemorialTrait, TimelineMilestone, GalleryPhoto

MEMORIALS = [
    {
        "slug": "buddy", "name": "Buddy", "born": "2010", "passed": "2023",
        "species": "Dog", "epitaph": "Loyal beyond measure.",
        "photo": "/assets/memorials/mem-buddy.webp",
        "owner": "The Johnson Family",
        "story": "Buddy came into our lives on a rainy April morning with oversized paws and a heart to match. For thirteen years he was the first face at the door and the last warm presence at the end of every day. He loved long walks, stolen pieces of toast, and sleeping in any patch of sunlight he could find. He left us gently, surrounded by everyone who loved him, and left a quiet in the house that nothing else has filled.",
        "traits": ["Golden Retriever", "Gentle", "Playful", "Loyal", "Loved fetch", "Morning walks"],
        "timeline": [
            {"year": "2010", "event": "Born into the world"},
            {"year": "2010", "event": "Adopted by the Johnson Family"},
            {"year": "2014", "event": "First camping trip to the mountains"},
            {"year": "2023", "event": "Passed away peacefully at home"},
        ],
    },
    {
        "slug": "luna", "name": "Luna", "born": "2015", "passed": "2024",
        "species": "Cat", "epitaph": "She filled every room with light.",
        "photo": "/assets/memorials/mem-luna.webp",
        "owner": "The Park Family",
        "story": "Luna arrived as a tiny tabby kitten and immediately claimed every soft surface in the house as her own. She had a gift for finding the exact spot where she was most needed — curled on a lap during a hard day, pressed warm against your side on a cold night. She was endlessly curious, endlessly affectionate, and left an impression on everyone lucky enough to meet her.",
        "traits": ["Tabby Cat", "Affectionate", "Curious", "Independent", "Lap cat"],
        "timeline": [
            {"year": "2015", "event": "Born into the world"},
            {"year": "2015", "event": "Adopted by the Park Family"},
            {"year": "2019", "event": "Moved to a new home with a sunny window"},
            {"year": "2024", "event": "Passed away peacefully"},
        ],
    },
    {
        "slug": "oscar", "name": "Oscar", "born": "2008", "passed": "2022",
        "species": "Dog", "epitaph": "A gentleman until the very end.",
        "photo": "/assets/memorials/mem-oscar.webp",
        "owner": "The Williams Family",
        "story": "Oscar was the kind of dog who made everyone feel welcome. A dignified Labrador with a gentle soul, he spent fourteen years as the calm center of a busy household — patient with children, kind to strangers, and endlessly forgiving. In his later years he moved more slowly, but his eyes never lost their warmth. He was a gentleman in every sense.",
        "traits": ["Labrador", "Dignified", "Patient", "Kind", "Gentle with children"],
        "timeline": [
            {"year": "2008", "event": "Born into the world"},
            {"year": "2009", "event": "Joined the Williams Family"},
            {"year": "2016", "event": "Won the neighborhood's friendliest dog award"},
            {"year": "2022", "event": "Passed away peacefully at fourteen"},
        ],
    },
    {
        "slug": "daisy", "name": "Daisy", "born": "2012", "passed": "2023",
        "species": "Dog", "epitaph": "Forever chasing sunbeams.",
        "photo": "/assets/memorials/mem-daisy.webp",
        "owner": "The Thompson Family",
        "story": "Daisy was pure joy in dog form. A terrier mix with an unshakeable enthusiasm for life, she approached every morning like it was the best one yet — tail spinning, feet barely touching the ground. She loved gardens, squirrels she never quite caught, and the warmest corner of every room. Eleven years with Daisy felt like a gift, and we smiled every single day.",
        "traits": ["Terrier Mix", "Joyful", "Energetic", "Sunny", "Loves gardens"],
        "timeline": [
            {"year": "2012", "event": "Born into the world"},
            {"year": "2012", "event": "Adopted by the Thompson Family"},
            {"year": "2017", "event": "Featured in the local newspaper's pet column"},
            {"year": "2023", "event": "Passed away after eleven beautiful years"},
        ],
    },
    {
        "slug": "milo", "name": "Milo", "born": "2017", "passed": "2025",
        "species": "Dog", "epitaph": "Small paws, enormous heart.",
        "photo": "/assets/memorials/mem-milo.webp",
        "owner": "The Garcia Family",
        "story": "Milo was small in size and immense in personality. A dachshund with boundless confidence, he never let his height stand in his way. He could be found bossing around dogs three times his size, claiming the best spot on the sofa, or burrowed so deep under the blankets only his nose was visible. He was eight years old when he left us, and the house feels much quieter without him.",
        "traits": ["Dachshund", "Bold", "Affectionate", "Stubborn", "Blanket hoarder"],
        "timeline": [
            {"year": "2017", "event": "Born into the world"},
            {"year": "2017", "event": "Joined the Garcia Family"},
            {"year": "2021", "event": "Overcame a serious illness and bounced back stronger"},
            {"year": "2025", "event": "Passed away peacefully"},
        ],
    },
    {
        "slug": "shadow", "name": "Shadow", "born": "2011", "passed": "2022",
        "species": "Dog", "epitaph": "He walked quietly beside us.",
        "photo": None,
        "owner": "The Davis Family",
        "story": "Shadow was a quiet, faithful companion who never needed much — just to be near his people. He walked beside us for eleven years, steady and undemanding, and left the kind of absence that only a truly good dog can.",
        "traits": [],
        "timeline": [],
    },
    {
        "slug": "maple", "name": "Maple", "born": "2013", "passed": "2024",
        "species": "Cat", "epitaph": "Gentle and curious always.",
        "photo": None,
        "owner": "The Chen Family",
        "story": "Maple had a way of making every corner of the house feel lived-in and loved. Curious about everything, gentle with everyone, she was a constant warm presence for eleven years.",
        "traits": [],
        "timeline": [],
    },
    {
        "slug": "bear", "name": "Bear", "born": "2009", "passed": "2021",
        "species": "Dog", "epitaph": "Brave, warm, and true.",
        "photo": None,
        "owner": "The Morrison Family",
        "story": "Bear earned his name on day one. Big in frame, bigger in heart, he was the kind of dog who made you feel safe just by being in the room. Twelve years of loyalty we will never forget.",
        "traits": [],
        "timeline": [],
    },
    {
        "slug": "willow", "name": "Willow", "born": "2016", "passed": "2025",
        "species": "Cat", "epitaph": "She taught us how to rest.",
        "photo": None,
        "owner": "The Nakamura Family",
        "story": "Willow had mastered the art of stillness. She had her favorite spots and her favorite people, and she devoted herself to both completely. Nine years of quiet, deep companionship.",
        "traits": [],
        "timeline": [],
    },
    {
        "slug": "chester", "name": "Chester", "born": "2007", "passed": "2020",
        "species": "Dog", "epitaph": "Steadfast to the last.",
        "photo": None,
        "owner": "The O'Brien Family",
        "story": "Chester was with us through everything — moves, milestones, losses, and celebrations. For thirteen years he was the constant. We didn't realize how much of the day revolved around him until he was gone.",
        "traits": [],
        "timeline": [],
    },
    {
        "slug": "pearl", "name": "Pearl", "born": "2014", "passed": "2024",
        "species": "Cat", "epitaph": "She shone in every quiet moment.",
        "photo": None,
        "owner": "The Reyes Family",
        "story": "Pearl was a cat of refined tastes and deep affections. She chose carefully who she loved, but when she chose you, she was yours completely. Ten years of grace and warmth.",
        "traits": [],
        "timeline": [],
    },
    {
        "slug": "sandy", "name": "Sandy", "born": "2012", "passed": "2023",
        "species": "Dog", "epitaph": "Always running toward the waves.",
        "photo": None,
        "owner": "The Sullivan Family",
        "story": "Sandy lived for the outdoors. Every beach trip, every park visit, every open window was a gift to her. Eleven years of pure, uncontained joy.",
        "traits": [],
        "timeline": [],
    },
    {
        "slug": "finn", "name": "Finn", "born": "2010", "passed": "2022",
        "species": "Dog", "epitaph": "Free and joyful every single day.",
        "photo": None,
        "owner": "The Anderson Family",
        "story": "Finn had one speed: full. He approached every day, every walk, and every person with the same unbridled enthusiasm. Twelve years of life lived completely and joyfully.",
        "traits": [],
        "timeline": [],
    },
    {
        "slug": "coral", "name": "Coral", "born": "2018", "passed": "2025",
        "species": "Cat", "epitaph": "Too bright, too brief.",
        "photo": None,
        "owner": "The Kim Family",
        "story": "Coral was with us for only seven years, but she packed a lifetime of love into every one of them. Vivid, affectionate, and full of surprises — we are grateful for every moment.",
        "traits": [],
        "timeline": [],
    },
    {
        "slug": "duke", "name": "Duke", "born": "2006", "passed": "2019",
        "species": "Dog", "epitaph": "A long life, well and fully lived.",
        "photo": None,
        "owner": "The Hartman Family",
        "story": "Duke lived to thirteen and earned every grey whisker. He saw us through the best years of our lives, always present, always loyal, always himself. A life well and fully lived.",
        "traits": [],
        "timeline": [],
    },
]

_MEMORIAL_BY_SLUG = {m["slug"]: m for m in MEMORIALS}


def home_view(request):
    return render(request, "home.html")


def memorial_view(request, slug):
    try:
        db_m = Memorial.objects.get(slug=slug)
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
        return render(request, "memorial.html", {"not_found": False, "m": m, "gallery_range": range(6)})
    except Memorial.DoesNotExist:
        pass

    m = _MEMORIAL_BY_SLUG.get(slug)
    if not m:
        return render(request, "memorial.html", {"not_found": True, "slug": slug}, status=404)
    return render(request, "memorial.html", {
        "not_found": False,
        "m": m,
        "gallery_range": range(6),
    })


def browse_view(request):
    species_filter = request.GET.get('species', '').strip()
    q = request.GET.get('q', '').strip()
    sort = request.GET.get('sort', 'newest')

    db_qs = Memorial.objects.filter(status='approved').prefetch_related('traits')
    db_list = []
    for m in db_qs:
        db_list.append({
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

    db_slugs = {m['slug'] for m in db_list}
    static_list = [m for m in MEMORIALS if m['slug'] not in db_slugs]
    all_memorials = db_list + static_list

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

    return render(request, 'browse.html', {
        'memorials': all_memorials,
        'featured': featured,
        'active_species': species_filter,
        'q': q,
        'sort': sort,
    })


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
    return render(request, "account.html", {"initials": initials, "memorials": memorials})


def terms_view(request):
    return render(request, "terms.html")


def privacy_view(request):
    return render(request, "privacy.html")
