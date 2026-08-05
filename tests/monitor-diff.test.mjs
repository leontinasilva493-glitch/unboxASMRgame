import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import {
  createSuccessSnapshot,
  readSnapshot,
  recordFailure,
  writeSnapshot,
} from "../scripts/monitor/state.mjs";
import { compareSnapshot } from "../scripts/monitor/diff.mjs";

const source = {
  id: "roblox-game-details",
  tier: "A",
  contentFields: ["content.name", "content.description"],
  trendFields: ["trends.playing", "trends.visits", "trends.favoritedCount"],
  affectedRoutes: ["/", "/updates/"],
  expectedIdentity: { universeId: 10, placeId: 20, creatorId: 30, creatorType: "Group" },
};

function result({ checkedAt = "2026-08-01T00:00:00.000Z", name = "Game", description = "Old", playing = 100, visits = 1000, favorites = 500, identity = source.expectedIdentity } = {}) {
  return {
    ok: true,
    sourceId: source.id,
    checkedAt,
    parserVersion: "1",
    normalized: {
      identity,
      content: { name, description },
      trends: { playing, visits, favoritedCount: favorites },
    },
  };
}

test("first valid run establishes baseline without content changes", () => {
  const current = createSuccessSnapshot(null, result());
  assert.deepEqual(compareSnapshot(source, null, current), []);
});

test("content changes are field-level and deduplicated", () => {
  const previous = createSuccessSnapshot(null, result());
  const current = createSuccessSnapshot(previous, result({ description: "New" }));
  const changes = compareSnapshot(source, previous, current);

  assert.equal(changes.length, 1);
  assert.equal(changes[0].kind, "content");
  assert.equal(changes[0].issueKey, "roblox-game-details:description");
  assert.equal(changes[0].before, "Old");
  assert.equal(changes[0].after, "New");
});

test("normal playing changes remain trend-only", () => {
  const previous = createSuccessSnapshot(null, result());
  const current = createSuccessSnapshot(previous, result({ playing: 125 }));
  const changes = compareSnapshot(source, previous, current);

  assert.equal(changes.some((change) => change.kind === "content" || change.kind === "health"), false);
  assert.ok(changes.some((change) => change.kind === "trend"));
});

test("cumulative counters decreasing over one percent create health alerts", () => {
  const previous = createSuccessSnapshot(null, result());
  const current = createSuccessSnapshot(previous, result({ visits: 980, favorites: 490 }));
  const changes = compareSnapshot(source, previous, current);

  assert.ok(changes.some((change) => change.issueKey === "roblox-game-details:visits-regression"));
  assert.ok(changes.some((change) => change.issueKey === "roblox-game-details:favoritedCount-regression"));
});

test("three successful zero-playing checks create one health alert", () => {
  const first = createSuccessSnapshot(null, result({ playing: 0 }));
  const second = createSuccessSnapshot(first, result({ checkedAt: "2026-08-01T01:00:00Z", playing: 0 }));
  const third = createSuccessSnapshot(second, result({ checkedAt: "2026-08-01T02:00:00Z", playing: 0 }));
  const changes = compareSnapshot(source, second, third);

  assert.ok(changes.some((change) => change.issueKey === "roblox-game-details:playing-zero"));
});

test("identity mismatch creates health alert even on first run", () => {
  const current = createSuccessSnapshot(null, result({ identity: { ...source.expectedIdentity, creatorId: 99 } }));
  const changes = compareSnapshot(source, null, current);

  assert.ok(changes.some((change) => change.issueKey === "roblox-game-details:identity-creatorId"));
});

test("third consecutive collection failure alerts and preserves last success", () => {
  const success = createSuccessSnapshot(null, result());
  const failedOnce = recordFailure(success, { ok: false, sourceId: source.id, checkedAt: "2026-08-01T01:00:00Z", error: { category: "timeout" } });
  const failedTwice = recordFailure(failedOnce, { ok: false, sourceId: source.id, checkedAt: "2026-08-01T02:00:00Z", error: { category: "timeout" } });
  const failedThrice = recordFailure(failedTwice, { ok: false, sourceId: source.id, checkedAt: "2026-08-01T03:00:00Z", error: { category: "timeout" } });
  const changes = compareSnapshot(source, failedTwice, failedThrice);

  assert.deepEqual(failedThrice.lastSuccess, success.lastSuccess);
  assert.ok(changes.some((change) => change.issueKey === "roblox-game-details:collection-failure"));
});

test("snapshots round-trip through atomic JSON storage", async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), "unbox-monitor-state-"));
  try {
    const snapshot = createSuccessSnapshot(null, result());
    await writeSnapshot(directory, source.id, snapshot);
    assert.deepEqual(await readSnapshot(directory, source.id), snapshot);
    assert.match(await readFile(path.join(directory, `${source.id}.json`), "utf8"), /lastSuccess/);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
