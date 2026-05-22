# SESSION.md

## Last completed step

Phase 6D.3 — Wire Browse page to show real memorials from the database

---

## What was done

### Phase 6D.3 — Browse page wired to real data (completed)

- `config/views.py` — `browse_view` rewritten: queries `Memorial.objects.filter(status='approved')` with `prefetch_related('traits')`; converts DB records to the same dict shape as static MEMORIALS (`name`, `born`, `passed`, `photo` URL, `traits` list, etc.); merges DB records first then static fallback (deduped by slug); `featured` = top 3 of the full unfiltered merged list sorted by year desc; applies server-side species filter (`?species=Dog`), name search (`?q=`), and sort (`?sort=newest/oldest/visited`); passes `active_species`, `q`, `sort` back to template
- `templates/browse.html` — species pills changed from `<button>` to `<a>` links; each pill href includes current `sort` and `q` params so switching species preserves other state; `pill--active` applied server-side via `{% if active_species == '...' %}`; sort and search wrapped in `<form method="get" style="display:contents">` with hidden `species` input to preserve filter; sort select pre-selected from context; search input pre-filled with `{{ q }}`; `onchange="this.form.submit()"` on sort; `{% empty %}` block renders "No memorials found" when list is empty

### Phase 6D.1 — Real memorial creation (completed)

- `memorials/forms.py` — NEW: `MemorialForm` ModelForm with fields: pet_name, species, breed, birth_date, passing_date, photo, epitaph, story, owner_name; story overridden as not-required to match wizard UX
- `config/views.py` — updated `create_view`: GET renders form; POST validates, saves Memorial (with user + pending status + auto-slug), saves traits (getlist), timeline milestones (parallel date/desc lists), gallery photos; redirects to success page on save; added `create_success_view`
- `config/urls.py` — added `create/success/<slug>/` URL mapping to `create_success_view`
- `templates/create.html` — wrapped `#create-stage` in a real `<form method="post" enctype="multipart/form-data">` with `{% csrf_token %}`; added `{% if form.errors %}` banner listing field errors
- `static/js/create.js` — added `galleryFiles: []` to `fd`; gallery listener now stores actual `File` objects in `fd.galleryFiles`; `handleSubmit()` replaced: builds a `FormData` from `fd` (including photo/gallery File objects, traits list, timeline date/desc pairs), POSTs to `/create/` via `fetch`, navigates to success URL on redirect or shows alert on error
- `templates/create_success.html` — NEW: confirmation page extending base.html; shows pet name + pending status; links to preview (`/memorial/<slug>/`), create another (`/create/`), home (`/`)

### Phase 6C — Django models (completed)

- `memorials` app created (`python manage.py startapp memorials`)
- `memorials/models.py` — 7 models:
  - `Memorial`: user FK, slug, pet_name, species (9 choices), breed, birth_date, passing_date, photo (ImageField), epitaph, story, owner_name, status (pending/approved/rejected), candle_count, timestamps; `get_absolute_url()` returns `/memorial/{slug}/`
  - `MemorialTrait`: FK to Memorial, trait CharField
  - `TimelineMilestone`: FK to Memorial, date/description/order
  - `GalleryPhoto`: FK to Memorial, photo ImageField, caption, order
  - `Tribute`: FK to Memorial, author_name, message, created_at
  - `Scene`: title, slug, background path, ambient_color, order, is_active
  - `Placement`: FK to Scene, OneToOne to Memorial, slot_index; unique_together on scene+slot_index
- `memorials/admin.py` — all models registered; MemorialAdmin has trait/timeline/gallery inlines
- `config/settings.py` — added `'memorials'` to INSTALLED_APPS; added `MEDIA_URL = '/media/'` and `MEDIA_ROOT = BASE_DIR / 'media'`
- `requirements.txt` — added `Pillow==12.2.0`
- `memorials/migrations/0001_initial.py` — generated and applied

### Full Django template conversion (completed)

Killed the Vite SPA client-side router. All pages now rendered server-side via Django templates.

**New static assets:**
- `static/css/main.css` — all site CSS (from `src/style.css`); removed `height:100%; overflow:hidden` from base `html,body` rule; added `.auth-error-box`
- `static/js/scene.js` — self-contained IIFE; inlines SCENES (3) and MEMORIALS (15, minimal fields); renders homepage markers + preview cards; no ES module imports
- `static/js/browse.js` — IIFE; captures pre-rendered `.browse-card` elements by data attributes; filters/sorts in-place on pill click, sort change, search input
- `static/js/contact.js` — IIFE; attaches submit handler to `#contact-form`; validates + shows `#contact-success` on success
- `static/js/create.js` — IIFE; 5-step wizard targeting `#create-stage`; same logic as `src/create.js`

**Templates (all new):**
- `templates/base.html` — `{% load static %}`, links `main.css`, body class blocks (`footer--fixed` / `footer--inline`), auth-aware nav, hamburger JS inline, `extra_scripts` block
- `templates/home.html` — `footer--fixed` body class, `extra_head` injects homepage-only overflow CSS, loads `scene.js`
- `templates/memorial.html` — server-rendered with `m` dict; handles `not_found` 404 path; `gallery_range` for grid; iterates `m.traits` and `m.timeline`
- `templates/browse.html` — pre-renders all 15 memorial cards with `data-species/passed/name` attrs; loads `browse.js`
- `templates/create.html` — `#create-stage` div; loads `create.js`
- `templates/contact.html` — full form pre-rendered; `{% csrf_token %}`; loads `contact.js`
- `templates/account.html` — uses `{{ initials }}`, `{{ user.get_full_name }}`, `{{ user.date_joined }}`
- `templates/terms.html`, `templates/privacy.html` — static content, hard-coded

**Config:**
- `config/views.py` — full Python MEMORIALS list (15 entries); `home_view`, `memorial_view`, `browse_view`, `create_view`, `contact_view`, `account_view` (`@login_required`), `terms_view`, `privacy_view`; removed `frontend()`
- `config/urls.py` — explicit path for every page; removed `re_path(r'^.*$', frontend)` catch-all; kept `/assets/` serve and `accounts.urls` include
- `config/settings.py` — added `BASE_DIR / 'static'` to `STATICFILES_DIRS`; fixed `LOGIN_URL` to `/login/`

### Phase 6B.1 + 6B.2 — Django authentication (completed)

- `accounts` app created (`python manage.py startapp accounts`)
- `accounts/forms.py` — `RegisterForm`: full_name, email (unique), password, confirm; validates match + email uniqueness
- `accounts/views.py` — `register_view`, `login_view`, `logout_view`, `welcome_view`
  - Register: creates User with `username=email`, auto-logs in, redirects to `/welcome`
  - Login: authenticates by email (username field), redirects to `/`
  - Logout: clears session, redirects to `/`
- `accounts/urls.py` — paths for `/register`, `/login`, `/logout`, `/welcome`
- `config/urls.py` — `include('accounts.urls')` inserted before catch-all
- `config/settings.py` — added `'accounts'` to `INSTALLED_APPS`; `templates/` to `TEMPLATES DIRS`; `LOGIN_URL`, `LOGIN_REDIRECT_URL`, `LOGOUT_REDIRECT_URL`
- `templates/base.html` — nav (with auth-aware Sign In / My Account), footer, hamburger, all inline CSS
- `templates/accounts/register.html` — form with field errors, terms/privacy links
- `templates/accounts/login.html` — form with error message
- `templates/accounts/welcome.html` — 3 action cards (Create, Explore, Browse)

### Phase 6A.4 — Production config for Render (completed)

- `requirements.txt` regenerated (UTF-8); added gunicorn 26, whitenoise 6.12, dj-database-url 3.1.2, python-dotenv 1.2.2
- `config/settings.py` updated:
  - `load_dotenv()` loads `.env` for local dev
  - `DEBUG` and `SECRET_KEY` read from env vars
  - `ALLOWED_HOSTS` includes `.onrender.com` and production domains
  - `DATABASES` uses `dj_database_url.config()` with local PostgreSQL fallback
  - `WhiteNoiseMiddleware` added after `SecurityMiddleware`
  - `STATICFILES_STORAGE` set to `CompressedManifestStaticFilesStorage`
  - `CSRF_TRUSTED_ORIGINS` added for production domains
- `render.yaml` created: web service + free PostgreSQL, gunicorn start command, env vars
- `build.sh` created: pip install → npm install → npm build → collectstatic → migrate
- `.env` created for local dev (gitignored)

### Phase 6A.3 — Django serves Vite frontend (completed)

- `config/views.py` created: `frontend()` reads `dist/index.html` and returns it as `text/html`
- `config/urls.py` updated:
  - `admin/` → Django admin (unchanged)
  - `^assets/(.*)` → `django.views.static.serve` from `dist/assets/` — serves JS, CSS, and all images
  - `^.*$` → `frontend()` catch-all — handles `/`, `/memorial/:slug`, `/browse`, `/create`, etc.
- Build: `npm run build` → `dist/` contains index.html + assets/
- Server: `.\venv\Scripts\python manage.py runserver` → full site at localhost:8000

### Django backend initialization (completed)

- Python venv created at `venv/` (added to `.gitignore`)
- Installed Django 6.0.5 + psycopg2-binary 2.9.12; `requirements.txt` generated
- Django project created via `django-admin startproject config .` — `manage.py` + `config/` in project root
- `config/settings.py` configured:
  - `SECRET_KEY` via `DJANGO_SECRET_KEY` env var with local fallback
  - `DEBUG = True`, `ALLOWED_HOSTS = ['localhost', '127.0.0.1']`
  - PostgreSQL: db `petheavenonline`, user `postgres`, pw `postgres`, host `localhost:5432`
  - `TIME_ZONE = 'America/New_York'`
  - `STATIC_URL = '/static/'`, `STATICFILES_DIRS = [BASE_DIR / 'dist']`, `STATIC_ROOT = BASE_DIR / 'staticfiles'`
- All Django built-in migrations applied (`auth`, `admin`, `contenttypes`, `sessions`)
- `python manage.py check` — 0 issues



### Phase 1 (completed)
- Static single-scene homepage with 16:9 composition and ambient letterboxing
- 5 hardcoded markers per scene with authored percentage positions and depth scale
- Marker click → tomb focus → anchored preview card with fake memorial data and entrance animation
- 3-scene navigation: soft slide/fade transition, keyboard arrows, touch swipe, restrained nav arrows
- Portrait/mobile responsive: authored `slotsPortrait` per scene, compact preview card on narrow viewports
- Depth polish: ground shadow on markers, scale+opacity harmony, subtle vignette, quieter active state

### Phase 2 (completed)
- Moved scene data to `src/data/scenes.js`
- Moved memorial content to `src/data/memorials.js` (keyed by ID)
- Slots reference memorials by `memorialId` instead of embedding data
- Each memorial has a `slug`; "Enter Memorial" is an anchor with `href="/memorial/${slug}"`
- Scene indicator added then later removed

### Phase 3 (completed)
- Memorial detail page rendered via `window.location.pathname` detection in `main.js`
- Homepage code wrapped in `initHomepage()`; memorial route calls `renderMemorialPage(slug)`
- Full lavender-themed memorial page with 8 sections (see below)
- Real background image wired for scene 1: `meadow-dawn.webp` in `public/assets/scenes/`

### Phase 4 (completed)

- Browse Memorials page at `/browse`
- Featured strip: 3 most recently passed memorials shown as cards at top
- Species filter pills: All, Dogs, Cats, Birds, Other — real-time filtering
- Sort dropdown: Newest first, Oldest first, Most visited (alphabetical proxy)
- Name search input — real-time, combined with active species filter
- Horizontal list cards: circular photo, name, breed/species, dates, italic epitaph, chevron
- Empty state message when no results match
- All 15 memorials enriched with `species` field in memorials.js
- Nav Browse link updated from `#` to `/browse`
- Solid nav + inline footer consistent with other content pages

### Homepage mobile scene layout (completed)

- `fitScene()` now detects mobile (<768px): sets scene to `position:absolute; top:54px; left:0; right:0; bottom:0` — fills viewport below nav, no letterbox
- Desktop path resets those overrides then applies 16:9 letterbox as before
- `isMobile()` helper added inside `initHomepage()`
- `renderMarkers()` splits into `renderDesktopMarkers()` (unchanged) and `renderMobileMarkers()` (new)
- Mobile markers rendered in `.mobile-marker-track` — horizontal flex with `overflow-x:auto`, `scroll-snap-type:x mandatory`, edge fade mask, 130px tombstones
- `activateMobileMarker()` — preview card positioned centered above track (`.preview-card--mobile`)
- `clearMarkers()` also removes `.mobile-marker-track` element
- Resize handler now also re-renders when crossing the 768px mobile threshold
- `touchend` swipe-to-switch-scene ignores events originating from inside the scroll track
- CSS: `#scene { background-size: cover }` on mobile; `.mobile-marker-track`, `.mobile-marker-item`, `.preview-card--mobile` styles added

### Mobile responsive pass (completed)

- Hamburger menu: button in nav, slide-in panel from right, overlay dismiss, close button — hidden on desktop via CSS, shown at ≤768px
- Homepage: hero headline wraps + reduces to 19px at 480px; tombstones reduce to 120px height with smaller photo/text; nav arrow tap targets enlarged; portrait slots already wired in JS
- Memorial detail: hero photo 140px → 100px at 768px; name 44px → 30px/26px; gallery 3-col → 2-col; section padding tightened to 16px sides
- Browse: filter pills horizontally scrollable (no-wrap) at 768px; list cards stack vertically; chevron hidden in vertical layout
- Account: profile header stacks vertically; edit button full-width; card actions horizontal at 480px
- Auth pages: max-width dropped, full-width padding at 768px; button min-height 44px
- Create/Contact/Legal: side padding confirmed at 16px min
- CSS added: hamburger + mobile menu styles + @media (max-width: 768px) + @media (max-width: 480px) blocks

### Scene backgrounds — scenes 2 and 3 (completed)

- Scene 2: id → `sunset-lake`, title → "Sunset Lake", `background: "/assets/scenes/sunset-lake.webp"`, `ambientColor: "#e8b078"`
- Scene 3: id → `twilight-garden`, title → "Twilight Garden", `background: "/assets/scenes/twilight-garden.webp"`, `ambientColor: "#b8a5d4"`
- Marker overlay text switched from dark-on-white-shadow to warm-white-on-dark-shadow so names and dates read clearly against all three scene backgrounds

### Login and Register auth pages (completed)

- `/login` and `/register` routes added; handled by `src/auth.js` (`initLoginPage`, `initRegisterPage`)
- Login: email + password fields, validation, fake submit → redirect to /account; "Forgot password?" → /forgot-password; link to /register
- Register: full_name, email, password (min 8), password_confirm fields; validation for all fields + length + match; fake submit → success message → redirect to /account after 2s; Terms/Privacy links in disclaimer; link to /login
- Nav "My Account" replaced with "Sign In" → /login (logged-in state deferred to Django)
- Shared `.auth-*` CSS — max-width 450px, same input style as create/contact forms, full-width pill button

### Terms and Privacy legal pages (completed)

- `/terms` and `/privacy` routes added
- Single `src/legal.js` module handles both pages via `initLegalPage(type)`
- Terms: 10 sections (Acceptance, Description, Accounts, Content, Prohibited, IP, Liability, Termination, Changes, Contact)
- Privacy: 9 sections (Collection, Usage, Photos, Cookies, Retention, Rights, Children, Changes, Contact)
- Placeholder text throughout; "Last updated: May 2026" on both
- Shared `.legal-*` CSS — max-width 700px, Inter body text, Lora title, 1.75 line-height, dividers between sections
- Footer updated with Terms and Privacy links; `pointer-events: auto` added for `footer--inline` so links are clickable on content pages

### Account / Profile page (completed)

- `/account` route added — calls `initAccountPage()` from `src/account.js`
- Profile header: "SM" avatar circle, name "Sarah Mitchell", email, member since April 2026, "Edit profile" button
- My Memorials section: 3 horizontal cards (Buddy, Luna, Oscar) with circular photo, name, dates, epitaph, status badge (Live / Pending review), and View / Edit action links
- "Create new memorial" button linking to `/create`
- Settings section: Change password, Email notifications toggle (functional UI, fake), Delete account (red)
- Nav "My Account" link added after Contact in `index.html`
- Consistent lavender palette, Lora/Inter fonts, solid nav, inline footer

### Nav + footer fix (completed)

- Homepage: nav stays semi-transparent; footer fixed to viewport bottom (`footer--fixed` body class)
- Content pages (/memorial, /create, /contact): nav solid `#f0edf5` with dark lavender text; footer flows with document (`footer--inline` body class)
- Body classes set in `main.js` route detection; CSS uses `body.nav--solid` and `body.footer--fixed/inline` selectors
- No changes to page layouts or any other functionality

### Contact page (completed)

- `/contact` route added — replaces mailto link in nav
- Form fields: name, email, subject (dropdown), message — all required
- Validation on submit; email format check
- Success state shows confirmation with entered email interpolated
- "Back to home" link on success state
- Consistent with site palette, nav, footer, fonts

### Phase 5 (completed)

- Create Memorial page at `/create` — 5-step wizard form
- Step 1: pet name, species, breed, birth/passing dates, photo upload with live preview
- Step 2: epitaph (100-char limit with counter), story textarea
- Step 3: trait tag input (Enter to add, × to remove), repeatable timeline rows
- Step 4: multi-file gallery upload with grid preview
- Step 5: owner name, email, live preview hero card, submit
- Photo upload is required (step 1 validation); dropzone turns red if skipped; hint text shown below
- On submit: success screen with pet name + email interpolated into confirmation copy; "Preview your memorial" link + "Back to home" link
- Validation on steps 1, 2, 5; XSS-safe via `esc()` helper
- Form field names match Django model (`pet_name`, `species`, `birth_date`, etc.)
- Routing: `/create` detected in `main.js`, calls `initCreatePage()` from `src/create.js`
- Nav "Create Memorial" link updated from `#` to `/create`
- Lavender palette, Lora/Inter fonts — consistent with memorial page

### Additional tasks completed (no phase number assigned)

#### Memorial hero background
- `heaven-hero.webp` set as background image on `.mem-hero`
- Layered lavender overlay: 55% opacity at top → fully opaque at bottom, blends into page
- Soft white text-shadow added to `.mem-hero-name` for readability against clouds

#### Homepage headline icons
- SVG paw prints added on each side of the headline, heart at the end
- Icons inherit text color (#3d2e1e), 0.65 opacity, vertically aligned with text

#### Slot layout refinements
- Nav padding increased from 28px to 36px to prevent edge clipping
- Slot x positions spread wider across all 3 scenes: 13 / 31 / 50 / 69 / 87 (landscape + portrait)
- Previous edge fix (slot-1 ~22%, slot-5 ~79%) superseded by wider spread

#### Tombstone marker upgrade (final size)
- Marker height increased again to 200px; preview card offset raised to 215px
- Pet photo circle enlarged to 50px; name font 14px; dates font 12px; overlay padding-top 30px
- Hero headline moved from `top: 18%` to `top: 9%` to prevent overlap with taller tombstones

#### Tombstone marker upgrade (initial)
- Replaced CSS rectangle markers with real tombstone image at `/assets/markers/tombstone.webp`
- Marker height increased from 70px to 140px; preview card offset raised to 155px to clear taller stone
- Added pet info overlay on each tombstone: circular pet photo (32px), name, birth–passing years
- Slot `y` values nudged down ~4% across all 3 scenes to keep larger stones on the grass

#### Real pet photos
- Photos placed in `public/assets/memorials/` as `mem-buddy.webp` through `mem-milo.webp` (5 scene-1 pets)
- `photo` field added to 5 memorials in `memorials.js`
- Circular overlay photo uses `object-fit: cover`, renders placeholder circle for memorials without a photo

#### Public folder restructure
- Moved all assets into `public/assets/scenes/`, `public/assets/markers/`, `public/assets/memorials/`
- All path references updated throughout codebase; old `public/scenes/` and `public/markers/` removed

#### Homepage UI additions
- Fixed nav bar: PetHeavenOnline (Lora), Browse, Create Memorial, Contact (mailto link)
- Headline on scene: "A peaceful place to remember them" in dark warm brown (#3d2e1e), Lora serif
- Tagline and CTA button added then removed; headline now stands alone
- Nav arrows replaced with thin SVG chevrons (0.40 opacity at rest, 0.80 on hover, 0.15 when muted)
- Footer: "© 2026 PetHeavenOnline", fixed bottom, very subtle (0.45 opacity white)
- Scene name indicator removed entirely
- Google Fonts loaded: Lora (headings, brand) and Inter (body, nav)

#### Memorial detail page — full rebuild (lavender theme)
- Palette: bg #f0edf5, accent #d5cde5, mid #9a89b5, dark #5e4f76, text #2e2640
- Hero: gradient background, large circular pet photo (140px), "In Loving Memory of", name (Lora 44px), dates, italic epitaph, "Created by [owner]"
- 8 sections: About (story + trait tags), Memories (3-col photo grid), Life Timeline (vertical with dots), Light a Candle (count + candle icons + button), Send a Virtual Flower (3 options), Tributes (3 mock entries with avatars), Share This Memorial (buttons + QR placeholder)
- All 15 memorials enriched: scene-1 five get full `owner`, `story`, `traits`, `timeline`; remaining ten get `owner` + `story`
- Graceful fallback for unknown slug (not-found message)
- "← Back to garden" link at top of hero
- `renderMemorialPage()` completely rebuilt; all old `.memorial-*` CSS replaced with `.mem-*` lavender styles

---

## Files changed (cumulative)

- `src/account.js` — NEW: account/profile page
- `src/main.js` — route detection, homepage init, full memorial page render, tombstone overlay, hero text, SVG arrows
- `src/style.css` — all homepage and memorial page styles; nav, footer, hero, chevrons, full `.mem-*` system; create/contact/browse page styles appended
- `src/create.js` — NEW: full 5-step create memorial wizard
- `src/contact.js` — NEW: contact form with validation and success state
- `src/browse.js` — NEW: browse page with featured strip, filter/sort/search, card list
- `src/data/memorials.js` — `species` field added to all 15 memorials
- `src/data/scenes.js` — 3 scenes with updated slot y values, portrait slots, background image path
- `src/data/memorials.js` — 15 memorial records with slugs, photos, owner, story, traits, timeline
- `index.html` — Google Fonts, nav bar, footer; Create Memorial link updated to /create
- `public/assets/scenes/meadow-dawn.webp` — real scene background
- `public/assets/markers/tombstone.webp` — tombstone marker image
- `public/assets/memorials/mem-buddy.webp` through `mem-milo.webp` — 5 pet photos

---

## What to test (most recent additions — Phase 6D.1 real memorial creation)

- Start server: `.\venv\Scripts\python manage.py runserver`
- Log in (register if needed), navigate to `/create/`
- Complete the 5-step wizard:
  - Step 1: enter pet name, species, breed, dates; upload a photo
  - Step 2: enter epitaph and story
  - Step 3: add 1–2 trait tags (press Enter); add a timeline milestone
  - Step 4: upload 1–2 gallery photos (optional)
  - Step 5: enter owner name and email; click "Create Memorial"
- After submit, should redirect to `/create/success/<slug>/` with "Memorial Created!" and the pet's name
- Verify links on success page: "View preview" opens `/memorial/<slug>/`, "Create another" goes to `/create/`, "Back to home" goes to `/`
- The memorial detail page at `/memorial/<slug>/` will show not-found (it still uses the static MEMORIALS list) — that's expected until the memorial_view is wired to the DB
- Check Django admin at `/admin/` → Memorials: new record should appear with status=pending, correct fields, traits, timeline milestones, gallery photos
- Check that photo uploaded to `media/memorials/photos/`; gallery photos to `media/memorials/gallery/`
- Test error case: submit without a photo — should show alert (client-side catches this first)
- Test logged-out redirect: visit `/create/` while logged out → should redirect to `/register/`

## What to test (most recent additions — Django template conversion)

- Start server: `.\venv\Scripts\python manage.py runserver`
- `/` — homepage loads, scene.js renders markers + preview cards, scenes navigate
- `/browse/` — all 15 cards render; species pills, sort, search all filter correctly
- `/memorial/buddy/` — full memorial page with photo, story, traits, timeline
- `/memorial/shadow/` — memorial without photo or traits renders gracefully
- `/memorial/notreal/` — returns 404 page with not-found message
- `/create/` — create wizard renders in `#create-stage`
- `/contact/` — form validation works; success state shows on submit
- `/account/` — redirects to `/login/` when logged out; shows real user data when logged in
- `/terms/`, `/privacy/` — static content pages load
- `/register/`, `/login/`, `/logout/` — auth flows still work
- Nav: auth-aware (Sign In + Register vs My Account + Log Out); hamburger on mobile
- No 404 on any CSS (`/static/css/main.css`) or JS (`/static/js/scene.js` etc.)
- Assets still load: tombstone, scene backgrounds, pet photos (served from `/assets/`)

## What to test (all)

- Homepage: all 3 scenes navigate, markers show tombstone image with photo/name/dates overlay
- Scene 1 markers show real circular pet photos; scenes 2–3 show placeholder circles
- Preview cards appear above tombstones, close correctly
- Nav: brand, Browse, Create Memorial (→ /create), Contact (mailto) all present
- Headline visible in upper scene, dark brown, readable on all 3 scene backgrounds
- Footer barely visible at bottom
- Memorial page: visit `/memorial/buddy` — all 8 sections render, circular hero photo, all content correct
- Memorial page: visit `/memorial/shadow` — renders with story but no photo, 2-item timeline fallback
- Memorial page: visit `/memorial/notreal` — graceful not-found message
- Create page: visit `/create` — 5-step wizard renders with lavender styles
- Create page: step 1 validates pet name, species, passing date; advancing without photo shows red dropzone + error hint
- Create page: step 2 validates epitaph; character counter works
- Create page: step 3 — add/remove trait tags; add/remove timeline rows
- Create page: step 4 — gallery upload shows thumbnails
- Create page: step 5 — owner input updates live preview; validates name + email; submit shows success with pet name + email in message
- Contact page: visit `/contact` — form renders; all fields validate; success shows email confirmation; "Back to home" works
- Nav on homepage: semi-transparent, white text
- Nav on /memorial, /create, /contact, /browse: solid lavender background, dark text, no bleed-through on scroll
- Footer on homepage: fixed to bottom of viewport
- Footer on content pages: flows naturally after page content
- Browse page: featured strip, species pills, sort, search, card list all functional

---

## What remains

- Wire real memorial creation: Django model + form + S3 photo upload
- Account page: show user's real memorials (currently placeholder text)
- Contact form: server-side handling (currently frontend-only)
- Phase 7: Loading states, SEO, analytics, Render deployment
