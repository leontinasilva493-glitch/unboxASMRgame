import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { publishIssues } from "../scripts/monitor/github-issues.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function summary() {
  return {
    reviews: [{
      issueKey: "roblox-game-details:description",
      title: "[Monitor][A] Description changed",
      body: "<!-- monitor-key:roblox-game-details:description -->\nChanged",
      labels: ["monitor-change", "source-A", "needs-in-game-verification"],
    }],
  };
}

function fakeClient(existing = null) {
  const calls = [];
  return {
    calls,
    async ensureLabel(label) { calls.push(["ensureLabel", label]); },
    async findOpenIssue(marker) { calls.push(["findOpenIssue", marker]); return existing; },
    async createIssue(input) { calls.push(["createIssue", input]); return { number: 7 }; },
    async addComment(number, body) { calls.push(["addComment", number, body]); },
    async setLabels(number, labels) { calls.push(["setLabels", number, labels]); },
  };
}

test("publisher is dry-run by default", async () => {
  const client = fakeClient();
  const result = await publishIssues(summary(), client, { apply: false });

  assert.equal(client.calls.length, 0);
  assert.deepEqual(result, [{ action: "would_create", issueKey: "roblox-game-details:description" }]);
});

test("publisher creates one labeled issue when marker is absent", async () => {
  const client = fakeClient();
  const result = await publishIssues(summary(), client, { apply: true });

  assert.equal(client.calls.filter(([name]) => name === "createIssue").length, 1);
  assert.equal(client.calls.filter(([name]) => name === "ensureLabel").length, 3);
  assert.deepEqual(result, [{ action: "created", issueKey: "roblox-game-details:description", number: 7 }]);
});

test("publisher comments on and relabels an existing issue", async () => {
  const client = fakeClient({ number: 12 });
  const result = await publishIssues(summary(), client, { apply: true });

  assert.equal(client.calls.some(([name, number]) => name === "addComment" && number === 12), true);
  assert.equal(client.calls.some(([name, number]) => name === "setLabels" && number === 12), true);
  assert.equal(client.calls.some(([name]) => name === "createIssue"), false);
  assert.deepEqual(result, [{ action: "updated", issueKey: "roblox-game-details:description", number: 12 }]);
});

test("scheduled workflow has guarded permissions, schedules, state, and no deployment", async () => {
  const workflow = await readFile(path.join(root, ".github", "workflows", "game-information-monitor.yml"), "utf8");

  assert.match(workflow, /contents: write/);
  assert.match(workflow, /issues: write/);
  assert.match(workflow, /15 1,13 \* \* \*/);
  assert.match(workflow, /17 \* \* \* \*/);
  assert.match(workflow, /monitor-state/);
  assert.match(workflow, /github-issues\.mjs.*--apply/);
  assert.doesNotMatch(workflow, /wrangler|\bdeploy\b|\bmerge\b/i);
});
