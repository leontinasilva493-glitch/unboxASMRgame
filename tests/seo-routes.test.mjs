import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { test } from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("homepage metadata remains unchanged", () => {
  const home = read("app/page.tsx");

  assert.match(home, /title: "Unbox ASMR Guide — Verified Crates, Toys & Rebirth Data"/);
  assert.match(home, /description: "Verified Unbox ASMR guide with dated sources for Gamepasses, codes and events, plus evidence-gated crates, toys, rebirths and workers\."/);
});

test("wiki has an exact absolute title and an indexable hub", () => {
  const wikiPath = new URL("../app/wiki/page.tsx", import.meta.url);
  assert.equal(existsSync(wikiPath), true, "app/wiki/page.tsx must exist");

  const wiki = read("app/wiki/page.tsx");
  assert.match(wiki, /title: "Unbox ASMR Wiki"/);
  assert.match(wiki, /absoluteTitle: true/);
  assert.match(wiki, /title="Unbox ASMR Wiki"/);
  assert.doesNotMatch(wiki, /noindex: true/);
});

test("codes consolidates observed query variants without a rumor section", () => {
  const codes = read("app/codes/page.tsx");
  const auditPath = new URL("../data/code-audit.json", import.meta.url);

  assert.equal(existsSync(auditPath), true, "data/code-audit.json must be the shared code-status source");
  const audit = JSON.parse(read("data/code-audit.json"));
  const publishedCodes = JSON.parse(read("data/codes.json"));
  assert.equal(audit.checkedAt, "2026-08-06");
  assert.equal(audit.verifiedActiveCount, 0);
  assert.equal(audit.reportedCandidateCount, 3);
  assert.equal(publishedCodes.length, 0, "community reports must not enter the published active-code dataset");
  assert.match(codes, /Is there an Unbox ASMR code\?/);
  assert.match(codes, /Are there any Unbox ASMR Roblox codes\?/);
  assert.match(codes, /Are [鈥\u201c"]?Unboxing ASMR codes[鈥\u201d"]? the same game\?/);
  assert.match(codes, /Where do you enter codes in Unbox ASMR\?/);
  assert.match(codes, /When will new Unbox ASMR codes be released\?/);
  assert.match(codes, /Community discovery/);
  assert.match(codes, /In-game verification/);
  assert.match(codes, /Publish or reject/);
  assert.doesNotMatch(codes, /Expected Codes|Rumors/i);
});

test("homepage and wiki consume the shared code audit date", () => {
  const home = read("app/page.tsx");
  const wiki = read("app/wiki/page.tsx");
  const answerFinder = read("components/HomeAnswerFinder.tsx");

  assert.match(home, /codeAudit\.checkedAt/);
  assert.match(wiki, /codeAudit\.checkedAt/);
  assert.match(answerFinder, /codeAudit\.checkedAt/);
});

test("homepage Roblox Index summary uses live collection counts", () => {
  const home = read("app/page.tsx");

  assert.match(home, /crates\.length/);
  assert.match(home, /toys\.length/);
  assert.doesNotMatch(home, /seven crates and one toy/i);
});

test("beginner guide stays focused and noindex", () => {
  const beginner = read("app/beginner-guide/page.tsx");

  assert.match(beginner, /title: "Unbox ASMR Beginner Guide for Roblox"/);
  assert.match(beginner, /noindex: true/);
  assert.doesNotMatch(beginner, /Beginner Guide & Wiki|Complete Roblox Index/);
});

test("roblox index has an exact title and keeps its evidence gate", () => {
  const indexPath = new URL("../app/roblox-index/page.tsx", import.meta.url);
  assert.equal(existsSync(indexPath), true, "app/roblox-index/page.tsx must exist");

  const index = read("app/roblox-index/page.tsx");
  assert.match(index, /title: "Unbox ASMR Roblox Index"/);
  assert.match(index, /absoluteTitle: true/);
  assert.match(index, /title="Unbox ASMR Roblox Index"/);
  assert.match(index, /noindex: true/);
  assert.match(index, /Complete Index/);
  assert.match(index, /buildCollectionFilterRows/);
  assert.match(index, /buildCrateViewModels/);
  assert.match(index, /buildToyViewModels/);
  assert.match(index, /rows=\{crateRows\}/);
  assert.match(index, /rows=\{toyRows\}/);
  assert.match(index, /First community-reported snapshot/);
  assert.match(index, /EvidenceReference/);
  assert.match(index, /no current-version original capture/);
});

test("roblox index leads with usable relationships and a dated Complete Index snapshot", () => {
  const index = read("app/roblox-index/page.tsx");

  assert.match(index, /Which toy came from each crate\?/);
  assert.match(index, /4\/64 Found/);
  assert.match(index, /does not display a stable numeric item ID/);
  assert.match(index, /Conflicting Candy Key Crate prices/);
  assert.match(index, /relationRows/);
  assert.ok(index.indexOf("Which toy came from each crate?") < index.indexOf("All recorded crates"));
  assert.match(index, /title: "Unbox ASMR Roblox Index"/);
  assert.match(index, /title="Unbox ASMR Roblox Index"/);
  assert.match(index, /noindex: true/);
  assert.doesNotMatch(read("app/sitemap.ts"), /path: "\/roblox-index\/"/);
});

test("legacy crates route permanently redirects to the roblox index", () => {
  const legacy = read("app/crates-and-toys/page.tsx");
  const carousel = read("components/HeroCarousel.tsx");
  const answerFinder = read("components/HomeAnswerFinder.tsx");

  assert.match(legacy, /permanentRedirect\("\/roblox-index\/"\)/);
  assert.doesNotMatch(carousel, /href: "\/crates-and-toys\/"/);
  assert.doesNotMatch(answerFinder, /href: "\/crates-and-toys\/"/);
});

test("rebirth guide answers the decision before worker details and remains gated", () => {
  const page = read("app/rebirths-and-workers/page.tsx");
  assert.match(page, /noindex: true/);
  assert.match(page, /What does the first rebirth cost\?/);
  assert.match(page, /What resets\?/);
  assert.match(page, /What stays\?/);
  assert.match(page, /What are the rewards\?/);
  assert.match(page, /EvidenceReference/);
  assert.ok(page.indexOf("What does the first rebirth cost?") < page.indexOf("Workers and the two-worker reward"));
});

test("wiki navigation uses an accessible dropdown and keeps status pages top-level", () => {
  const site = read("lib/site.ts");
  const header = read("components/Header.tsx");
  const navBlock = site.match(/export const navItems = \[([\s\S]*?)\] as const;/)?.[1] ?? "";
  const wikiNavBlock = site.match(/export const wikiNavItems = \[([\s\S]*?)\] as const;/)?.[1] ?? "";

  assert.match(wikiNavBlock, /href: "\/wiki\/"/);
  assert.match(wikiNavBlock, /href: "\/beginner-guide\/"/);
  assert.match(wikiNavBlock, /href: "\/roblox-index\/"/);
  assert.match(wikiNavBlock, /href: "\/rebirths-and-workers\/"/);
  assert.match(wikiNavBlock, /href: "\/sources\/"/);
  assert.doesNotMatch(navBlock, /href: "\/"/);
  assert.doesNotMatch(navBlock, /href: "\/wiki\/"/);
  assert.doesNotMatch(navBlock, /href: "\/beginner-guide\/"/);
  assert.doesNotMatch(navBlock, /href: "\/roblox-index\/"/);
  assert.doesNotMatch(navBlock, /href: "\/crates-and-toys\/"/);
  assert.doesNotMatch(header, /item\.href === "\/"/);
  assert.match(header, /<details className="desktop-wiki-menu"[^>]*>/);
  assert.match(header, /<summary[^>]*>Wiki/);
  assert.match(header, /wikiNavItems\.map/);
  assert.match(header, /className="mobile-nav-group"/);
  assert.match(header, /onMouseEnter=\{openWikiMenu\}/);
  assert.match(header, /onMouseLeave=\{closeWikiMenuAfterHover\}/);
  assert.doesNotMatch(header, /wiki-menu-chevron|⌄/);
});

test("sitemap includes wiki and excludes noindex and redirect routes", () => {
  const sitemap = read("app/sitemap.ts");

  assert.match(sitemap, /path: "\/wiki\/"/);
  assert.doesNotMatch(sitemap, /path: "\/beginner-guide\/"/);
  assert.doesNotMatch(sitemap, /path: "\/roblox-index\/"/);
  assert.doesNotMatch(sitemap, /path: "\/crates-and-toys\/"/);
  assert.doesNotMatch(sitemap, /path: "\/rebirths-and-workers\/"/);
});
