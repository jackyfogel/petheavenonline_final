# PetHeavenOnline — Project Handoff Summary

> Paste this into any new Claude chat to restore full context. Pair it with the latest SESSION.md from the repo for 100% continuity.

---

## What it is
PetHeavenOnline is a pet memorial website. Visitors browse full-screen illustrated "garden" scenes with tombstone markers, click a tombstone to see a preview card, and enter a full memorial page for that pet. **Live at petheavenonline.com** (hosted on Render).

## Who I am (the user)
- Jack (Jacky Fogel). Not a professional developer but builds confidently with AI. Enjoys learning and understanding decisions, but for this project quality results and best practices take priority over learning pace.
- GitHub: jackyfogel. Local path: `/c/apps/petheavenonline`. Works in VS Code on Windows (Git Bash / MINGW64).
- Casual, direct communicator. Likes to **discuss options before any prompt is written** — do not jump straight to prompts.
- I get frustrated when Claude Code overreaches scope. Prefer concise, clear guidance.

## Workflow (important)
- **Claude chat (you)** = architecture, decisions, writing prompts, reviewing output.
- **Claude Code (Sonnet) in VS Code** = implementation. I paste your prompts into it.
- Every prompt to Claude Code must end with **"do NOT change anything else"** (or similar) to prevent scope creep.
- I handle my own git. You give me the git commit commands when a step is done.
- I sometimes consult Gemini in parallel for design feedback; you help me evaluate and cross-reference its suggestions.

## Tech stack
- **Backend:** Django 6.0.x, PostgreSQL (Render, Basic-256mb $6/mo tier — upgraded from free).
- **Media:** AWS S3 bucket `petheavenonline-media` (region us-west-2). Public read via bucket policy, ACLs disabled. Dev uploads prefixed with `dev/` (when DEBUG=True), prod uploads to root. Same bucket both envs.
- **Storage config:** Django 6 uses the `STORAGES` dict (NOT the old `DEFAULT_FILE_STORAGE`). S3 via django-storages + boto3, with `default_acl=None`, `querystring_auth=False`, `custom_domain`.
- **Email:** Google Workspace SMTP (smtp.gmail.com:587 TLS), admin@petheavenonline.com, app password in env. `email_subject()` helper prefixes `[DEV] ` when DEBUG. HTML emails for clickable links. `SITE_URL` setting = localhost in dev, https://petheavenonline.com in prod.
- **Hosting:** Render web service + PostgreSQL. Start command needs `gunicorn config.wsgi:application --timeout 120` (longer timeout for email sends). Auto-deploys on git push to main.
- **Domain:** petheavenonline.com via Dynadot DNS.
- **Donations:** PayPal link (https://www.paypal.com/paypalme/jackyfogel), "Support this project 🐾" in footer only.
- **Vite is fully removed.** No more SPA, no npm in build. Pure Django server-side templates + `static/js/` for interactivity. Assets in `static/assets/`.

## Design system
- **Palette:** lavender family — bg #f0edf5, accent #d5cde5, mid/buttons #9a89b5, dark #5e4f76, text #2e2640.
- **Homepage content section (below the fold):** warm cream #F7F0E8.
- **Homepage H1 color:** warm walnut #4a3b2a.
- **Fonts:** Lora (serif headings), Inter (body). Keep Lora site-wide — do not introduce new fonts without a site-wide decision.
- **Memorial page palette:** twilight lavender; heaven-hero cloud background with lavender overlay.

## Architecture / key models
Django apps: `accounts`, `memorials`, plus `config` (project).
Models: Memorial (user, slug, pet_name, species, breed, birth_date, passing_date, photo, epitaph, story, owner_name, status[pending/approved/rejected], candle_count, timestamps), MemorialTrait, TimelineMilestone, GalleryPhoto, Tribute (user, author_name, message, is_approved), Scene (title, slug, background[ImageField→S3], ambient_color, order, is_active), Candle (memorial, user, session_key — one per user/session), Placement (largely unused; placement calculated on the fly).

## Scene auto-placement system (memorize this)
- Approved memorials ordered by created_at, grouped in **batches of 5**.
- Batch 1 → Scene order=1, Batch 2 → order=2, Batch 3 → order=3.
- **If no scene exists for the next batch, it falls back to Scene order=1.** Everything beyond available scenes defaults to Scene 1.
- Adding a new Scene later auto-shifts batches to fill it.
- Each batch = one "scene page" navigated by left/right arrows. Position within batch = slot index 0–4.
- Scene 1 (landing) currently = Sunset Lake (we swapped order so Sunset Lake = order 1).
- Slot positions are hardcoded in `static/js/scene.js` (layout, not data). Data comes from `window.SCENE_DATA` injected by `home_view`.

## What's DONE
- Full auth: register/login/logout, welcome page, password reset flow (Django built-in + custom lavender templates), delete account (type "DELETE", full delete = Option A, confirmation email before deletion).
- Memorial CRUD: create wizard (5 steps), detail page (DB-driven, 404 if not found), browse (filter/search/sort, approved only), edit (ownership check, owner pencil on memorial page), account page (user's memorials with status badges).
- Memorial visibility: pending/rejected only visible to owner or staff, else 404. Banner shown to owner.
- Interactive: candles (animated CSS flames, one per user/session, anon allowed), tributes (login required, auto-approved, admin moderation, author_name never leaks email — fallback get_full_name → first_name → "Anonymous").
- Share section: copy link, WhatsApp, Facebook, email. (No QR, no SMS — felt too commercial.)
- **Virtual flowers section REMOVED** (revisit later for monetization).
- S3 media working in dev + prod. Scene backgrounds uploadable via admin.
- All emails working: welcome, memorial submitted (+ admin notify CC jackyfogel@gmail.com), memorial approved, password reset, tribute notify owner, candle notify owner, contact form → admin, delete confirmation, new user admin notify (CC gmail). All HTML, all [DEV]-prefixed in dev, all use SITE_URL.
- SEO: meta tags, Open Graph (memorial pages use pet photo as og:image), Twitter cards, canonical, per-page titles/descriptions, noindex on account/login/register, sitemap.xml (django.contrib.sitemaps), robots.txt, alt text, one H1 per page.
- Spam protection: honeypot + time-check on contact form AND registration form (fail silently).
- Legal: real terms.html + privacy.html (governing law Israel, contact admin@petheavenonline.com, "Last updated: June 2026").
- Homepage premium polish: headline color #4a3b2a, nav contrast gradient over all scenes, soft grounding shadows under tombstones, warm candlelight hover glow on tombstones, preview card kept below nav + click-outside-to-close, content section below landing scene (intro line, 3 steps with SVG icons, CTA, featured memorials) with long smooth fade from scene into cream #F7F0E8 (Scene 1 only; other scenes full height, no content).

## Monetization plan
Donations first (PayPal, footer only — not on memorial pages, too commercial for sacred space). Later: paid premium memorials (likely main driver), Google Ads, virtual flowers/candles. Goal ~$1K/month within a year (ambitious, traffic-dependent). Growth engine = each memorial is an SEO page + owners share links with family.

## REMAINING before/at launch
1. **Below-the-fold redesign** — current content section still looks rough; actively improving it (getting Gemini's input too).
2. **Mobile polish pass** — fresh check of all pages on phone.
3. **Final testing** — full flow walkthrough on live site.

## Deferred / future ideas
- Display-name system (Option C: set at registration, editable per tribute) — skipped for now; quick email-leak fix applied instead.
- Virtual flowers (paid) — removed, revisit with proper payment + design.
- Weekly admin digest email (instead of per-event pings).
- reCAPTCHA if honeypot proves insufficient.
- Admin override for auto-placement (pin/feature a memorial to a specific scene/slot).

## Gotchas / patterns learned
- Browser cache + stale builds caused many "it doesn't work" moments early on.
- Django 6 STORAGES dict vs DEFAULT_FILE_STORAGE was the big S3 bug.
- S3 ACLs disabled → must use `default_acl=None` and rely on bucket policy for public read.
- Worker timeout on Render free tier during email send → fixed with `--timeout 120`.
- Trailing-slash URL ordering: explicit routes must come before any catch-all.
- "Add milestone/trait" buttons in wizards must be `type="button"`, only final submit is `type="submit"`.
- Render free DB expires ~90 days — now on paid Basic tier.
- Superuser/password resets on Render done via a temporary line in build.sh, then removed and re-pushed.

## Project files in repo root
ARCHITECTURE.md, ROADMAP.md, CLAUDE.md, SESSION.md (always read these for context; SESSION.md is the live state).
