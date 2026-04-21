# PetHeavenOnline — Architecture

A curated scenic pet memorial website. Visitors browse a sequence of authored full-screen scenes, each containing a small number of memorial markers placed with care. The experience should feel like entering a quiet illustrated world, not browsing a typical website.

---

## 1. Product Vision

PetHeavenOnline is not a game, not a procedural world, and not a technical demo.

It is a respectful, emotional, picture-book memorial experience for pets.

Every scene is hand-authored.  
Every interaction is restrained.  
Every screen should feel intentional, calm, and sincere.

The core emotional idea is simple:

- the user enters a beautiful memorial world
- the user notices a tomb within that world
- the user gently approaches that tomb
- the user can then enter a deeper memorial page for that pet

At no point should the experience feel like jumping between random generic website templates.

---

## 2. Tech Stack

### MVP Frontend
- **Vite**
- **Vanilla JavaScript**
- **CSS**

### Later Backend
- **Django**
- **PostgreSQL**

### Media
- **AWS S3**

### Hosting
- **Render**

### Explicitly Not Used in MVP
- **PixiJS**
- **Three.js**
- **game engines**
- **frontend frameworks unless later truly justified**

This project should win through composition, art, typography, motion restraint, and emotional clarity — not through technical complexity.

---

## 3. MVP Page Structure

The MVP has exactly four pages.

- `/` — **Home**  
  Scenic picture-book homepage. Emotional heart of the product.

- `/memorial/:slug` — **Memorial Detail**  
  Full memorial page for one pet. Deeper tribute content lives here.

- `/browse` — **Browse Memorials**  
  Functional search/list page for finding specific pets.

- `/create` — **Create Memorial**  
  Frontend memorial creation form. Built last.

No extra marketing pages in MVP.  
No About, FAQ, blog, pricing page, or feature page in MVP unless explicitly approved later.

---

## 4. Experience Model

The experience has three emotional layers:

### Layer 1 — Scenic Browsing
The user sees a full-screen scene with a small number of tombs placed naturally in the environment.

Purpose:
- mood
- discovery
- emotional atmosphere

### Layer 2 — Tomb Preview
When a tomb is clicked, the interface should gently focus attention on that tomb and show a small preview card anchored to it.

Purpose:
- identify the pet
- pause at the grave
- offer a path deeper

This preview is **not** the full memorial page.

### Layer 3 — Memorial Detail
The user can choose to enter the full memorial page.

Purpose:
- tribute
- reading
- photos
- owner story
- remembrance

The memorial page should feel like a deeper layer of the same world, not a disconnected generic content page.

---

## 5. Navigation Model

### Primary Navigation — Scenic
On the homepage, users move between scenes using:

- left/right arrows
- keyboard arrow keys on desktop
- swipe gestures on mobile

Transitions should feel like:
- turning a memory page
- moving softly through an illustrated book
- gentle and respectful

Transitions should **not** feel like:
- a product carousel
- a cheap slider
- a game camera
- a flashy animation demo

Recommended transition style:
- soft horizontal slide
- subtle fade
- very light depth/parallax only if it stays tasteful

### Secondary Navigation — Utility
A minimal top bar may contain:
- logo/title
- Browse
- Create
- a small scene indicator like `Scene 2 of 5`

Controls must remain restrained and visually quiet.

No noisy dots, progress bars, or heavy carousel chrome.

---

## 6. Visual Composition Rules

### Aspect Ratio
Desktop scenes are authored for **16:9**.

On mismatched screens, the scene should remain compositionally correct through tasteful letterboxing.

### Letterbox Fill
Letterboxing must never look broken.

Default fill:
- use the scene's `ambientColor`

Possible later enhancement:
- soft blurred extension of the scene

Never use harsh black bars.

### Background Art
Background art is central to the identity of the product.

Rules:
- every scene is authored, not generated at runtime
- lower portion of the scene must provide valid ground for tomb placement
- tombs must not overlap sky, trees, water, or visually impossible placement zones
- background quality matters more than clever rendering

### Marker Depth
Each tomb slot may include a scale value to fake depth:
- closer markers slightly larger
- farther markers slightly smaller

This is visual composition, not a simulated 3D system.

---

## 7. Mobile Strategy

Mobile composition is treated intentionally, not as a lazy collapse of desktop layout.

Each scene may define:
- `slots` for landscape
- `slotsPortrait` for portrait

If needed later, a scene may also have:
- `backgroundPortrait`

This is less elegant technically than a fully adaptive system, but it preserves composition quality.

Composition quality beats responsive cleverness.

---

## 8. Content Model

There are three separate concepts:

- **scene**
- **memorial**
- **placement**

Keep implementation lightweight:
- JSON files or simple data modules
- no abstract manager systems
- no engine architecture
- no unnecessary classes

### Scene

```js
{
  id: "meadow-dawn",
  order: 1,
  title: "Morning Meadow",
  background: "/scenes/meadow-dawn.webp",
  backgroundPortrait: null,
  ambientColor: "#e8d5a8",
  capacity: 5,
  slots: [
    { id: "slot-1", x: 18, y: 72, scale: 1.00 },
    { id: "slot-2", x: 34, y: 78, scale: 1.05 },
    { id: "slot-3", x: 50, y: 75, scale: 1.00 },
    { id: "slot-4", x: 66, y: 79, scale: 0.95 },
    { id: "slot-5", x: 82, y: 73, scale: 1.00 }
  ],
  slotsPortrait: [
    { id: "slot-1", x: 25, y: 60, scale: 1.00 },
    { id: "slot-2", x: 50, y: 68, scale: 1.05 },
    { id: "slot-3", x: 75, y: 62, scale: 1.00 },
    { id: "slot-4", x: 35, y: 80, scale: 0.95 },
    { id: "slot-5", x: 65, y: 82, scale: 1.00 }
  ]
}
```

### Memorial

```js
{
  id: "mem-7421",
  slug: "buddy-the-golden",
  petName: "Buddy",
  species: "Dog",
  birthDate: "2010-04-12",
  passingDate: "2023-11-08",
  photo: "/memorials/buddy-7421.webp",
  story: "Buddy loved chasing squirrels...",
  ownerName: "Sarah M.",
  createdAt: "2026-04-08"
}
```

### Placement

```js
{
  sceneId: "meadow-dawn",
  slotId: "slot-3",
  memorialId: "mem-7421"
}
```

Memorials are persistent.
Scenes can evolve over time.
Placements connect memorials to authored scenic slots without entangling the data model.

---

## 9. Empty Slot Handling

By default, empty slots are hidden.

They do not render as visible "available spaces."

Do not show:
- plus icons
- "add memorial here"
- empty inventory markers
- transactional placeholders on the scenic homepage

Possible future enhancement:
- subtle decorative fillers like small stones, flower patches, or grass tufts

These should read as scenery, not UI.

---

## 10. Memorial Marker Rules

Memorial markers must feel respectful, few in number, and intentionally placed.

They are not:
- map pins
- game objects
- draggable entities
- generalized interactive widgets

They are:
- authored scenic memorial markers
- emotionally important touchpoints
- visual invitations to pause

Markers should remain visually restrained.
No loud hover effects.
No gamified behavior.
No physics or novelty motion.

---

## 11. Marker Interaction Rules

When the user clicks a tomb, the interaction should happen in this order:

### 1. Gentle Focus

The interface should subtly guide attention toward the selected tomb.

This may be done using restrained techniques such as:
- slight scale emphasis
- slight positional focus
- slight environmental de-emphasis
- a soft camera-like feeling

This should feel like approaching a grave, not launching a cinematic effect.

### 2. Anchored Preview Card

After the focus moment, a small preview card appears visually anchored to the tomb.

This card is:
- brief
- elegant
- calm
- visually connected to the selected tomb

It is not:
- a giant centered modal
- a full-screen takeover
- a text-heavy content panel
- the memorial page itself

### 3. Enter Memorial

The preview card contains a clear action such as:
- Enter Memorial
- View Memorial

This is the bridge to the full memorial page.

### Preview Card Content

The card should stay light. Typical content:
- pet photo
- pet name
- birth and passing years or dates
- one short epitaph line
- optional owner name
- button to enter memorial
- subtle close control

If content takes more than a few seconds to absorb, it probably belongs on the memorial page instead.

### Principle

The popup is the plaque.
The memorial page is the full remembrance space.

---

## 12. Memorial Page Principle

The memorial detail page should not feel like a generic content page.

It should feel like:
- a deeper layer of the same memorial world
- quieter
- more intimate
- more spacious
- visually related to the homepage scenes

The memorial page contains:
- the full story
- deeper tribute text
- photos
- remembrance details
- optional future interactive remembrance features

The preview card never replaces the memorial page.

---

## 13. Implementation Staircase

Build in this order.
Each step must be complete, working, and reviewable before moving on.

### Phase 1 — Scenic Homepage Foundation

1. **Static single scene**  
   One full-screen authored scene. 16:9 composition. Intentional letterboxing. No markers.

2. **Marker rendering**  
   Render 5 hardcoded markers in authored positions on the single scene.

3. **Marker interaction**  
   Click marker → gentle tomb focus → anchored preview card with fake pet data.
   Do not jump to the memorial page yet unless explicitly included in the approved task.

4. **Scene navigation**  
   Add 2–3 scenes. Soft slide/fade transition. Keyboard + swipe support. Restrained controls.

5. **Basic responsive behavior**  
   Ensure scenic composition works acceptably on desktop and mobile.

### Phase 2 — Homepage Data Layer

6. **Data layer**  
   Move scenes, memorials, and placements into JSON or simple data files.

### Phase 3 — Memorial Detail

7. **Memorial detail page**  
   Real route and real memorial layout using mock data.

### Phase 4 — Browse

8. **Browse page**  
   Grid/list and basic search.

### Phase 5 — Create

9. **Create memorial page**  
   Frontend form with fake/local submit.

### Phase 6+ — Real Product Integration

10. **Django backend and real persistence**
11. **S3 media and deployment**
12. **Polish, SEO, analytics, launch**

Stop after Step 4 and you already have a strong visual demo.
Stop after Step 9 and you have a serious frontend prototype.

---

## 14. Strategic Risks

### Background Art Quality
This is the biggest visual risk.
If the art is weak, the entire product feels weaker.

### Mobile Composition
Portrait layouts require authored attention and may double scene composition work.

### Discoverability vs Emotion
The scenic homepage should remain emotional, while Browse handles utility. This balance must be protected.

### Scope Creep
The project loses power if it drifts into:
- engines
- systems
- abstractions
- feature piles
- unrelated product pages

### Tomb Interaction Quality
If the tomb click becomes a generic modal, the immersive feeling weakens significantly.

---

## 15. Principles

- Composition quality beats clever code.
- Emotional sincerity beats feature count.
- Restraint beats chrome.
- Hand-authored beats procedural.
- Simple data beats abstract managers.
- Popup preview is not memorial depth.
- The user should feel they are moving deeper into the same world.
- Ship one working step before starting the next.
