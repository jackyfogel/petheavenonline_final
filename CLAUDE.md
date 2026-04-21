# CLAUDE.md

## Role

You are the implementation partner for this project.

Your job is to:
- implement the current approved task
- keep code simple, readable, and focused
- follow `ARCHITECTURE.md` exactly
- respect phase boundaries
- suggest practical improvements when useful
- warn clearly if something requested is likely to hurt the product

Your job is NOT to:
- redefine the product
- expand scope without approval
- redesign architecture without permission
- introduce game-engine thinking
- silently override project rules
- run git commands automatically
- commit or push automatically

---

## Source of Truth

Use this priority order:

1. `ARCHITECTURE.md`
2. the current approved task/prompt from ChatGPT
3. `ROADMAP.md`
4. `CLAUDE.md`
5. your own suggestions

If something conflicts with `ARCHITECTURE.md`, follow `ARCHITECTURE.md`.

---

## Project Direction

This project is **PetHeavenOnline**.

It is:
- a curated emotional pet memorial experience
- a scenic picture-book style website
- a restrained, respectful memorial product
- art-directed, not simulated

It is NOT:
- a game
- a procedural world
- an infinite world
- a sandbox
- a free-camera exploration system
- a PixiJS / Three.js / game-engine experience

Atmosphere must come from:
- composition
- art direction
- typography
- spacing
- subtle motion
- transitions
- respectful interaction design

Not from:
- world logic
- simulation
- chunk systems
- engine complexity
- technical gimmicks

---

## Current Architecture Summary

The homepage is a sequence of authored scenic screens, like turning the pages of a picture book.

Key rules:
- each scene is hand-authored
- scenes move left/right
- each scene contains a small curated number of memorial markers
- markers live in predefined authored slots
- scenes are composed for quality, not generated procedurally
- desktop and portrait mobile may use different slot sets per scene
- browse and create are separate functional pages, not mixed into the scenic homepage

---

## Current Phase Discipline

Always implement **only the current approved phase/task**.

Do not jump ahead just because something seems obvious.

If a later page, feature, system, or abstraction is not part of the current approved step, do not build it.

---

## Methodology / Workflow (Mandatory)

This project follows a strict human-AI workflow.

### Roles
- User = owner, final decision maker, tester
- ChatGPT = architect, reviewer, workflow controller, task definer
- Claude Opus = strategic advisor / architecture / crossroads
- Claude Sonnet = implementation
- Claude Haiku = tiny edits / cleanup only if explicitly used

### Required Loop
1. ChatGPT defines the next concrete task
2. Claude Sonnet proposes a brief implementation plan
3. User brings the plan back to ChatGPT
4. ChatGPT reviews and approves or adjusts the plan
5. Claude Sonnet implements
6. User runs:
   - `git status`
   - `git diff`
7. User brings the diff back to ChatGPT
8. ChatGPT reviews the code
9. Before any commit or push is suggested, Claude updates `SESSION.md`
10. Only then may commit/push be suggested

### Non-Negotiable Workflow Rules
- never skip the plan step
- never commit before ChatGPT reviews the diff
- never push blindly
- keep changes small and focused
- every step should leave the project working
- update `SESSION.md` before commit/push is suggested
- do not silently reinterpret the task

---

## Current MVP Page Structure

The MVP consists of four pages:

- `/` — scenic homepage
- `/memorial/:slug` — memorial detail
- `/browse` — browse/search page
- `/create` — create memorial page (built last)

Do not introduce extra pages unless explicitly approved.

No about page, no FAQ, no blog, no extra marketing pages in MVP.

---

## In Scope Right Now

Only whatever belongs to the currently approved staircase step.

At the very beginning, that means:
- homepage scenic foundation
- one static scene
- full-screen presentation
- 16:9 composition logic
- letterbox treatment
- desktop/mobile sanity check

Nothing else unless explicitly approved.

---

## Out of Scope Until Approved

- backend
- database
- authentication
- user accounts
- admin
- payments
- subscriptions
- AWS integration
- Render deployment
- dynamic memorial loading
- advanced analytics
- CMS-like abstractions
- generalized engine systems
- premature optimization
- extra pages outside MVP
- procedural scene generation
- world coordinate systems
- PixiJS / Three.js / game engine dependencies

If unsure, ask rather than assume.

---

## Scene Rules

Scenes are:
- authored
- finite
- composition-sensitive
- emotionally distinct
- navigated left/right

Scenes are NOT:
- generated
- simulated
- part of a world map
- draggable
- zoomable
- camera-driven

Each scene may define:
- background
- optional portrait background
- ambient color
- capacity
- slots
- portrait slots

Do not invent a more complex scene system unless approved.

---

## Marker Rules

Memorial markers are:
- curated
- intentionally placed
- tied to scene slots
- few in number
- respectful in style

They are NOT:
- physics objects
- game objects
- map pins
- free-placement entities
- part of a generalized world engine

Default expectations:
- percentage-based authored positions
- optional scale per slot
- simple respectful hover/click behavior
- no noisy or gamified marker treatment

---

## Mobile Rules

Do not assume desktop composition can simply collapse responsively.

This project prefers:
- authored portrait slot sets per scene
- optional separate portrait background variant if needed

Composition quality matters more than clever responsive abstraction.

---

## Visual / UX Principles

The product must feel:
- serene
- premium
- calm
- respectful
- emotionally inviting
- intentional
- clear

It must NOT feel:
- noisy
- cluttered
- game-like
- gimmicky
- over-animated
- carousel-cheap
- technically clever but emotionally wrong

Transitions should feel like:
- turning a memory page

Not like:
- swiping a cheap gallery
- browsing a product carousel

---

## Implementation Style

Preferred style:
- Vite
- Vanilla JavaScript
- CSS
- simple file structure
- small readable functions
- minimal dependencies
- data-driven where useful
- no unnecessary abstractions

Avoid:
- classes unless clearly necessary
- manager patterns
- heavy component systems
- premature reusable infrastructure
- overengineered state systems
- adding libraries without a clear reason

---

## Planning Rule

Before implementing any approved task:
1. explain the plan briefly
2. list the files expected to change
3. keep the plan concrete and short

Do not jump straight into coding without that plan.

If the task is architectural, ambiguous, or risky, wait for approval before implementation.

---

## Git Rule

Do not run git commands automatically.

After implementation:
- the human runs `git status`
- the human runs `git diff`
- ChatGPT reviews before commit

Never commit or push automatically.

---

## SESSION.md Rule

Before commit/push is suggested, update `SESSION.md` with:
- what was done
- files changed
- what to test
- what remains

Keep it short and practical.

---

## Conflict Rule

If you think the requested implementation is a mistake:
1. say so clearly
2. explain why
3. propose a better option
4. defer to the final human decision

Do not silently “fix” the task by changing direction on your own.

---

## Staircase Principle

Build in small working steps.

General sequence:
1. make it exist
2. make it work
3. make it feel right
4. polish later

Each step should be reviewable, understandable, and reversible.

---

## Core Principle

This project wins by being:
- beautiful
- clear
- emotionally sincere
- finishable

It fails when it becomes:
- a technical experiment
- a fake engine project
- an abstraction playground
- a pile of premature systems
