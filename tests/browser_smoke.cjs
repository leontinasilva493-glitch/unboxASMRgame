const fs = require("node:fs");
const { chromium } = require("playwright");

const BASE = process.env.TEST_BASE || "http://127.0.0.1:3107";
const ROUTES = [
  "/", "/beginner-guide/", "/crates-and-toys/", "/rebirths-and-workers/",
  "/gamepasses/", "/updates/", "/codes/", "/about/", "/sources/",
  "/privacy/", "/terms/", "/robots.txt", "/sitemap.xml",
];
const NOINDEX = ["/beginner-guide/", "/crates-and-toys/", "/rebirths-and-workers/"];
const assert = (condition, message) => { if (!condition) throw new Error(message); };

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
  assert((await desktop.locator("h1").innerText()).includes("Roblox"), "home H1 does not disambiguate Roblox");
  assert(await desktop.locator('a[href*="roblox.com/games/112233638491976"]').count() >= 2, "official Roblox CTAs missing");
  await desktop.screenshot({ path: "artifacts/home-desktop.png", fullPage: true });

  await desktop.goto(BASE + "/updates/", { waitUntil: "networkidle" });
  await desktop.waitForTimeout(1100);
  const values = (await desktop.locator(".countdown-grid strong").allTextContents()).map(Number);
  assert(values.every((value) => value >= 0), `negative countdown: ${values.join(",")}`);
  assert((await desktop.locator(".local-time").innerText()).includes("Your local time"), "local time missing");
  await desktop.screenshot({ path: "artifacts/updates-desktop.png", fullPage: true });

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
