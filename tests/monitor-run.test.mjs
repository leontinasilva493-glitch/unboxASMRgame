import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadSourceRegistry } from "../scripts/monitor/config.mjs";
import { parseSource } from "../scripts/monitor/normalize.mjs";
import { isUpdateWindow, runMonitoring } from "../scripts/monitor/run.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function loadFixture(name) {
  return JSON.parse(await readFile(path.join(root, "tests", "fixtures", "monitor", name), "utf8"));
}

async function fixtureCollector(sources, description = null) {
  const payloads = {
    "roblox-place-universe": await loadFixture("place-universe.json"),
    "roblox-game-details": await loadFixture("game-details.json"),
    "roblox-group-details": await loadFixture("group-details.json"),
  };
  if (description) payloads["roblox-game-details"].data[0].description = description;
  return async (source) => ({
    ok: true,
    sourceId: source.id,
    checkedAt: description ? "2026-08-01T01:00:00.000Z" : "2026-08-01T00:00:00.000Z",
    parserVersion: "1",
    raw: payloads[source.id],
    normalized: parseSource(sources.find((item) => item.id === source.id), payloads[source.id]),
  });
}

test("first run establishes baselines without review issues", async () => {
  const temporary = await mkdtemp(path.join(os.tmpdir(), "unbox-monitor-run-"));
  try {
    const sources = await loadSourceRegistry(path.join(root, "monitoring", "sources.json"));
    const summary = await runMonitoring({
      root,
      sources,
      stateDir: path.join(temporary, "state"),
      outputDir: path.join(temporary, "output-1"),
      mode: "manual",
      collectSourceImpl: await fixtureCollector(sources),
      now: new Date("2026-08-01T00:00:00Z"),
    });

    assert.equal(summary.baselinesCreated, 3);
    assert.equal(summary.actionable.length, 0);
    assert.equal(summary.status, "success");
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
});

test("second run writes one deduplicated description review", async () => {
  const temporary = await mkdtemp(path.join(os.tmpdir(), "unbox-monitor-run-"));
  try {
    const sources = await loadSourceRegistry(path.join(root, "monitoring", "sources.json"));
    const stateDir = path.join(temporary, "state");
    await runMonitoring({ root, sources, stateDir, outputDir: path.join(temporary, "output-1"), mode: "manual", collectSourceImpl: await fixtureCollector(sources), now: new Date("2026-08-01T00:00:00Z") });
    const summary = await runMonitoring({ root, sources, stateDir, outputDir: path.join(temporary, "output-2"), mode: "manual", collectSourceImpl: await fixtureCollector(sources, "New official description"), now: new Date("2026-08-01T01:00:00Z") });

    assert.deepEqual(summary.actionable.map((item) => item.issueKey), ["roblox-game-details:description"]);
    const review = await readFile(summary.reviews[0].filePath, "utf8");
    assert.match(review, /<!-- monitor-key:roblox-game-details:description -->/);
    assert.match(review, /needs_in_game_verification/);
    assert.match(review, /New official description/);
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
});

test("hourly mode skips collection outside an update window", async () => {
  let called = false;
  const summary = await runMonitoring({
    root,
    sources: [{ id: "source", enabled: true }],
    stateDir: path.join(os.tmpdir(), "unused-monitor-state"),
    outputDir: path.join(os.tmpdir(), "unused-monitor-output"),
    mode: "hourly",
    events: [{ startsAt: "2026-08-10T12:00:00Z" }],
    now: new Date("2026-08-01T00:00:00Z"),
    collectSourceImpl: async () => { called = true; },
  });

  assert.equal(called, false);
  assert.equal(summary.status, "skipped");
});

test("update window starts twelve hours before and ends twenty-four hours after start", () => {
  const events = [{ startsAt: "2026-08-02T12:00:00Z" }];
  assert.equal(isUpdateWindow(events, new Date("2026-08-02T00:00:00Z")), true);
  assert.equal(isUpdateWindow(events, new Date("2026-08-03T12:00:00Z")), true);
  assert.equal(isUpdateWindow(events, new Date("2026-08-03T12:00:01Z")), false);
});
