# SESSION.md

## Last completed step

Phase 1, Step 2 — Hardcoded memorial markers on the single scene

---

## What was done

- Added 5 authored slot positions (x, y as percentages, scale per slot) to the scene object in `main.js`
- Added `renderMarkers()` which creates a `.marker` div per slot, positioned absolutely within the scene using percentage coordinates and per-slot scale
- Markers are anchored at their base point via `transform: translate(-50%, -100%) scale(scale)`
- Added `.marker` CSS: small headstone shape (rounded top rectangle), muted warm-grey, no hover behavior, no labels, no interaction

---

## Files changed

- `src/main.js` — added `slots` array to scene object, added `renderMarkers()` function
- `src/style.css` — added `.marker` styling

---

## What to test

- Open `http://localhost:5173` and confirm 5 quiet headstone markers are visible in the lower ground band of the scene
- Confirm markers vary slightly in size (depth suggestion)
- Confirm no hover or click behavior exists
- Resize the browser and confirm markers stay correctly anchored to their authored positions within the scene
- Check on a narrow/portrait viewport that markers remain inside the scene rectangle

---

## What remains (Phase 1)

- Step 3: marker click → gentle tomb focus → anchored preview card with fake data
- Step 4: add 2–3 scenes with soft slide/fade transition and keyboard + swipe navigation
- Step 5: basic responsive behavior review and authored portrait slot sets
