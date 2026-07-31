# Quick MVP SEO Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align the site's rendered TDH and structured data with its verified-data positioning without changing routes or evidence-based indexing gates.

**Architecture:** Keep the existing Next.js App Router pages and shared `pageMetadata()` helper. Add render-level assertions to the existing browser smoke suite, then make minimal copy and JSON-LD changes in the affected server components.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Node test runner, Playwright.

## Global Constraints

- Preserve all existing routes and trailing-slash canonicals.
- Preserve `noindex, follow` on `/beginner-guide/`, `/crates-and-toys/`, and `/rebirths-and-workers/`.
- Do not add unverified gameplay data or claim daily updates, completeness, rankings, or value verdicts.
- Do not change visual layout, navigation, data models, or public URLs.
- Keep structured data limited to content visibly present on the page.

---

### Task 1: Rendered SEO regression coverage

**Files:**
- Modify: `tests/browser_smoke.cjs`
- Modify: `package.json`
- Modify: `package-lock.json`

**Interfaces:**
- Consumes: production pages served from `TEST_BASE`.
- Produces: render-level assertions for page titles, descriptions, H1 text, robots directives, and homepage JSON-LD.

- [x] Add exact expected TDH values for `/`, `/crates-and-toys/`, `/rebirths-and-workers/`, and `/gamepasses/`.
- [x] Add assertions that the homepage and Gamepasses page do not make unsupported `Wiki`, `Best`, or `Worth It` claims.
- [x] Add an assertion that the homepage does not emit `FAQPage` JSON-LD.
- [x] Run the browser smoke suite against the unmodified pages and confirm it fails on the old title.
- [x] Add Playwright as a development dependency so the repository-owned browser smoke command is reproducible.

### Task 2: Honest TDH and structured data

**Files:**
- Modify: `app/page.tsx`
- Modify: `components/Hero.tsx`
- Modify: `app/crates-and-toys/page.tsx`
- Modify: `app/rebirths-and-workers/page.tsx`
- Modify: `app/gamepasses/page.tsx`

**Interfaces:**
- Consumes: existing `pageMetadata()` and `PageIntro` APIs.
- Produces: rendered metadata and H1 values matching the verified-data positioning.

- [x] Change the homepage title to `Unbox ASMR Guide — Verified Crates, Toys & Rebirth Data`.
- [x] Change the homepage description to the approved dated-source and evidence-gated copy.
- [x] Change the homepage H1 to `Unbox ASMR — Verified Guide & Data Tracker`.
- [x] Remove homepage `FAQPage` JSON-LD while keeping visible FAQs.
- [x] Change Crates/Toys metadata and retain its current H1 and `noindex` gate.
- [x] Change Rebirths/Workers metadata and retain its current H1 and `noindex` gate.
- [x] Change Gamepasses title and H1 to a price/effect tracker without a value verdict.
- [x] Run the browser smoke suite and confirm all new render assertions pass.

### Task 3: Full verification

**Files:**
- Verify only; no additional production files expected.

**Interfaces:**
- Consumes: the complete repository state after Tasks 1 and 2.
- Produces: fresh evidence for tests, lint, types, build output, browser rendering, sitemap, and repository cleanliness.

- [x] Run `npm test`.
- [x] Run `npm run lint`.
- [x] Run `npm run typecheck`.
- [x] Run `npm run build`.
- [x] Run the browser smoke suite against `npm run start`.
- [x] Inspect `git diff --check`, `git status --short`, and the final diff.
- [x] Reconfirm that noindex routes remain absent from `sitemap.xml`.
