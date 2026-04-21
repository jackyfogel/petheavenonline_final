# SESSION.md

## Last completed step

Phase 1, Step 1 — Static single-scene homepage foundation

---

## What was done

- Created the Vite project structure from scratch
- Built a full-screen 16:9 scenic stage with intentional ambient-color letterboxing
- Scene data lives as a plain inline object in `main.js`
- Placeholder gradient background used (sky → ground) until real art is available
- Resize handler keeps the 16:9 rectangle correctly fitted at all viewport sizes

---

## Files changed

- `package.json` — created (Vite dependency, dev/build scripts)
- `index.html` — created (entry point, mounts stage and scene)
- `src/style.css` — created (full-page reset, stage layout, scene sizing)
- `src/main.js` — created (scene object, applyScene, fitScene, resize listener)

---

## What to test

- Open `http://localhost:5173` and confirm the 16:9 scene is centered with ambient color filling the remaining space
- Resize the browser window in all directions and confirm the scene recalculates correctly
- Narrow the window to portrait proportions and confirm no layout breaks
- Check on a mobile device or browser DevTools mobile emulation

---

## What remains (Phase 1)

- Step 2: render 5 hardcoded markers in authored slot positions on the scene
- Step 3: marker click → gentle tomb focus → anchored preview card with fake data
- Step 4: add 2–3 scenes with soft slide/fade transition and keyboard + swipe navigation
- Step 5: basic responsive behavior review and authored portrait slot sets
