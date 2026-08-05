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

  assert.match(codes, /Is there an Unbox ASMR code\?/);
  assert.match(codes, /Are there any Unbox ASMR Roblox codes\?/);
  assert.match(codes, /Where do you enter codes in Unbox ASMR\?/);
  assert.match(codes, /When will new Unbox ASMR codes be released\?/);
  assert.doesNotMatch(codes, /Expected Codes|Rumors/i);
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
});

test("legacy crates route permanently redirects to the roblox index", () => {
  const legacy = read("app/crates-and-toys/page.tsx");
  const carousel = read("components/HeroCarousel.tsx");
  const answerFinder = read("components/HomeAnswerFinder.tsx");

  assert.match(legacy, /permanentRedirect\("\/roblox-index\/"\)/);
  assert.doesNotMatch(carousel, /href: "\/crates-and-toys\/"/);
  assert.doesNotMatch(answerFinder, /href: "\/crates-and-toys\/"/);
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
