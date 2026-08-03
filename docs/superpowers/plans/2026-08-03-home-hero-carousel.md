# Home Hero Carousel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the homepage hero placeholder with an accessible three-image editorial carousel.

**Architecture:** A focused client component owns slide state, timing, reduced-motion behavior, and accessible controls. The existing server-rendered `Hero` component embeds it, while generated images live as optimized WebP assets under `public/images/home/`.

**Tech Stack:** Next.js 16 App Router, React 19, `next/image`, CSS, Playwright browser smoke tests.

## Global Constraints

- Preserve all unrelated dirty worktree changes.
- Do not add routes or dependencies.
- Generated images are editorial illustrations, never gameplay evidence.
- Do not introduce prices, odds, code strings, Update 3 features, worker behavior, or rebirth claims.
- Keep the approved order: unboxing, collection workshop, update tracker.

---

### Task 1: Add optimized carousel assets

**Files:**
- Create: `public/images/home/carousel-unboxing.webp`
- Create: `public/images/home/carousel-collection-workshop.webp`
- Create: `public/images/home/carousel-update-tracker.webp`

**Interfaces:**
- Produces three 4:3 WebP URLs consumed by `HeroCarousel`.

- [ ] Copy the approved PNG previews from `artifacts/carousel-concepts/`.
- [ ] Convert each image to WebP at 1200x900 with quality 82.
- [ ] Confirm dimensions, file size, and successful image decoding.

### Task 2: Prove the carousel behavior is missing

**Files:**
- Modify: `tests/browser_smoke.cjs`

**Interfaces:**
- Consumes the production homepage through Playwright.
- Verifies the carousel landmark, three slides, asset responses, and next-button state change.

- [ ] Add assertions for `aria-roledescription="carousel"`, three named slides, and the `Show next slide` button.
- [ ] Add a click assertion that changes the active slide from `Unbox rare toys` to `Build the collection`.
- [ ] Add HTTP status assertions for all three `/images/home/*.webp` assets.
- [ ] Run the smoke test against the current production preview and observe the expected missing-carousel failure.

### Task 3: Implement the carousel

**Files:**
- Create: `components/HeroCarousel.tsx`
- Modify: `components/Hero.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- `HeroCarousel(): JSX.Element` owns the three static slide definitions and client-side state.
- `Hero` embeds `<HeroCarousel />` in the existing right column.

- [ ] Create the client component with three slides, `next/image`, HTML captions, internal links, previous/next controls, and direct slide dots.
- [ ] Add a five-second timer that is disabled for reduced motion, hover/focus pause, or hidden documents.
- [ ] Replace the placeholder markup in `Hero.tsx` with `HeroCarousel`.
- [ ] Replace unused placeholder CSS with responsive carousel, overlay, control, focus, and transition styles.
- [ ] Build and start a fresh production preview.
- [ ] Run the browser smoke test and observe it pass.

### Task 4: Verify production quality

**Files:**
- Modify only task-related files if verification reveals a regression.

- [ ] Run `npm.cmd test`.
- [ ] Run `npm.cmd run lint`.
- [ ] Run `npm.cmd run typecheck`.
- [ ] Run `npm.cmd run build`.
- [ ] Run the full browser smoke test against a fresh production server.
- [ ] Capture and inspect desktop and mobile homepage screenshots.
- [ ] Run `git diff --check` and report the exact changed files without staging, committing, pushing, or deploying.
