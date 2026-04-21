# SESSION.md

## Last completed step

Phase 1, Step 3 — Marker interaction: tomb focus + anchored preview card (+ entrance polish)

---

## What was done

- Added fake memorial data (name, born, passed, epitaph) inline to each slot in the scene object
- Switched marker transform to use a CSS custom property (`--base-scale`) so active/dimmed states can compose cleanly in CSS
- Added `activateMarker()`: sets `marker--active` on the clicked marker, `marker--dimmed` on all others, and appends a `.preview-card` anchored to the slot's percentage position
- Added `closePreview()`: removes the card and clears all marker state classes
- Scene background click closes the preview; clicks inside the card do not (checked via `e.target.closest`)
- Marker clicks use `e.stopPropagation()` to prevent immediate close
- "Enter Memorial" button is styled and active-looking but does nothing yet
- No routing, no modal, no overlay, no heavy animation

---

## Files changed

- `src/main.js` — added memorial data per slot, `activateMarker()`, `closePreview()`, click handlers, CSS variable for scale
- `src/style.css` — updated `.marker` to use `--base-scale`, added `.marker--active`, `.marker--dimmed`, `.preview-card` and all inner element styles; added `card-in` keyframe for subtle entrance (fade + 8px upward drift, 220ms ease-out)

---

## What to test

- Click each of the 5 markers and confirm the preview card appears anchored above that tomb
- Confirm the other markers fade back when one is active
- Confirm the card shows the correct name, dates, epitaph for each marker
- Click another marker and confirm focus switches cleanly
- Click `×` and confirm everything returns to default
- Click the scene background and confirm the preview closes
- Click inside the preview card and confirm it does NOT close
- Confirm "Enter Memorial" button looks real but does nothing
- Resize the browser and confirm card and markers stay correctly anchored

---

## What remains (Phase 1)

- Step 4: add 2–3 scenes with soft slide/fade transition and keyboard + swipe navigation
- Step 5: basic responsive behavior review and authored portrait slot sets
