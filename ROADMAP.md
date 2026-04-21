# ROADMAP.md

## Project

**PetHeavenOnline**

A curated scenic pet memorial website built as a respectful picture-book experience rather than a simulated world.

---

## Roadmap Principle

Plan the project in **phases**, then execute **one approved task at a time**.

Do not pre-build future phases early.  
Do not skip ahead because something seems obvious.  
Each phase should produce a working, reviewable result.

---

## Product Shape Reminder

The user journey has three layers:

1. **Scenic homepage browsing**
2. **Tomb preview interaction**
3. **Memorial detail page**

This matters because the scenic homepage should stay emotional and restrained, while deeper content is revealed gradually.

The preview popup/card is not the memorial page.  
The memorial page is not just a bigger popup.

---

## Phase 1 — Scenic Homepage Foundation

### Goal
Prove the core visual and emotional concept of the homepage.

### What this phase should prove
- the scenic homepage concept works
- the 16:9 composition approach works
- letterboxing feels intentional, not broken
- the page feels calm, premium, and respectful
- the project can be built cleanly with Vite + Vanilla JS + CSS

### Main milestones
1. static single scene
2. marker rendering
3. marker interaction: gentle tomb focus + anchored preview card
4. scene-to-scene navigation
5. basic responsive behavior

### Out of scope
- backend
- browse page
- memorial detail page
- create memorial page
- real data
- authentication
- payments

---

## Phase 2 — Homepage Data Structure

### Goal
Turn the homepage from hardcoded demo logic into a simple structured content system.

### What this phase should prove
- scenes can be defined through lightweight data
- memorials can be defined through lightweight data
- scene/memorial/placement separation works without overengineering

### Main milestones
1. move scenes into JSON or simple data files
2. move memorials into JSON or simple data files
3. move placements into JSON or simple data files
4. load and render homepage from data

### Out of scope
- backend
- CMS-like tooling
- admin logic
- complex abstractions

---

## Phase 3 — Memorial Detail Page

### Goal
Build the individual memorial experience.

### What this phase should prove
- clicking a memorial can lead to a dedicated memorial page
- memorial content can be displayed clearly and respectfully
- the site has a strong emotional destination, not just a scenic shell
- the memorial page feels like a deeper layer of the same world

### Main milestones
1. route structure for memorial pages
2. memorial detail layout
3. fake/mock memorial data rendering
4. respectful visual polish

### Out of scope
- real user submissions
- real persistence
- advanced visitor interaction systems

---

## Phase 4 — Browse Memorials Page

### Goal
Add the functional discovery layer without polluting the scenic homepage.

### What this phase should prove
- visitors can find specific pets without relying only on scenic browsing
- the product supports both emotion and function
- the functional page can coexist with the atmospheric homepage without damaging it

### Main milestones
1. browse page layout
2. memorial grid/list
3. basic search/filter
4. navigation link between home and browse

### Out of scope
- advanced search infrastructure
- unnecessary categories
- personalization

---

## Phase 5 — Create Memorial Frontend

### Goal
Build the frontend memorial creation flow.

### What this phase should prove
- the product has a clear conversion path
- memorial creation UX is understandable
- monetization/conversion thinking has a place to live later

### Main milestones
1. create page layout
2. form fields
3. image upload placeholder behavior
4. localStorage or fake submit flow
5. confirmation state

### Out of scope
- real backend persistence
- payments
- moderation/admin tooling

---

## Phase 6 — Backend Integration

### Goal
Connect the frontend product to a real system.

### What this phase should prove
- memorials can persist
- users can create and retrieve data
- media handling works
- the app can become a real product

### Main milestones
1. Django backend setup
2. PostgreSQL integration
3. memorial model/data flow
4. API or template integration path
5. S3 media upload
6. Render deployment flow

### Out of scope
- overbuilt infrastructure
- advanced scaling work
- non-essential devops complexity

---

## Phase 7 — Product Readiness

### Goal
Make the product stable, usable, and launchable.

### What this phase should prove
- the product is coherent end-to-end
- key user flows work
- visuals and UX are polished enough for public use

### Main milestones
1. loading and error states
2. responsive refinement
3. SEO basics
4. analytics
5. cleanup/refactor pass
6. soft launch checklist

---

## Crossroads Rule

If a major question appears about:
- architecture
- roadmap order
- monetization structure
- UX direction
- scene system direction
- memorial interaction direction

pause implementation and discuss with Opus before continuing.

---

## Working Rule

At any moment, only one task is active.

Workflow:
1. ChatGPT defines the next concrete task
2. Sonnet proposes a short plan
3. ChatGPT reviews the plan
4. Sonnet implements
5. User checks `git status` and `git diff`
6. ChatGPT reviews the diff
7. Claude updates `SESSION.md`
8. only then commit/push

---

## Current Focus

**Current phase:** Phase 1 — Scenic Homepage Foundation

**Current target:** Step 1 of Phase 1

Build a static single-scene homepage foundation with:
- one full-screen scenic background
- 16:9 composition handling
- intentional letterbox fill
- no markers yet
- no marker interaction yet
- no scene navigation yet
- desktop and mobile sanity check

That is all.

Do not build ahead into later steps until Step 1 is approved and reviewed.