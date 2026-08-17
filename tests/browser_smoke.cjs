const fs = require("node:fs");
const { chromium } = require("playwright");

const BASE = process.env.TEST_BASE || "http://127.0.0.1:3107";
const ROUTES = [
  "/", "/wiki/", "/beginner-guide/", "/roblox-index/", "/rebirths-and-workers/",
  "/gamepasses/", "/updates/", "/codes/", "/about/", "/sources/",
  "/privacy/", "/terms/", "/robots.txt", "/sitemap.xml",
];
const NOINDEX = ["/beginner-guide/", "/roblox-index/", "/rebirths-and-workers/"];
const EXPECTED_SEO = {
  "/": {
    title: "Unbox ASMR Guide — Verified Crates, Toys & Rebirth Data",
    description: "Verified Unbox ASMR guide with dated sources for Gamepasses, codes and events, plus evidence-gated crates, toys, rebirths and workers.",
    h1: "Unbox ASMR Roblox Guide & Verified Data Tracker",
  },
  "/beginner-guide/": {
    title: "Unbox ASMR Beginner Guide for Roblox | Unbox ASMR Guide",
    description: "A cautious beginner path for Unbox ASMR on Roblox, separating official starting facts from gameplay steps that still need current-version captures.",
    h1: "Unbox ASMR Roblox Beginner Guide",
  },
  "/roblox-index/": {
    title: "Unbox ASMR Roblox Index",
    description: "Evidence-gated Unbox ASMR Roblox Index for crates, toys, rarity, source crates, values, and Complete Index entries verified in the current game.",
    h1: "Unbox ASMR Roblox Index",
  },
  "/rebirths-and-workers/": {
    title: "Unbox ASMR Rebirths & Workers — Costs, Resets & Unlocks | Unbox ASMR Guide",
    description: "Unbox ASMR rebirth requirement, reset, keep, and reward answers from dated Roblox gameplay, followed by the official two-worker condition and evidence limits.",
    h1: "Unbox ASMR Roblox Rebirths and Workers Guide",
  },
  "/gamepasses/": {
    title: "Unbox ASMR Gamepasses Guide — All 7 Prices (August 2026) | Unbox ASMR Guide",
    description: "All seven dated Unbox ASMR Gamepass price snapshots for Roblox, with effects and value verdicts withheld until in-game verification.",
    h1: "Unbox ASMR Gamepasses Guide: Prices & Evidence",
  },
  "/updates/": {
    title: "Unbox ASMR Updates — Latest Official Check & Event Status | Unbox ASMR Guide",
    description: "Latest official Unbox ASMR Roblox listing check, archived event timing, gameplay verification gaps, and the weather-events evidence queue.",
    h1: "Unbox ASMR Updates and Event Status",
  },
  "/codes/": {
    title: "Unbox ASMR Codes (August 2026): Active, Expired & Fake Codes | Unbox ASMR Guide",
    description: "No verified active Unbox ASMR Roblox codes as of August 11, 2026. Check three reported candidates, redemption evidence, fake-code warnings, and official sources.",
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
  await desktop.route("https://www.clarity.ms/**", (route) => route.fulfill({ status: 200, contentType: "application/javascript", body: "" }));
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
  await desktop.waitForFunction(() => typeof window.clarity === "function");
  assert(await desktop.locator("script#microsoft-clarity").count() === 1, "Microsoft Clarity bootstrap is missing");
  const homeH1 = await desktop.locator("h1").innerText();
  const homeEntityText = `${homeH1} ${await desktop.locator(".hero-lead").innerText()}`;
  assert(/Unbox ASMR on Roblox/i.test(homeEntityText), "homepage hero does not disambiguate Unbox ASMR on Roblox");
  assert(await desktop.locator('a[href*="roblox.com/games/112233638491976"]').count() >= 2, "official Roblox CTAs missing");
  assert(await desktop.locator("details").count() >= 4, "visible homepage FAQs missing");
  const relatedGame = desktop.getByRole("region", { name: "Related game recommendation" });
  assert(await relatedGame.count() === 1, "homepage related-game recommendation is missing");
  assert((await relatedGame.getByRole("heading", { level: 2 }).innerText()) === "Try another game that rewards curiosity", "related-game heading is unclear");
  const relatedGameLinks = relatedGame.locator('a[href^="https://bigwalkwalkthrough.com"]');
  assert(await relatedGameLinks.count() === 8, "Big Walk recommendation does not expose all eight useful destinations");
  const expectedBigWalkLinks = [
    ["Big Walk walkthrough", "https://bigwalkwalkthrough.com/"],
    ["Big Walk puzzle guide", "https://bigwalkwalkthrough.com/puzzles"],
    ["Big Walk routes", "https://bigwalkwalkthrough.com/walkthrough"],
    ["First-session tips", "https://bigwalkwalkthrough.com/beginner-guide"],
    ["Big Walk crossplay", "https://bigwalkwalkthrough.com/multiplayer"],
    ["Big Walk trophy guide", "https://bigwalkwalkthrough.com/achievements"],
    ["All 7 purple challenges", "https://bigwalkwalkthrough.com/puzzles/purple-challenges"],
    ["Find Big Walk players", "https://bigwalkwalkthrough.com/multiplayer/how-to-find-players"],
  ];
  for (const [label, href] of expectedBigWalkLinks) {
    const link = relatedGame.getByRole("link", { name: label, exact: true });
    assert(await link.count() === 1, `missing Big Walk link: ${label}`);
    assert(await link.getAttribute("href") === href, `wrong destination for ${label}`);
    assert(await link.getAttribute("target") === "_blank", `${label} does not identify its external navigation behavior`);
    assert(((await link.getAttribute("rel")) || "").split(/\s+/).includes("noopener"), `${label} is missing rel=noopener`);
  }
  const greedyGrowersLinks = relatedGame.locator('a[href^="https://greedygrowerhub.wiki"]');
  assert(await greedyGrowersLinks.count() === 5, "Greedy Growers recommendation does not expose all five useful destinations");
  const expectedGreedyGrowersLinks = [
    ["Greedy Growers Calculator", "https://greedygrowerhub.wiki/"],
    ["Greedy Growers Seed List", "https://greedygrowerhub.wiki/seeds/list/"],
    ["Greedy Growers Mutations Guide", "https://greedygrowerhub.wiki/mechanics/mutations/"],
    ["How to play Greedy Growers", "https://greedygrowerhub.wiki/beginner-guide/"],
    ["Current codes status", "https://greedygrowerhub.wiki/codes/"],
  ];
  for (const [label, href] of expectedGreedyGrowersLinks) {
    const link = relatedGame.getByRole("link", { name: label, exact: true });
    assert(await link.count() === 1, `missing Greedy Growers link: ${label}`);
    assert(await link.getAttribute("href") === href, `wrong destination for ${label}`);
    assert(await link.getAttribute("target") === "_blank", `${label} does not identify its external navigation behavior`);
    const rel = ((await link.getAttribute("rel")) || "").split(/\s+/);
    assert(rel.includes("noopener"), `${label} is missing rel=noopener`);
    assert(!rel.includes("nofollow"), `${label} must remain a normal follow link`);
  }
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

  await desktop.goto(BASE + "/privacy/", { waitUntil: "networkidle" });
  assert((await desktop.locator("main").innerText()).includes("Microsoft Clarity usage analytics"), "privacy disclosure does not mention Microsoft Clarity");

  await desktop.goto(BASE + "/updates/", { waitUntil: "networkidle" });
  await desktop.waitForTimeout(1100);
  const values = (await desktop.locator(".countdown-grid strong").allTextContents()).map(Number);
  assert(values.every((value) => value >= 0), `negative countdown: ${values.join(",")}`);
  assert((await desktop.locator(".local-time").innerText()).includes("Your local time"), "local time missing");
  const updatesText = await desktop.locator("main").innerText();
  assert(updatesText.includes("Latest official check"), "Updates page is missing the August 11 official checkpoint");
  assert(/reported event archive/i.test(updatesText), "Updates page does not identify the expired event window");
  assert(updatesText.includes("Implementation status: current gameplay still required"), "Updates page does not preserve the implementation evidence gate");
  assert(updatesText.includes("reported event window ended on August 9, 2026"), "Updates page does not present the reported event as ended");
  assert(!updatesText.includes("has not reached its reported start time"), "Updates page contains stale pre-launch wording");
  assert(updatesText.includes("Last checked: Aug 11, 2026"), "Updates page shows the wrong official review date");
  await desktop.screenshot({ path: "artifacts/updates-desktop.png", fullPage: true });

  await desktop.goto(BASE + "/codes/", { waitUntil: "networkidle" });
  const codesText = await desktop.locator("main").innerText();
  assert(codesText.includes("August 11, 2026"), "Codes page does not show the fresh public-source check");
  assert(codesText.includes("Reported codes awaiting an in-game result"), "Codes page does not expose the reported-candidate queue");
  assert(codesText.includes("ILOVEASMR"), "Codes page does not show reported candidates for transparent testing");
  await desktop.screenshot({ path: "artifacts/quick-mvp-codes.png", fullPage: true });

  await desktop.goto(BASE + "/beginner-guide/", { waitUntil: "networkidle" });
  const beginnerText = await desktop.locator("main").innerText();
  assert(beginnerText.includes("Official Roblox listing"), "Beginner guide does not identify its safe public-source baseline");
  assert(beginnerText.includes("Like the game and join the group"), "Beginner guide is missing the official worker-reward condition");
  assert(beginnerText.includes("Gameplay capture still required"), "Beginner guide does not expose the remaining screenshot gate");
  assert(beginnerText.includes("Quick guide index"), "Beginner guide does not expose the task-based guide index");
  const beginnerVideo = desktop.locator('[data-video-id="7JfyM_GSipY"]');
  assert(await beginnerVideo.count() === 1, "Beginner guide is missing its reviewed gameplay reference");
  assert(await beginnerVideo.locator("iframe").count() === 0, "Beginner video iframe loads before user intent");
  await beginnerVideo.getByRole("button", { name: /play third-party video/i }).click();
  const beginnerFrame = beginnerVideo.locator("iframe");
  await beginnerFrame.waitFor({ state: "visible" });
  assert((await beginnerFrame.getAttribute("src")).includes("youtube-nocookie.com/embed/7JfyM_GSipY"), "Beginner guide loads the wrong video or host");
  await desktop.screenshot({ path: "artifacts/quick-mvp-beginner.png", fullPage: true });

  await desktop.goto(BASE + "/rebirths-and-workers/", { waitUntil: "networkidle" });
  const progressionText = await desktop.locator("main").innerText();
  assert(progressionText.includes("Workers and the two-worker reward"), "Workers page is missing the official reward baseline");
  assert(progressionText.includes("First rebirth safety checklist"), "Rebirth page is missing the actionable pre-confirmation checklist");
  const rebirthVideo = desktop.locator('[data-video-id="FbqF-ydPuUw"]');
  assert(await rebirthVideo.count() === 1, "Rebirth guide is missing its reviewed gameplay reference");
  assert(await rebirthVideo.locator("iframe").count() === 0, "Rebirth video iframe loads before user intent");
  await rebirthVideo.getByRole("button", { name: /play third-party video/i }).click();
  const rebirthFrame = rebirthVideo.locator("iframe");
  await rebirthFrame.waitFor({ state: "visible" });
  assert((await rebirthFrame.getAttribute("src")).includes("youtube-nocookie.com/embed/FbqF-ydPuUw"), "Rebirth guide loads the wrong video or host");
  await desktop.screenshot({ path: "artifacts/quick-mvp-progression.png", fullPage: true });

  await desktop.goto(BASE + "/roblox-index/", { waitUntil: "networkidle" });
  const collectionText = await desktop.locator("main").innerText();
  assert(collectionText.includes("First community-reported snapshot"), "Roblox Index is missing its scoped evidence status");
  assert(collectionText.includes("Can you skip crate opening animations?"), "Roblox Index is missing the crate-skip evidence answer");
  const crateVideo = desktop.locator('[data-video-id="xPiGrQ2t_V8"]');
  assert(await crateVideo.count() === 1, "Roblox Index is missing its reviewed gameplay reference");
  assert(await crateVideo.locator("iframe").count() === 0, "Roblox Index video iframe loads before user intent");
  await crateVideo.getByRole("button", { name: /play third-party video/i }).click();
  const crateFrame = crateVideo.locator("iframe");
  await crateFrame.waitFor({ state: "visible" });
  assert((await crateFrame.getAttribute("src")).includes("youtube-nocookie.com/embed/xPiGrQ2t_V8"), "Roblox Index loads the wrong video or host");
  await desktop.screenshot({ path: "artifacts/quick-mvp-collection.png", fullPage: true });

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
  await mobile.route("https://www.clarity.ms/**", (route) => route.fulfill({ status: 200, contentType: "application/javascript", body: "" }));
  const mobileErrors = [];
  mobile.on("console", (msg) => { if (msg.type() === "error") mobileErrors.push(msg.text()); });
  mobile.on("pageerror", (error) => mobileErrors.push(String(error)));
  for (const route of ["/", "/roblox-index/", "/gamepasses/", "/updates/"]) {
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
