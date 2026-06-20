# SESSION.md

## Last completed step

S3 dev/prod upload prefix separation

---

## What was done

### Homepage content section — premium restyle (completed)

- `templates/home.html` — replaced 3 emoji icons (🕯️💜🐾) with thin-line SVG icons using `stroke="#9a89b5"` stroke-width 1.5; candle, heart, and paw outlines
- `static/css/main.css` — full rewrite of home content CSS block: `#home-content` gets unified `background: #FAF9F6` + subtle `border-top`; all section backgrounds removed (no alternating blocks); intro padded 96px 0 80px; tagline 28px / line-height 1.65; steps gap 64px, titles letter-spacing 0.05em, body text `#4a4a4a` weight 300; CTA button uppercase, letter-spacing 0.15em, 11px, hover lift + shadow; featured cards white bg with shadow, lift on hover, gap 20px; responsive at 768px and 480px

### Scene order swap + per-scene height (completed)

- **DB change**: `sunset-lake` order changed from 2 → 1, `meadow-dawn` order changed from 1 → 2 (via Django shell). Sunset Lake is now the landing scene. First 5 approved memorials are now placed on Sunset Lake.
- `static/js/scene.js` — `updateHero()` now also sets `stage.style.height` to `88vh` on scene index 0 and `100vh` on all others, then calls `fitScene()` to recompute scene dimensions. Tombstone positions are percentages of the scene element so they scale correctly at both heights.

### Homepage content section below scene (completed)

- `templates/home.html` — body_class changed to `footer--inline` (page now scrollable); extra_head style changed from `height: 100%; overflow: hidden` to `min-height: 100%` + `#stage { height: 88vh }`; added `#home-content` div (hidden by default) with intro tagline, 3 how-it-works steps, CTA button, and featured memorials grid (up to 4, only shown if any exist)
- `static/js/scene.js` — `fitScene()` now uses `stage.offsetHeight` instead of `window.innerHeight` so 16:9 letterbox calculates against the 88vh stage; `updateHero()` now also toggles `#home-content` visibility (show on scene 1, hide on scenes 2+)
- `config/views.py` — `home_view` adds `featured_memorials` (up to 4 most recent approved, with slug/pet_name/born/passed/photo) to template context
- `static/css/main.css` — added all home content section styles: `.home-intro-section`, `.home-how-section`, `.home-how-steps`, `.home-cta-section`, `.home-cta-btn`, `.home-featured-section`, `.home-featured-grid`, `.home-featured-card` etc.; responsive at 768px and 480px

**Scene height note:** Stage reduced to 88vh. `fitScene()` now uses `stage.offsetHeight` (88vh) as `vh` for the 16:9 calculation. Tombstone positions are percentages of the scene element — they scale proportionally with the scene and are visually unchanged.

### Admin notifications for new registrations and memorials (completed)

- `config/views.py` — after memorial confirmation email in `create_view`, sends admin notification to `admin@petheavenonline.com` CC `jackyfogel@gmail.com`; HTML body includes pet name, species, submitter name/email, and direct admin link; uses `_email_subject` and `_base_url`; wrapped in separate try/except
- `accounts/views.py` — after welcome email in `register_view`, sends admin notification to `admin@petheavenonline.com` CC `jackyfogel@gmail.com`; HTML body includes full name, email, timestamp; uses `_email_subject`; both use `EmailMultiAlternatives` with `cc=` for proper CC support

### Honeypot spam protection on contact form (completed)

- `templates/contact.html` — added hidden `website` honeypot field (position absolute, off-screen, aria-hidden, tabindex=-1) and hidden `form_time` timestamp field inside the form
- `static/js/contact.js` — sets `form_time` to `Date.now()` on DOMContentLoaded so the server can measure time-to-submit
- `config/views.py` — added `import time`; `contact_view` now silently returns `{'ok': True}` (no email sent) if honeypot `website` field is non-empty OR if form was submitted in under 3 seconds; real users unaffected

### Floating petals on Scene 1 (completed)

- `static/css/main.css` — added `overflow: hidden` to `#scene` to clip petals; added `.petal` (position absolute, oval border-radius, z-index 1, CSS vars for timing/opacity/rotation); added `@keyframes petalDrift` (translateX 0→110vw + translateY dy + rotate, fade in/out at edges)
- `static/js/scene.js` — added `petalEls` array; `createPetals()` creates 6 hand-tuned petal elements with varied size/speed/position/opacity appended to `sceneEl`; `showPetals()`/`hidePetals()` toggle `visibility` (keeps animations running in background); `updateHero()` now also calls show/hide based on `currentIndex`; `createPetals()` called once after hero is appended

### Homepage premium upgrade — headline above scene + animations (completed)

- `templates/home.html` — wrapped content in `.home-layout` flex column; headline moved from JS injection to static HTML in `.home-headline-section` above `#stage`; paw SVGs inline in template
- `static/js/scene.js` — removed JS `#hero` and vignette injection (vignette kept); `fitScene()` now uses `stage.offsetHeight` instead of `window.innerHeight` for correct 16:9 letterbox with shorter stage; added `isFirstRender` flag; markers on first load get `.marker--entering` class + staggered `animation-delay` (0.6s base + 0.3s per marker); `isFirstRender = false` after first `renderMarkers`; mobile `fitScene` simplified to fill stage width/height
- `static/css/main.css` — added `.home-layout` (flex column, page fade-in animation), `.home-headline-section` (lavender bg, padding clears nav), `.home-headline` (Lora 26px, wide letter-spacing), `.home-hl-icon`; `@keyframes homeFadeIn` (0→1 opacity, 0.5s); `@keyframes markerFadeIn` (0→1 opacity); `.marker--entering`; `#stage` updated to `flex:1 min-height:0`; mobile 480px overrides for new headline

### Pending/rejected memorials restricted to owner and staff (completed)

- `config/views.py` — `memorial_view`: after fetching memorial, if status is not 'approved', checks if user is authenticated and is the owner or staff; unauthorized users (including anonymous) get a 404; passes `memorial_status` to template
- `templates/memorial.html` — status banner shown at top for pending ("pending review, only visible to you") and rejected ("not approved, edit and resubmit" with link to /edit/slug/); approved memorials show nothing
- `static/css/main.css` — added `.mem-status-banner`, `.mem-status-banner--pending` (lavender), `.mem-status-banner--rejected` (soft red), `.mem-status-link` styles

### Fix tribute author name — never expose email (completed)

- `config/views.py` — `leave_tribute_view`: `author_name` now uses `get_full_name() or first_name or 'Anonymous'`; never falls back to `user.username` (which is the email address) since tributes are publicly visible

### Privacy note on registration email field (completed)

- `templates/accounts/register.html` — added 12px muted note under email input: "Used for login and notifications only. Never shared."

### Real Terms of Service and Privacy Policy (completed)

- `templates/terms.html` — replaced placeholder with 12 real sections: service description, account registration (13+), user content ownership + license, acceptable use, memorial review/approval, account termination, donations (voluntary/non-refundable), disclaimer, limitation of liability, changes to terms, governing law (Israel), contact (admin@petheavenonline.com); date updated to June 2026
- `templates/privacy.html` — replaced placeholder with 12 real sections: data collected, how used, public vs private content, third-party services (AWS S3, Google, Render, PayPal — with specifics on each), cookies (session only, no tracking), data retention (immediate deletion on account delete), user rights, children's privacy (13+), data security (HTTPS + hashed passwords), international transfers (US via AWS/Render), changes policy, contact; date updated to June 2026
- `static/css/main.css` — added `.legal-link` (lavender, underline) and `.legal-list` / `.legal-list li` styles for the third-party services bullet list in privacy policy

### Remove Vite / clean up old SPA files (completed)

- `static/assets/` — NEW: moved all static image assets here from `public/assets/` (scenes, markers, memorials webp files)
- `static/css/main.css` — updated 2 `heaven-hero.webp` CSS URLs from `/assets/...` to `/static/assets/...`
- `static/js/scene.js` — updated tombstone and meadow-dawn fallback URLs from `/assets/...` to `/static/assets/...`
- `config/urls.py` — removed custom `/assets/` URL pattern and `serve` import (no longer needed)
- `config/settings.py` — removed `BASE_DIR / 'dist'` from `STATICFILES_DIRS`
- `build.sh` — removed `npm install` and `npm run build` lines
- **Deleted**: `src/`, `dist/`, `public/`, `vite.config.js`, `package.json`, `package-lock.json`
- `manage.py check` — 0 issues confirmed

### Account deletion confirmation email (completed)

- `accounts/views.py` — added `EmailMultiAlternatives` import; `delete_account_view` now saves `email` and `first_name` before any deletion, sends HTML + plain goodbye email, then proceeds with deleting memorials/user; failure prints to terminal without blocking deletion

### Delete account flow (completed)

- `accounts/views.py` — added `delete_account_view`: GET renders confirmation page; POST checks `confirmation == 'DELETE'`, deletes user's memorials (cascades to all related data), logs out, deletes user, redirects to `/`; wrong confirmation re-renders with error
- `accounts/urls.py` — added `path('account/delete/', ...)` before password reset URLs
- `templates/accounts/delete_account.html` — NEW: warning box listing what gets deleted, text confirmation input, red submit button disabled until "DELETE" typed exactly (inline JS), cancel link
- `templates/account.html` — "Delete account" button changed to `<a href="/account/delete/">` link

### Password reset flow (completed)

- `accounts/urls.py` — added 4 password reset URL patterns using Django's built-in auth views; `PasswordResetView` configured with custom templates, email/subject templates, success URL, and `extra_email_context={'is_dev': settings.DEBUG}` for DEV subject prefix
- `templates/accounts/password_reset.html` — NEW: email input form, lavender auth styling
- `templates/accounts/password_reset_done.html` — NEW: "Check your email" confirmation page
- `templates/accounts/password_reset_confirm.html` — NEW: new password + confirm fields; invalid link state handled
- `templates/accounts/password_reset_complete.html` — NEW: success page with Log in button
- `templates/accounts/password_reset_subject.txt` — NEW: subject template with optional [DEV] prefix
- `templates/accounts/password_reset_email.html` — NEW: plain text email body with reset link using `{{ protocol }}://{{ domain }}/...`
- `templates/accounts/login.html` — "Forgot your password?" link updated from `#` to `/password-reset/`
- `templates/account.html` — "Change password" button changed to `<a href="/password-reset/">` link

### Dev email URLs point to localhost:8000 (completed)

- `config/views.py` — added `_base_url()` helper: returns `http://localhost:8000` when `DEBUG=True`, `https://petheavenonline.com` in production; all email link URLs in views.py, accounts/views.py, and memorials/admin.py updated to use it
- `accounts/views.py` — imports `_base_url`; welcome email link uses it
- `memorials/admin.py` — imports `_base_url`; approval email links use it

### Tribute and candle notification emails (completed)

- `config/views.py` — `leave_tribute_view`: after saving a tribute, emails the memorial owner if the tribute author is not the owner; HTML body includes quoted message with blockquote styling and link to #tributes anchor; `light_candle_view`: after creating a new candle for an authenticated non-owner user, emails the memorial owner with candle count and link to memorial; both wrapped in `try/except` with print

### Approval email when admin approves memorial (completed)

- `memorials/admin.py` — added `EmailMultiAlternatives`, `settings`, `escape`, `_email_subject`, `_approved_scene_pages` imports; `MemorialAdmin.save_model` fetches old status before save, sends HTML + plain approval email to the owner if status just changed to 'approved'; includes memorial link and garden link (if scene page exists); wrapped in `try/except` with print

### Remove email field from create wizard (completed)

- `static/js/create.js` — removed `email` from initial `fd`, removed email field HTML from step 5, removed `fd.email` collection in `saveStep`, removed email validation from step 5 validation block; user's email comes from `request.user.email` server-side

### Memorial submission confirmation email (completed)

- `config/views.py` — after saving a new memorial (including traits, timeline, gallery), sends HTML + plain text confirmation email to `request.user.email`; subject uses `_email_subject`; includes pet name, pending status message, and clickable preview link; wrapped in `try/except` so failure never blocks the redirect to success page

### HTML emails — welcome + contact (completed)

- `accounts/views.py` — welcome email now sends both plain text and HTML (`html_message` param on `send_mail`); HTML version has styled div, proper paragraphs, and clickable link to /create/
- `config/views.py` — swapped `EmailMessage` for `EmailMultiAlternatives`; added `escape` import; contact email now attaches HTML alternative with sender's email as a clickable mailto link and message in `white-space:pre-wrap`

### Welcome email on registration (completed)

- `accounts/views.py` — added `send_mail`, `settings`, and `_email_subject` imports; after user creation and login, sends a welcome email to the new user's address; wrapped in `try/except` so a mail failure never blocks registration

### [DEV] email subject prefix (completed)

- `config/views.py` — added `_email_subject(subject)` helper: prepends `[DEV] ` when `settings.DEBUG` is True, no prefix in production; updated contact form email to use it

### Contact form — real email sending (completed)

- `config/settings.py` — added Gmail SMTP email config: `EMAIL_BACKEND`, `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USE_TLS`, `EMAIL_HOST_USER`/`PASSWORD` from env vars, `DEFAULT_FROM_EMAIL`
- `config/views.py` — added `EmailMessage`/`BadHeaderError`/`settings` imports; `contact_view` now handles POST: validates all fields, sends email to `admin@petheavenonline.com` with Reply-To set to the sender, returns `JsonResponse({'ok': True})` on success or `{'ok': False, 'error': '...'}` on failure; GET unchanged
- `templates/contact.html` — added `method="post"` to form; added `#contact-error` div (reuses `.auth-error-box` style) above the form
- `static/js/contact.js` — replaced fake success with real `fetch` POST; on success shows existing success div; on error shows `#contact-error` message; button disabled during send with "Sending…" text

### S3 dev/prod upload prefix (completed)

- `config/settings.py` — inside the `if _AWS_BUCKET:` block, added `if DEBUG: STORAGES['default']['OPTIONS']['location'] = 'dev'`; when S3 is active and DEBUG is True, all uploads are prefixed with `dev/` (e.g. `dev/memorials/photos/`, `dev/scenes/`); production (DEBUG=False) uploads go to the bucket root unchanged; local media storage unaffected

---

## What was done (prior)

### Phase 7 — SEO basics (completed)

- `templates/base.html` — added full SEO head: `<meta name="description">`, `<link rel="canonical">`, `{% block robots %}` (for noindex pages), Open Graph tags (og:type, og:site_name, og:title, og:description, og:url, og:image), Twitter card; all as overridable blocks
- `templates/home.html` — added `{% block meta_description %}`
- `templates/memorial.html` — updated title to "In Loving Memory of [name] | PetHeavenOnline"; added meta_description, og_type (article), og_title, og_description, og_image (pet S3 photo URL) blocks — all conditional on `not not_found`; updated hero photo alt to "Memorial photo of {{ m.name }}"
- `templates/browse.html` — updated title to pipe format; added meta_description block
- `templates/create.html` — updated title to pipe format; added meta_description block
- `templates/contact.html` — updated title to pipe format; added meta_description block
- `templates/account.html` — updated title to pipe format; added `{% block robots %}<meta name="robots" content="noindex">{% endblock %}`
- `templates/accounts/login.html` — updated title to pipe format; added noindex robots block
- `templates/accounts/register.html` — updated title to pipe format; added meta_description block
- `templates/terms.html` — updated title to pipe format
- `templates/privacy.html` — updated title to pipe format
- `static/js/scene.js` — updated tombstone marker overlay photo alt to "Photo of [name]"
- `config/settings.py` — added `django.contrib.sitemaps` to INSTALLED_APPS
- `config/sitemaps.py` — NEW: `StaticViewSitemap` (home/browse/create/contact with priorities) and `MemorialSitemap` (approved memorials, lastmod from updated_at)
- `config/views.py` — added `robots_txt_view` serving plain-text robots.txt; disallows /admin/, /account/, /login/, /register/, /logout/, /edit/; points to sitemap
- `config/urls.py` — added `sitemap.xml` and `robots.txt` URL patterns; imported sitemap view and sitemaps dict

### Share section — functional share buttons (completed)

- `templates/memorial.html` — replaced static share section with 4 functional share buttons (Copy link, WhatsApp, Facebook, Email); added `id="share-section"` with `data-name` attribute; removed QR placeholder; added share IIFE in `{% block extra_scripts %}` that wires up WhatsApp/Facebook/Email hrefs dynamically from the current URL and handles clipboard copy with "Copied!" feedback
- `static/css/main.css` — replaced `.mem-qr*` styles with `.mem-share-btn` (pill button with icon+label, border, hover) and `.mem-share-btn--copied` state; updated `.mem-share-buttons` to flex-wrap

### Phase 6F.2 — Tributes/Comments feature (completed)

- `memorials/models.py` — added `user` (FK to User, null/blank) and `is_approved` (BooleanField, default=True) to `Tribute` model
- `memorials/migrations/0004_tribute_is_approved_tribute_user.py` — generated and applied
- `memorials/admin.py` — updated `TributeAdmin`: list_display now includes user and is_approved; added list_filter and list_editable for is_approved; added search_fields
- `config/views.py` — added `Tribute` to imports; updated `memorial_view` to query approved tributes and pass `tributes` + `user_full_name` to template; added `leave_tribute_view` (POST only, login required, creates Tribute and redirects to `#tributes`)
- `config/urls.py` — added `memorial/<slug>/tribute/` URL
- `templates/memorial.html` — replaced static mock tributes with dynamic loop; added leave-tribute form for logged-in users; added login prompt for anonymous users; added empty state when no tributes exist
- `static/css/main.css` — added `.mem-tributes-empty`, `.mem-tribute-form`, `.mem-tribute-form-label`, `.mem-tribute-textarea`, `.mem-tribute-submit`, `.mem-tribute-login` styles

### Phase 6F.1 — Light a Candle feature (completed)

- `memorials/models.py` — added `Candle` model: FK to Memorial, nullable FK to User, nullable `session_key` CharField; two conditional unique constraints (one per user per memorial, one per session per memorial)
- `memorials/migrations/0003_candle.py` — generated and applied
- `memorials/admin.py` — registered `CandleAdmin` with list_display and readonly created_at
- `config/views.py` — added `JsonResponse`/`require_POST` imports and `Candle` import; added `light_candle_view` (POST only, handles auth and anonymous, returns `{already_lit, count}`); updated `memorial_view` to pass `candle_count` and `already_lit` to template
- `config/urls.py` — added `memorial/<slug>/light-candle/` URL
- `templates/memorial.html` — replaced static candle section with data-attribute-driven section; added `{% block extra_scripts %}` with inline IIFE that renders animated candle grid, handles button click via fetch, shows nudge for anonymous users after lighting
- `static/css/main.css` — replaced old `.mem-candle-icon` CSS with animated candle system: `.mem-candle`, `.mem-candle-flame` (CSS `candle-flicker` keyframes with `--flicker-dur`/`--flicker-delay` custom props), `.mem-candle-body`, `.mem-candle-base`, `.mem-candle--new` appear animation, `.mem-candle-btn--lit`, `.mem-candle-nudge`

### Scene background ImageField (completed)

- `memorials/models.py` — `Scene.background` changed from `CharField(max_length=200)` to `ImageField(upload_to='scenes/', blank=True)` — backgrounds now upload to S3 via admin
- `memorials/migrations/0002_alter_scene_background.py` — generated and applied
- `memorials/management/commands/seed_scenes.py` — removed hardcoded background paths; scenes seeded with title/slug/ambient_color/order only
- `config/views.py` — `home_view` now uses `sc.background.url` (ImageField URL) instead of raw string; falls back to empty string if no image uploaded

### Phase 6E — AWS S3 media storage (completed)

- `requirements.txt` — added `boto3==1.37.28` and `django-storages==1.14.6`
- `config/settings.py` — added `'storages'` to INSTALLED_APPS; replaced the `MEDIA_URL`/`MEDIA_ROOT` block with a conditional: if `AWS_STORAGE_BUCKET_NAME` env var exists, configures `S3Boto3Storage` as `DEFAULT_FILE_STORAGE` with public-read ACL, no signed URLs, 1-day cache headers, and `MEDIA_URL` pointing to `https://<bucket>.s3.amazonaws.com/`; if env var absent, falls back to local `/media/` storage unchanged

### Remove static/mock memorial data (completed)

- `config/views.py` — removed the 170-line hardcoded `MEMORIALS` list and `_MEMORIAL_BY_SLUG` dict; removed unused `import json`; `memorial_view` now returns 404 directly if slug not found in DB (no static fallback); `browse_view` now queries DB only with no static merge logic

### Phase 6D.6 — Homepage scenes wired to real data (completed)

- `memorials/management/commands/seed_scenes.py` — NEW: seeds 3 Scene records (Meadow Dawn, Sunset Lake, Twilight Garden) using `get_or_create`; already run
- `config/views.py` — added `Scene` import; added `_approved_scene_pages()` helper returning `{slug: page_number}` for approved memorials; `home_view` queries active Scenes + approved Memorials, batches into groups of 5, cycles through scene backgrounds, builds `scene_data` list; `memorial_view` passes `scene_page` to template; `browse_view` and `account_view` annotate each memorial with `scene_page`
- `templates/home.html` — injects `window.SCENE_DATA` via `json_script` filter
- `static/js/scene.js` — replaced hardcoded SCENES/MEMORIALS with `SLOT_CONFIGS` (3 authored position sets) + runtime `SCENES` built from `window.SCENE_DATA`; all rendering unchanged except `slot.memorial` replaces `MEMORIALS[slot.memorialId]`; added `?scene=N` URL param jump on init
- `templates/memorial.html` — added `.mem-hero-nav-right` div with "Visit in garden →" link (conditional on `scene_page`)
- `templates/account.html` — added "In garden" action link (shown for approved memorials only)
- `templates/browse.html` — added `.browse-card-garden` span with onclick navigation (shown for approved DB memorials)
- `static/css/main.css` — added styles for `.mem-hero-nav-right`, `.mem-garden-link`, `.browse-card-garden`

### Garden link text update (completed)

- `templates/memorial.html` — garden link text changed to "Visit {{ m.name }} in the garden →"
- `templates/account.html` — garden link text changed to "Visit {{ memorial.pet_name }} in the garden →"
- `templates/browse.html` — garden link text changed to "Visit {{ m.name }} in the garden →"

### Phase 6D.4 — Edit Memorial page (completed)

- `memorials/forms.py` — added `MemorialEditForm(MemorialForm)` with `photo = forms.ImageField(required=False)` so editing without changing the photo doesn't fail validation
- `config/views.py` — added `json` and `Http404`/`HttpResponseForbidden` imports; added `MemorialEditForm` import; added `edit_view`: looks up memorial by slug, returns 403 if not the owner, on GET builds `edit_data` dict (pet fields + traits/timeline/gallery as JSON-serializable lists) and passes `edit_data_json` to template, on POST validates with `MemorialEditForm`, keeps existing photo if no new file uploaded, replaces traits and timeline in full, removes any gallery photos listed in `remove_gallery` POST param, appends new gallery uploads, redirects to `/memorial/<slug>/`
- `config/urls.py` — added `path('edit/<slug:slug>/', views.edit_view, name='edit_memorial')`
- `templates/edit.html` — NEW: extends base.html; injects `window.EDIT_DATA = {{ edit_data_json }}` in `{% block extra_head %}`; wraps `#edit-stage` in a POST form with CSRF token; loads `edit.js`
- `static/js/edit.js` — NEW: self-contained IIFE; reads `window.EDIT_DATA` to pre-fill `fd`; same 5-step wizard as create.js but with "Edit Memorial" title/subtitle, "Save Changes" button, back link to `/memorial/<slug>/`, no email field in step 5, photo step shows existing photo with hint to replace, step 4 shows existing gallery photos with per-photo Remove/Undo toggle, new gallery uploads append alongside existing; `handleSubmit` POSTs `remove_gallery` IDs and new gallery files via fetch to `/edit/<slug>/`, redirects to memorial page on success
- `static/css/main.css` — added `.gallery-existing-item`, `.gallery-existing-remove`, `.gallery-existing-remove:hover` for the existing gallery thumbnails in the edit wizard

### Phase 6D.5 — Account page wired to real data (completed)

- `config/views.py` — `account_view` now queries `Memorial.objects.filter(user=user).order_by('-created_at')` and passes the list to the template; initials logic unchanged
- `templates/account.html` — My Memorials section replaced: loops through real memorials with photo, name+badge row, dates, epitaph, View/Edit links; empty state shows friendly message + "Create your first memorial" button; "Create new memorial" button shown below the list only when memorials exist; all hardcoded mock data removed; profile header unchanged (already used real user context variables)
- `static/css/main.css` — added `.acct-badge--rejected` (red) alongside existing `--live` and `--pending` badge variants

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
