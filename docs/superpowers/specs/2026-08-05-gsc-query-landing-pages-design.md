# GSC Query Landing Pages Design

## Goal

Turn the nine observed GSC query variants into a small set of useful, non-competing landing pages while preserving the site's evidence rules and the existing homepage title and description.

## Query-to-page map

| Query cluster | Canonical landing page | Indexing decision |
| --- | --- | --- |
| `unbox asmr codes`, `unbox asmr code`, `unbox asmr roblox codes`, `code unbox asmr` | `/codes/` | Index |
| `unbox asmr wiki`, `unbox asmr roblox wiki` | `/wiki/` | Index |
| `unbox asmr roblox index` | `/roblox-index/` | Noindex until the first useful current-version crate and toy dataset is present |
| `unbox asmr` | `/` | Index; preserve the existing Title and Description |
| `asmr roblox` | No new route in this release | Defer until the site intentionally expands beyond one game |

No singular/plural or reordered Code query receives a separate URL. The variants share one search task and will be answered naturally in `/codes/` headings and FAQ copy.

## Page responsibilities

### `/codes/`

Keep one dated, indexable answer page. The first screen states whether any active code is verified, the exact check date, and what the public sources can prove. The page contains active and expired tables, the redemption-interface status, non-code rewards, fake-code safety, verification steps, and FAQs for the observed query variants. It must not publish predicted codes, rumor strings, or a release date that an official source has not announced.

### `/wiki/`

Create an indexable Wiki hub with the exact document title and H1 `Unbox ASMR Wiki`. It is an independent fan resource, not an official wiki. It provides verified quick facts, a task-based directory, current coverage counts, short system summaries, current Codes and Update status, a verification log, FAQs, and traceable sources. It must provide its own useful snapshot rather than act as a thin list of links.

### `/beginner-guide/`

Keep the page focused on a first-session task and use the Title and H1 `Unbox ASMR Beginner Guide for Roblox`. Do not add `Wiki` or `Index` to its metadata. It remains `noindex, follow` until original current-version evidence proves the first crate-to-toy loop, sell path, and worker delivery. The reviewed third-party video remains contextual evidence, not proof of values or optimal strategy.

### `/roblox-index/`

Move the existing Crates & Toys evidence-ready structure to this route and use the exact document title and H1 `Unbox ASMR Roblox Index`. The route covers collection status, capture order, crate and toy tables, Complete Index fields, missing entries, the reviewed gameplay video, and source rules. It stays `noindex, follow` while the verified entity tables are empty. The old `/crates-and-toys/` route redirects permanently to `/roblox-index/` so two overlapping data pages do not compete.

## Navigation and internal links

The brand remains the Home link, so the redundant `Home` text link is removed. On desktop, `Wiki` is a hover, click, and keyboard-accessible dropdown containing Wiki Home, Beginner Guide, Roblox Index, Rebirths & Workers, and Sources & Verification. Gamepasses, Updates, and Codes remain top-level links, followed by the existing Roblox CTA. On mobile, the same destinations appear in a labelled `Wiki & Guides` group rather than a hover-dependent control. `Roblox Index` is discoverable from this guide menu but remains visibly evidence-gated until its dataset passes the indexing threshold.

The homepage keeps its existing Title and Description. It gains a Wiki task card and points its Crates & Toys card and data-room summary to `/roblox-index/`.

## Sitemap and metadata

Add `/wiki/` to the sitemap. Keep `/beginner-guide/`, `/roblox-index/`, `/rebirths-and-workers/`, and the redirecting `/crates-and-toys/` out of it while they are noindex or non-canonical. Use page-specific `lastModified` values instead of assigning one date to every URL. Only `/wiki/` and `/roblox-index/` use absolute Titles because the approved keyword phrase must be the complete document title.

## Evidence and error states

Unknown gameplay values remain visibly unknown. Empty Code results are a legitimate dated answer; empty collection tables are not yet a useful Index. Missing current-version evidence must never be replaced with copied prices, odds, rewards, routes, multipliers, ranking verdicts, rumored codes, or guessed release timing.

## Verification

Automated checks cover query consolidation, exact Wiki and Index Titles, the continued noindex gates, redirect behavior, navigation, sitemap inclusion/exclusion, and preservation of homepage metadata. Release verification runs data validation, unit tests, lint, TypeScript checking, a production build, and HTTP smoke checks for `/`, `/wiki/`, `/codes/`, `/beginner-guide/`, `/roblox-index/`, and `/crates-and-toys/`.
