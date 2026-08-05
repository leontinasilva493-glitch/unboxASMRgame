# GSC Query Landing Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Consolidate nine GSC query variants into a useful Codes page, a new Wiki hub, and an evidence-gated Roblox Index without changing the homepage metadata or indexing thin gameplay pages.

**Architecture:** Reuse the existing Next.js App Router page components, shared metadata helper, verification badges, data view models, and source components. Add one indexable Wiki route, migrate the noindex Crates & Toys data room to the noindex Roblox Index route, and express navigation and sitemap decisions centrally in the existing site modules.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 5.9, Node test runner, ESLint.

## Global Constraints

- Preserve the homepage Title `Unbox ASMR Guide — Verified Crates, Toys & Rebirth Data` and its current Description verbatim.
- Do not invent codes, code schedules, crate or toy values, odds, worker behavior, rebirth effects, or ranking verdicts.
- Keep `/beginner-guide/` and `/roblox-index/` `noindex, follow` until their evidence gates pass.
- Do not add `/asmr-roblox/` in this release.
- Preserve unrelated user changes in `README.md` and `CHANGELOG.md`.

---

### Task 1: Add SEO route regression tests

**Files:**
- Create: `tests/seo-routes.test.mjs`

**Interfaces:**
- Consumes: route source files under `app/`, `lib/site.ts`, and `app/sitemap.ts`.
- Produces: regression assertions for metadata, navigation, redirect, and sitemap gates.

- [ ] **Step 1: Write tests that assert the approved routing decisions**

Read source files with `node:fs` and assert: homepage metadata remains unchanged; `/wiki/` and `/roblox-index/` exist with absolute exact Titles; Beginner and Index retain `noindex: true`; Codes contains the four query-answer FAQs but no rumor section; `/crates-and-toys/` uses `permanentRedirect`; primary navigation includes Wiki but excludes Home and Roblox Index; sitemap contains Wiki and excludes all noindex and redirect routes.

- [ ] **Step 2: Run the test and verify it fails before implementation**

Run: `npm.cmd test`

Expected: the new SEO route tests fail because the Wiki and Roblox Index routes and redirect do not exist.

### Task 2: Implement the Wiki hub and exact-title metadata support

**Files:**
- Modify: `lib/site.ts`
- Create: `app/wiki/page.tsx`

**Interfaces:**
- Consumes: `game`, `gamepasses`, and `events` from `lib/data`, plus existing `PageIntro`, `InlineCallout`, `VerificationBadge`, `RelatedLinks`, and `SourceList` components.
- Produces: `pageMetadata({ absoluteTitle: true })` support and the indexable `/wiki/` route.

- [ ] **Step 1: Extend `pageMetadata` with `absoluteTitle?: boolean`**

When true, return `title: { absolute: title }`; keep the Open Graph title as the original string.

- [ ] **Step 2: Build the Wiki page**

Add the exact Title/H1, independent-fan disclaimer, verified quick facts, task directory, current coverage, system summaries, dated status sections, FAQ, related links, sources, and CollectionPage JSON-LD.

- [ ] **Step 3: Run the focused SEO tests**

Run: `node --test tests/seo-routes.test.mjs`

Expected: Wiki assertions pass; later route and navigation assertions still fail.

### Task 3: Strengthen the Codes landing page

**Files:**
- Modify: `app/codes/page.tsx`

**Interfaces:**
- Consumes: current official-source status and existing empty verified tables.
- Produces: one canonical answer for all four observed Code query variants.

- [ ] **Step 1: Update the metadata and direct answer structure**

Use the Title `Unbox ASMR Codes (August 2026): Active, Expired & Fake Codes`, add `Roblox` to the Description, retain the dated no-active-code answer, and explicitly state that no official release schedule is verified.

- [ ] **Step 2: Add query-aligned FAQs and safety copy**

Answer singular Code, Roblox Codes, redemption location, release timing, and failed-code questions without adding rumors or unverified instructions.

- [ ] **Step 3: Run the focused SEO tests**

Run: `node --test tests/seo-routes.test.mjs`

Expected: Codes assertions pass.

### Task 4: Separate Beginner Guide and Roblox Index intent

**Files:**
- Modify: `app/beginner-guide/page.tsx`
- Create: `app/roblox-index/page.tsx`
- Replace: `app/crates-and-toys/page.tsx`

**Interfaces:**
- Consumes: the existing Crates & Toys components, empty verified data tables, reviewed video, and evidence gate.
- Produces: focused Beginner metadata, exact-title noindex `/roblox-index/`, and a permanent redirect from the legacy route.

- [ ] **Step 1: Focus Beginner metadata**

Set its Title to `Unbox ASMR Beginner Guide for Roblox`, retain `noindex: true`, and keep its current evidence gate.

- [ ] **Step 2: Migrate the collection data room**

Move the existing content to `/roblox-index/`, change the Title/H1 and introductory language to Complete Index intent, preserve empty states, evidence sources, video limitations, and `noindex: true`.

- [ ] **Step 3: Replace the legacy page with a permanent redirect**

Call `permanentRedirect("/roblox-index/")` from `app/crates-and-toys/page.tsx`.

- [ ] **Step 4: Run the focused SEO tests**

Run: `node --test tests/seo-routes.test.mjs`

Expected: route, title, noindex, and redirect assertions pass.

### Task 5: Update navigation, homepage links, and sitemap

**Files:**
- Modify: `lib/site.ts`
- Modify: `app/page.tsx`
- Modify: `app/sitemap.ts`
- Modify: contextually affected related links in `app/beginner-guide/page.tsx` and `app/rebirths-and-workers/page.tsx`

**Interfaces:**
- Consumes: new `/wiki/` and `/roblox-index/` routes.
- Produces: intent-led primary navigation, internal links to both routes, and an indexable sitemap containing Wiki but not thin routes.

- [ ] **Step 1: Update primary navigation**

Remove the redundant Home item, add Wiki first, retain Beginner Guide, Gamepasses, Updates, and Codes, and omit Roblox Index until its evidence gate passes.

- [ ] **Step 2: Update homepage and contextual links**

Add a Wiki guide card, point collection links to `/roblox-index/`, and preserve homepage metadata verbatim.

- [ ] **Step 3: Update sitemap dates and route set**

Add `/wiki/`; exclude `/beginner-guide/`, `/roblox-index/`, `/rebirths-and-workers/`, and `/crates-and-toys/`; use explicit per-route `lastModified` values.

- [ ] **Step 4: Run all tests**

Run: `npm.cmd test`

Expected: all tests pass.

### Task 6: Verify production behavior and start local review

**Files:**
- Verify only; no planned source changes.

**Interfaces:**
- Consumes: completed route implementation.
- Produces: a production build and inspectable local URLs.

- [ ] **Step 1: Run static verification**

Run `npm.cmd run validate:data`, `npm.cmd test`, `npm.cmd run lint`, `npm.cmd run typecheck`, and `npm.cmd run build`.

Expected: all commands exit 0 and the build emits `/wiki`, `/codes`, `/beginner-guide`, `/roblox-index`, and the redirect route.

- [ ] **Step 2: Start a fresh task-owned production server**

Start `node node_modules/next/dist/bin/next start -p 3109` as a hidden background process and record its PID/log paths.

- [ ] **Step 3: Smoke-check review routes**

Request `/`, `/wiki/`, `/codes/`, `/beginner-guide/`, `/roblox-index/`, `/crates-and-toys/`, and `/sitemap.xml`. Expect HTTP 200 for content routes, a permanent redirect for the legacy route, and valid XML for the sitemap.

- [ ] **Step 4: Hand off local review links**

Report the exact build results, route/indexing decisions, local URLs, and the preserved unrelated dirty files. Do not push or deploy.
