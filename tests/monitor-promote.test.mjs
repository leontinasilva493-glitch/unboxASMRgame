import test from "node:test";
import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { hasApprovedLabel, promote, validateApprovedPayload } from "../scripts/monitor/promote.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function payload(overrides = {}) {
  return {
    issueNumber: 42,
    sourceId: "roblox-game-details",
    verifiedAt: "2026-08-01T00:00:00Z",
    gameVersion: "Update 3",
    evidence: [{
      status: "in_game_verified",
      verifiedAt: "2026-08-01T00:00:00Z",
      screenshot: "/evidence/update-3.webp",
    }],
    operations: [{ file: "data/game.json", op: "replace", path: "/checkedAt", value: "2026-08-01" }],
    ...overrides,
  };
}

async function makeRoot() {
  const directory = await mkdtemp(path.join(os.tmpdir(), "unbox-promote-"));
  await mkdir(path.join(directory, "data"));
  await writeFile(path.join(directory, "data", "game.json"), '{"checkedAt":"2026-07-30"}\n');
  for (const name of ["events", "codes", "crates", "toys"]) await writeFile(path.join(directory, "data", `${name}.json`), "[]\n");
  await writeFile(path.join(directory, "data", "gamepasses.json"), '[{"slug":"vip","evidence":[{"status":"unverified","verifiedAt":"2026-07-30"}]}]\n');
  return directory;
}

test("payload validation rejects files outside data JSON and remove operations", () => {
  assert.ok(validateApprovedPayload(payload({ operations: [{ file: "app/page.tsx", op: "replace", path: "/x", value: 1 }] })).some((error) => error.includes("data/*.json")));
  assert.ok(validateApprovedPayload(payload({ operations: [{ file: "data/game.json", op: "remove", path: "/checkedAt" }] })).some((error) => error.includes("add or replace")));
});

test("promoter is dry-run unless apply is explicit", async () => {
  const directory = await makeRoot();
  try {
    const before = await readFile(path.join(directory, "data", "game.json"), "utf8");
    const result = await promote({ payload: payload(), root: directory, apply: false });
    const after = await readFile(path.join(directory, "data", "game.json"), "utf8");

    assert.equal(after, before);
    assert.deepEqual(result.files, ["data/game.json"]);
    assert.equal(result.applied, false);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("promoter applies approved add and replace operations atomically", async () => {
  const directory = await makeRoot();
  try {
    const approved = payload({ operations: [
      { file: "data/game.json", op: "replace", path: "/checkedAt", value: "2026-08-01" },
      { file: "data/game.json", op: "add", path: "/gameVersion", value: "Update 3" },
    ] });
    const result = await promote({ payload: approved, root: directory, apply: true });
    const game = JSON.parse(await readFile(path.join(directory, "data", "game.json"), "utf8"));

    assert.equal(result.applied, true);
    assert.equal(game.checkedAt, "2026-08-01");
    assert.equal(game.gameVersion, "Update 3");
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("promoter rejects an unverified Gamepass verdict through existing data gates", async () => {
  const directory = await makeRoot();
  try {
    const unsafe = payload({ operations: [{ file: "data/gamepasses.json", op: "add", path: "/0/verdict", value: "Best" }] });
    await assert.rejects(() => promote({ payload: unsafe, root: directory, apply: false }), /unverified gamepass/);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("approval label check is exact", () => {
  assert.equal(hasApprovedLabel({ labels: [{ name: "evidence-approved" }] }), true);
  assert.equal(hasApprovedLabel({ labels: [{ name: "needs-evidence-approved" }] }), false);
});

test("promotion workflow verifies approval, creates draft PR, and never merges or deploys", async () => {
  const workflow = await readFile(path.join(root, ".github", "workflows", "promote-approved-monitoring.yml"), "utf8");

  assert.match(workflow, /evidence-approved/);
  assert.match(workflow, /codex\/monitor-issue-/);
  assert.match(workflow, /gh pr create[^\n]*--draft/);
  assert.match(workflow, /npm\.cmd run build|npm run build/);
  assert.doesNotMatch(workflow, /gh pr merge|wrangler|\bdeploy\b/i);
});
