const fs = require("node:fs");
const { chromium } = require("playwright");

const BASE = process.env.TEST_BASE || "http://127.0.0.1:3107";
const ROUTES = [
  "/", "/beginner-guide/", "/crates-and-toys/", "/rebirths-and-workers/",
  "/gamepasses/", "/updates/", "/codes/", "/about/", "/sources/",
  "/privacy/", "/terms/", "/robots.txt", "/sitemap.xml",
];
const NOINDEX = ["/beginner-guide/", "/crates-and-toys/", "/rebirths-and-workers/"];
const EXPECTED_SEO = {
  "/": {
    title: "Unbox ASMR Guide — Verified Crates, Toys & Rebirth Data",
    description: "Verified Unbox ASMR guide with dated sources for Gamepasses, codes and events, plus evidence-gated crates, toys, rebirths and workers.",
    h1: "Unbox ASMR Roblox Guide & Verified Data Tracker",
  },
  "/beginner-guide/": {
    title: "Unbox ASMR Beginner Guide: Sell Toys, Workers & Crates | Unbox ASMR Guide",
    description: "A cautious beginner path for Unbox ASMR on Roblox, separating official starting facts from gameplay steps that still need current-version captures.",
    h1: "Unbox ASMR Roblox Beginner Guide",
  },
  "/crates-and-toys/": {
    title: "Unbox ASMR Crates & Toys — Prices, Rarity & Sources | Unbox ASMR Guide",
    description: "Evidence-gated Unbox ASMR crates and toys tables for Roblox. Unverified prices, odds, rarity, and cash values are never guessed.",
    h1: "Unbox ASMR Roblox Crates and Toys List",
  },
  "/rebirths-and-workers/": {
    title: "Unbox ASMR Rebirths & Workers — Costs, Resets & Unlocks | Unbox ASMR Guide",
    description: "A safe Unbox ASMR rebirth and workers guide for Roblox that keeps resets, rewards, and offline behavior unverified until proven.",
    h1: "Unbox ASMR Roblox Rebirths and Workers Guide",
  },
  "/gamepasses/": {
    title: "Unbox ASMR Gamepasses — Prices & Verified Effects | Unbox ASMR Guide",
    description: "Dated Unbox ASMR Gamepass price snapshots for Roblox, with effects and value verdicts withheld until in-game verification.",
    h1: "Unbox ASMR Roblox Gamepass Price and Effect Tracker",
  },
  "/updates/": {
    title: "Unbox ASMR Update 3 & Admin Abuse Time | Unbox ASMR Guide",
    description: "The reported Unbox ASMR Update 3 and Admin Abuse schedule with local time, a pre-update public check, and a strict implementation-evidence boundary.",
    h1: "Unbox ASMR Roblox Update 3 and Admin Abuse",
  },
  "/codes/": {
    title: "Unbox ASMR Codes (August 2026): No Verified Active Codes | Unbox ASMR Guide",
    description: "No reliably verified active Unbox ASMR codes as of August 1, 2026. See the official-source check, redemption status, and verification rule.",
    h1: "Unbox ASMR Roblox Codes (August 2026)",
  },
};
const assert = (condition, message) => { if (!condition) throw new Error(message); };

function containsJsonLdType(value, type) {
  if (Array.isArray(value)) return value.some((item) => containsJsonLdType(item, type));
  if (!value || typeof value !== "object") return false;
  if (value["@type"] === type) return true;
  return Object.values(value).some((item) => containsJsonLdType(item, type));
}

(async () => {
  fs.mkdirSync("artifacts", { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const desktop = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
  const consoleErrors = [];
  desktop.on("console", (msg) => { if (msg.type() === "error") consoleErrors.push(msg.text()); });
  desktop.on("pageerror", (error) => consoleErrors.push(String(error)));
  const titles = new Set();
  const h1s = new Set();

  for (const route of ROUTES) {
    console.log(`Checking ${route}`);
    const response = await desktop.goto(BASE + route, { waitUntil: "networkidle" });
    assert(response && response.status() === 200, `${route} returned ${response ? response.status() : "no response"}`);
    if (route.endsWith(".txt") || route.endsWith(".xml")) continue;
    await desktop.locator("h1").first().waitFor({ state: "visible" });
    await desktop.waitForFunction(() => document.title.length > 0, null, { timeout: 5000 }).catch(async () => {
      const head = await desktop.locator("head").innerHTML();
      const body = await desktop.locator("body").innerText();
      throw new Error(`document.title stayed empty at ${route}; console=${consoleErrors.join(" | ")}; head=${head.slice(0, 800)}; body=${body.slice(0, 800)}`);
    });
    const title = await desktop.title();
    const h1 = await desktop.locator("h1").first().textContent();
    assert(title && !titles.has(title), `duplicate or empty title at ${route}: ${title}`);
    assert(h1 && !h1s.has(h1), `duplicate or empty H1 at ${route}: ${h1}`);
    const expected = EXPECTED_SEO[route];
    if (expected) {
      const description = await desktop.locator('meta[name="description"]').getAttribute("content");
      assert(title === expected.title, `unexpected title at ${route}: ${title}`);
      assert(description === expected.description, `unexpected description at ${route}: ${description}`);
      assert(h1.trim() === expected.h1, `unexpected H1 at ${route}: ${h1}`);
    }
    titles.add(title);
    h1s.add(h1);
    const canonical = await desktop.locator('link[rel="canonical"]').getAttribute("href");
    assert(canonical && canonical.startsWith("https://"), `missing canonical at ${route}`);
    if (NOINDEX.includes(route)) {
      const robots = (await desktop.locator('meta[name="robots"]').getAttribute("content")) || "";
      assert(robots.toLowerCase().includes("noindex"), `expected noindex at ${route}: ${robots}`);
    }
  }

  await desktop.goto(BASE + "/", { waitUntil: "networkidle" });
  const homeH1 = await desktop.locator("h1").innerText();
  const homeEntityText = `${homeH1} ${await desktop.locator(".hero-lead").innerText()}`;
  assert(/Unbox ASMR on Roblox/i.test(homeEntityText), "homepage hero does not disambiguate Unbox ASMR on Roblox");
  assert(await desktop.locator('a[href*="roblox.com/games/112233638491976"]').count() >= 2, "official Roblox CTAs missing");
  assert(await desktop.locator("details").count() >= 4, "visible homepage FAQs missing");
  const answerFinder = desktop.locator('[aria-label="Unbox ASMR Roblox quick answer finder"]');
  assert(await answerFinder.count() === 1, "homepage quick answer finder is missing");
  await answerFinder.locator("select").selectOption("codes");
  await answerFinder.locator('button[type="submit"]').click();
  assert(await desktop.locator("#answer-codes").getAttribute("data-selected") === "true", "quick answer finder did not select the requested on-page answer");
  const homepageWords = (await desktop.locator("main").innerText()).trim().split(/\s+/).length;
  assert(homepageWords >= 1200 && homepageWords <= 1800, `homepage word count outside target range: ${homepageWords}`);
  const homeTitleAndH1 = `${await desktop.title()} ${homeH1}`;
  assert(!/\bwiki\b/i.test(homeTitleAndH1), `homepage TDH still uses wiki positioning: ${homeTitleAndH1}`);
  const jsonLd = await desktop.locator('script[type="application/ld+json"]').allTextContents();
  const parsedJsonLd = jsonLd.map((value) => JSON.parse(value));
  assert(!parsedJsonLd.some((value) => containsJsonLdType(value, "FAQPage")), "homepage still emits FAQPage JSON-LD");

  const heroCarousel = desktop.locator('[aria-roledescription="carousel"]');
  assert(await heroCarousel.count() === 1, "homepage hero carousel is missing");
  const carouselSlides = heroCarousel.locator('[role="group"][aria-roledescription="slide"]');
  assert(await carouselSlides.count() === 3, "homepage hero carousel does not expose three slides");
  assert((await heroCarousel.locator('[data-active="true"] .hero-slide-title').innerText()) === "Unbox rare toys", "homepage hero carousel starts on the wrong slide");
  await heroCarousel.getByRole("button", { name: "Show next slide" }).click();
  await heroCarousel.locator('[data-active="true"] .hero-slide-title').filter({ hasText: "Build the collection" }).waitFor({ state: "visible" });
  assert((await heroCarousel.locator('[data-active="true"] .hero-slide-title').innerText()) === "Build the collection", "homepage hero carousel next control did not change the active slide");
  for (const asset of [
    "/images/home/carousel-unboxing.webp",
    "/images/home/carousel-collection-workshop.webp",
    "/images/home/carousel-update-tracker.webp",
  ]) {
    const assetResponse = await desktop.request.get(BASE + asset);
    assert(assetResponse.status() === 200, `${asset} returned ${assetResponse.status()}`);
    assert((assetResponse.headers()["content-type"] || "").includes("image/webp"), `${asset} is not served as WebP`);
  }
  await desktop.screenshot({ path: "artifacts/home-desktop.png", fullPage: true });

  await desktop.goto(BASE + "/gamepasses/", { waitUntil: "networkidle" });
  const gamepassTitleAndH1 = `${await desktop.title()} ${await desktop.locator("h1").innerText()}`;
  assert(!/\bbest\b|worth it/i.test(gamepassTitleAndH1), `Gamepasses TDH overstates the evidence: ${gamepassTitleAndH1}`);
  const gamepassText = await desktop.locator("main").innerText();
  assert(gamepassText.includes("Effect verification queue"), "Gamepasses page is missing the effect verification queue");
  assert(gamepassText.includes("Public price only"), "Gamepasses page does not separate public prices from verified effects");
  await desktop.screenshot({ path: "artifacts/quick-mvp-gamepasses.png", fullPage: true });

  await desktop.goto(BASE + "/updates/", { waitUntil: "networkidle" });
  await desktop.waitForTimeout(1100);
  const values = (await desktop.locator(".countdown-grid strong").allTextContents()).map(Number);
  assert(values.every((value) => value >= 0), `negative countdown: ${values.join(",")}`);
  assert((await desktop.locator(".local-time").innerText()).includes("Your local time"), "local time missing");
  const updatesText = await desktop.locator("main").innerText();
  assert(updatesText.includes("Pre-update public check"), "Updates page is missing the August 1 public checkpoint");
  assert(updatesText.includes("Implementation status: not yet verified"), "Updates page overstates the pre-launch event status");
  await desktop.screenshot({ path: "artifacts/updates-desktop.png", fullPage: true });

  await desktop.goto(BASE + "/codes/", { waitUntil: "networkidle" });
  const codesText = await desktop.locator("main").innerText();
  assert(codesText.includes("Checked August 1, 2026"), "Codes page does not show the fresh public-source check");
  assert(codesText.includes("No code string is published"), "Codes page does not distinguish an official codes mention from an active code");
  await desktop.screenshot({ path: "artifacts/quick-mvp-codes.png", fullPage: true });

  await desktop.goto(BASE + "/beginner-guide/", { waitUntil: "networkidle" });
  const beginnerText = await desktop.locator("main").innerText();
  assert(beginnerText.includes("Official Roblox listing"), "Beginner guide does not identify its safe public-source baseline");
  assert(beginnerText.includes("Like the game and join the group"), "Beginner guide is missing the official worker-reward condition");
  assert(beginnerText.includes("Gameplay capture still required"), "Beginner guide does not expose the remaining screenshot gate");
  await desktop.screenshot({ path: "artifacts/quick-mvp-beginner.png", fullPage: true });

  await desktop.goto(BASE + "/rebirths-and-workers/", { waitUntil: "networkidle" });
  const progressionText = await desktop.locator("main").innerText();
  assert(progressionText.includes("Publicly advertised worker reward"), "Workers page is missing the official reward baseline");
  assert(progressionText.includes("First rebirth safety checklist"), "Rebirth page is missing the actionable pre-confirmation checklist");
  await desktop.screenshot({ path: "artifacts/quick-mvp-progression.png", fullPage: true });

  await desktop.goto(BASE + "/crates-and-toys/", { waitUntil: "networkidle" });
  const collectionText = await desktop.locator("main").innerText();
  assert(collectionText.includes("Starter dataset status"), "Crates and Toys page is missing its scoped MVP status");
  assert(collectionText.includes("Official description confirms crates and toys"), "Crates and Toys page is missing the official fact boundary");
  await desktop.screenshot({ path: "artifacts/quick-mvp-collection.png", fullPage: true });

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
  const mobileErrors = [];
  mobile.on("console", (msg) => { if (msg.type() === "error") mobileErrors.push(msg.text()); });
  mobile.on("pageerror", (error) => mobileErrors.push(String(error)));
  for (const route of ["/", "/crates-and-toys/", "/gamepasses/", "/updates/"]) {
    await mobile.goto(BASE + route, { waitUntil: "networkidle" });
    const dimensions = await mobile.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }));
    assert(dimensions.scroll <= dimensions.client + 1, `horizontal page overflow at ${route}: ${JSON.stringify(dimensions)}`);
  }
  await mobile.goto(BASE + "/", { waitUntil: "networkidle" });
  await mobile.locator("details.mobile-nav summary").click();
  assert(await mobile.locator("details.mobile-nav nav").isVisible(), "mobile navigation did not open");
  await mobile.screenshot({ path: "artifacts/home-mobile.png", fullPage: true });

  const sitemap = await (await desktop.request.get(BASE + "/sitemap.xml")).text();
  for (const route of NOINDEX) assert(!sitemap.includes(route), `noindex route leaked into sitemap: ${route}`);
  assert(consoleErrors.length === 0, `desktop console errors: ${consoleErrors.join(" | ")}`);
  assert(mobileErrors.length === 0, `mobile console errors: ${mobileErrors.join(" | ")}`);
  await browser.close();
  console.log(`Browser smoke passed: ${ROUTES.length} routes, desktop/mobile, countdown, SEO, and console checks.`);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
