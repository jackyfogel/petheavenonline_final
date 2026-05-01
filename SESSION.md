# SESSION.md

## Last completed step

Phase 3, Step 2 — Memorial detail page expanded + real scene background image

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
- Scene indicator: "Morning Meadow · 1 / 3" shown at bottom-center of stage

### Phase 3 (in progress)
- Memorial detail page rendered via `window.location.pathname` detection in `main.js`
- Homepage code wrapped in `initHomepage()`; memorial route calls `renderMemorialPage(slug)`
- Memorial page sections: hero band, In Memory, Photos (4 placeholders), Light a Candle (4 candle shapes), Tributes (3 placeholder blocks)
- Full-width layout: hero band edge-to-edge, text sections constrained to readable width
- Real background image wired: `meadow-dawn.webp` in `public/scenes/`, path `/scenes/meadow-dawn.webp` set in `scenes.js`; `applyScene()` uses `backgroundImage` when available, gradient fallback for other scenes

---

## Files changed (cumulative)

- `src/main.js` — homepage init, memorial page render, route detection, applyScene with image support
- `src/style.css` — all homepage and memorial page styles
- `src/data/scenes.js` — 3 scenes with slots, portrait slots, ambient colors, background image for meadow-dawn
- `src/data/memorials.js` — 15 memorial records with slugs
- `SESSION.md` — this file

---

## What to test

- Homepage: all 3 scenes navigate correctly, markers work, preview cards show correct data, swipe/keyboard work
- Scene 1 shows the real meadow-dawn.webp background (once image file is placed in public/scenes/)
- Scenes 2 and 3 still show their CSS gradients; no leftover image styles bleed between scenes
- Click "Enter Memorial" → navigates to /memorial/[slug]
- Memorial page: hero band, all 5 sections visible, correct pet name/dates/epitaph per slug
- "← Back to Home" returns to homepage
- Unknown slug (e.g. /memorial/notadog) shows graceful not-found message

---

## What remains

- Phase 3 continued: visual polish of memorial page, real content fields
- Phase 4: Browse page
- Phase 5: Create memorial page
- Phase 6+: Django backend, S3, deployment
