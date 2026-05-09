# SESSION.md

## Last completed step

Create Memorial page — photo required validation + updated success message

---

## What was done

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

- `src/main.js` — route detection, homepage init, full memorial page render, tombstone overlay, hero text, SVG arrows
- `src/style.css` — all homepage and memorial page styles; nav, footer, hero, chevrons, full `.mem-*` system; create page styles appended
- `src/create.js` — NEW: full 5-step create memorial wizard
- `src/data/scenes.js` — 3 scenes with updated slot y values, portrait slots, background image path
- `src/data/memorials.js` — 15 memorial records with slugs, photos, owner, story, traits, timeline
- `index.html` — Google Fonts, nav bar, footer; Create Memorial link updated to /create
- `public/assets/scenes/meadow-dawn.webp` — real scene background
- `public/assets/markers/tombstone.webp` — tombstone marker image
- `public/assets/memorials/mem-buddy.webp` through `mem-milo.webp` — 5 pet photos

---

## What to test

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

---

## What remains

- Phase 4: Browse page (`/browse`) — grid/list of memorials, basic search/filter
- Phase 6+: Django backend, PostgreSQL, S3, Render deployment
- Phase 7: Loading states, responsive refinement, SEO, analytics, launch
