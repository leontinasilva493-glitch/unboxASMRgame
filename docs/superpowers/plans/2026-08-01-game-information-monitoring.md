# Game Information Monitoring Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an evidence-gated GitHub Actions monitoring pipeline that detects public Unbox ASMR changes, creates deduplicated review issues, and can generate a draft content PR only from an approved structured payload.

**Architecture:** Pure Node.js ESM modules collect registered public sources, normalize stable business fields, compare them with a state directory, and emit JSON/Markdown artifacts without external writes by default. Separate GitHub-only entrypoints publish deduplicated issues and promote an explicitly approved JSON payload; workflows manage the `monitor-state` branch, permissions, schedules, artifacts, and draft PR creation.

**Tech Stack:** Node.js 20+ standard library, Node test runner, JSON configuration, GitHub Actions, GitHub REST API, existing Next.js 16 validation/build pipeline.

## Global Constraints

- Preserve existing `data/*.json`, evidence statuses, `DATA_NEEDED.md`, `noindex`, sitemap, and build-time gates.
- Use no Roblox Cookie, Open Cloud key, Discord token, AI model, database, or new npm dependency.
- Treat A-level public data only as proof of fields directly exposed by that source; gameplay effects still require current-version in-game evidence.
- B-level sources can produce preview tasks only; C-level sources can produce investigation tasks only; D-level sources are not registered.
- Local commands are dry-run by default and never create GitHub issues, branches, PRs, deployments, or content edits without an explicit apply flag.
- Monitoring failures never replace the last successful normalized snapshot.
- Generated content changes are restricted to approved `data/*.json` JSON-pointer operations and always open as a draft PR.
- Do not stage or commit the user's existing `README.md` or `CHANGELOG.md` changes.

---

### Task 1: Source registry and configuration contracts

**Files:**
- Create: `monitoring/sources.json`
- Create: `scripts/monitor/config.mjs`
- Create: `tests/monitor-config.test.mjs`
- Modify: `package.json`

**Interfaces:**
- Produces: `loadSourceRegistry(filePath): Promise<MonitorSource[]>`
- Produces: `validateSourceRegistry(input): string[]`
- Produces: source records with `id`, `tier`, `kind`, `url`, `cadence`, `parser`, `allowedClaims`, `affectedRoutes`, `enabled`, `contentFields`, and `trendFields`.

- [ ] **Step 1: Write failing source-registry tests**

```js
test("registry accepts pinned Roblox public sources", async () => {
  const sources = await loadSourceRegistry("monitoring/sources.json");
  assert.deepEqual(sources.map((source) => source.id), [
    "roblox-place-universe",
    "roblox-game-details",
    "roblox-group-details",
  ]);
});

test("registry rejects D-tier and gameplay claims from non-manual sources", () => {
  const errors = validateSourceRegistry({ sources: [{ tier: "D" }] });
  assert.ok(errors.length > 0);
});
```

- [ ] **Step 2: Run `node --test tests/monitor-config.test.mjs` and confirm missing-module failure**
- [ ] **Step 3: Implement strict registry validation and the three pinned Roblox endpoints**
- [ ] **Step 4: Add `monitor:check`, `monitor:dry-run`, and `monitor:promote` scripts to `package.json`**
- [ ] **Step 5: Run the targeted test and `npm run lint`**
- [ ] **Step 6: Commit only Task 1 files with `feat(monitoring): add source registry contracts`**

### Task 2: Collectors, retry behavior, and stable parsers

**Files:**
- Create: `scripts/monitor/collect.mjs`
- Create: `scripts/monitor/normalize.mjs`
- Create: `tests/monitor-collect.test.mjs`
- Create: `tests/fixtures/monitor/place-universe.json`
- Create: `tests/fixtures/monitor/game-details.json`
- Create: `tests/fixtures/monitor/group-details.json`

**Interfaces:**
- Consumes: validated `MonitorSource` records from Task 1.
- Produces: `collectSource(source, options): Promise<CollectionResult>` where success includes `normalized`, `raw`, `checkedAt`, `parserVersion`, and failure includes a stable error category without a replacement snapshot.
- Produces: `normalizeText(value): string`, `parseSource(source, payload): object`, and `stableJson(value): string`.

- [ ] **Step 1: Write failing fixture parser and retry tests**

```js
test("game parser keeps content fields separate from trend fields", () => {
  const parsed = parseSource(gameSource, fixture);
  assert.equal(parsed.content.name, "[🍯] Unbox ASMR!");
  assert.equal(parsed.trends.playing, 38182);
  assert.equal(parsed.identity.creatorId, 1110056661);
});

test("collector retries transient failures without converting them to empty data", async () => {
  const result = await collectSource(source, { fetchImpl, delay: async () => {} });
  assert.equal(attempts, 3);
  assert.equal(result.ok, true);
});
```

- [ ] **Step 2: Run the targeted test and confirm missing parser/collector failure**
- [ ] **Step 3: Implement timeout, three-attempt exponential retry, HTTP classification, and dependency-injected delay**
- [ ] **Step 4: Implement the Place/Universe, game-details, and group-details parsers with pinned identity assertions**
- [ ] **Step 5: Run targeted tests, lint, and `git diff --check`**
- [ ] **Step 6: Commit Task 2 files with `feat(monitoring): collect and normalize Roblox sources`**

### Task 3: Snapshot state, business diffs, and health rules

**Files:**
- Create: `scripts/monitor/state.mjs`
- Create: `scripts/monitor/diff.mjs`
- Create: `tests/monitor-diff.test.mjs`

**Interfaces:**
- Consumes: `CollectionResult` from Task 2 and per-source JSON snapshots.
- Produces: `readSnapshot(stateDir, sourceId)`, `writeSnapshot(stateDir, sourceId, snapshot)`, `compareSnapshot(source, previous, current)`, and `recordFailure(previous, failure)`.
- Produces: changes with `topic`, `kind: "content" | "investigation" | "health" | "trend"`, `before`, `after`, `issueKey`, and `affectedRoutes`.

- [ ] **Step 1: Write failing tests for initial baseline, content diff, metric noise, counter regression, identity mismatch, and repeated failure**

```js
test("normal playing changes remain trend-only", () => {
  const changes = compareSnapshot(source, previous, current);
  assert.equal(changes.some((change) => change.kind === "content"), false);
});

test("three successful zero-playing checks create health alert", () => {
  const changes = compareSnapshot(source, previousWithTwoZeros, currentWithZero);
  assert.ok(changes.some((change) => change.topic === "playing-zero"));
});
```

- [ ] **Step 2: Run the targeted tests and confirm failures**
- [ ] **Step 3: Implement atomic snapshot writes and failure records that retain `lastSuccess`**
- [ ] **Step 4: Implement field-level content diffs, trend-only increases, >1% cumulative-counter regression, three-zero-playing, identity mismatch, and three-failure health alerts**
- [ ] **Step 5: Run targeted tests and lint**
- [ ] **Step 6: Commit Task 3 files with `feat(monitoring): add evidence-aware change detection`**

### Task 4: Dry-run orchestration and review artifacts

**Files:**
- Create: `scripts/monitor/report.mjs`
- Create: `scripts/monitor/run.mjs`
- Create: `tests/monitor-run.test.mjs`
- Modify: `.gitignore`

**Interfaces:**
- Consumes: registry, collectors, state, event windows from `data/events.json`.
- Produces: `runMonitoring(options): Promise<RunSummary>` and CLI flags `--state-dir`, `--output-dir`, `--mode manual|scheduled|hourly`, `--source`, and `--now`.
- Writes: `run-summary.json`, raw source artifacts, and one Markdown review document per actionable change.

- [ ] **Step 1: Write failing integration tests using fixture-backed fetch**

```js
test("first run establishes baseline without an issue", async () => {
  const summary = await runMonitoring(testOptions);
  assert.equal(summary.actionable.length, 0);
  assert.equal(summary.baselinesCreated, 3);
});

test("second run emits one deduplicated description-change review", async () => {
  const summary = await runMonitoring(changedOptions);
  assert.equal(summary.actionable[0].issueKey, "roblox-game-details:description");
});
```

- [ ] **Step 2: Run the targeted test and confirm orchestration failure**
- [ ] **Step 3: Implement source selection, update-window logic, sequential safe collection, state updates, and partial-success summaries**
- [ ] **Step 4: Implement Markdown issue bodies containing source tier, timestamps, before/after values, affected routes, machine marker, and in-game checklist**
- [ ] **Step 5: Ignore local `.monitor-state/` while keeping generated `artifacts/` ignored**
- [ ] **Step 6: Run targeted tests, `npm run monitor:dry-run`, and inspect generated artifacts**
- [ ] **Step 7: Commit Task 4 files with `feat(monitoring): add dry-run monitoring orchestration`**

### Task 5: Deduplicated GitHub issues and scheduled workflow

**Files:**
- Create: `scripts/monitor/github-issues.mjs`
- Create: `tests/monitor-github.test.mjs`
- Create: `.github/workflows/game-information-monitor.yml`

**Interfaces:**
- Consumes: `run-summary.json`, `GITHUB_TOKEN`, and `GITHUB_REPOSITORY` only when `--apply` is present.
- Produces: `publishIssues(summary, client)` that searches for `<!-- monitor-key:<key> -->`, creates one issue when absent, and comments/updates labels when present.
- Workflow manages `.monitor-state/state/*.json` on `monitor-state`, uploads 30-day artifacts, and never writes `main`.

- [ ] **Step 1: Write failing fake-client tests for create, deduplicate, update, and dry-run behavior**
- [ ] **Step 2: Run the targeted test and confirm missing publisher failure**
- [ ] **Step 3: Implement REST client, issue marker search, `monitor-change` / source-tier / `monitor-health` / `parser-broken` label creation, duplicate-safe create/update, and explicit `--apply` guard**
- [ ] **Step 4: Add workflow schedules `15 1,13 * * *` and `17 * * * *`, `workflow_dispatch`, concurrency, least permissions, safe state-worktree setup, artifact upload, issue publish, and state push after successful issue publication**
- [ ] **Step 5: Add workflow tests that parse the YAML as text and assert permissions, schedules, dry-run boundary, branch name, and no deployment command**
- [ ] **Step 6: Run monitoring/GitHub tests and lint**
- [ ] **Step 7: Commit Task 5 files with `ci(monitoring): add scheduled review issue workflow`**

### Task 6: Approved payload gate and draft content PR

**Files:**
- Create: `monitoring/approved-payload.schema.json`
- Create: `scripts/monitor/promote.mjs`
- Create: `tests/monitor-promote.test.mjs`
- Create: `.github/workflows/promote-approved-monitoring.yml`

**Interfaces:**
- Consumes: an approved payload containing `issueNumber`, `sourceId`, `verifiedAt`, `gameVersion`, `evidence`, and JSON-pointer `operations` limited to `data/*.json`.
- Produces: validated local edits only with `--apply`; default mode prints the planned patch. GitHub workflow requires the issue to carry `evidence-approved`, runs repository checks, commits a candidate branch, and opens a draft PR.

- [ ] **Step 1: Write failing tests for schema validation, dry-run, allowlisted files, add/replace operations, rejected remove operations, and rejected unverified verdicts**

```js
test("promoter rejects writes outside data JSON", async () => {
  await assert.rejects(
    () => promote({ operations: [{ file: "app/page.tsx", op: "replace" }] }),
    /data\/.*\.json/,
  );
});

test("promoter does not write without apply", async () => {
  await promote({ payload, root, apply: false });
  assert.equal(await readFile(target, "utf8"), original);
});
```

- [ ] **Step 2: Run targeted tests and confirm missing promoter failure**
- [ ] **Step 3: Implement schema-equivalent runtime validation, RFC6901 pointer decoding, add/replace only, atomic JSON writes, evidence metadata requirements, and dry-run default**
- [ ] **Step 4: Add manual workflow inputs for issue number and approved payload, verify issue label through GitHub REST, apply the payload, run checks, create `codex/monitor-issue-<number>`, push, and open a draft PR**
- [ ] **Step 5: Add workflow-text assertions for label gate, draft PR, allowed branch prefix, and absence of merge/deploy commands**
- [ ] **Step 6: Run targeted tests, lint, and a temporary-directory promotion dry-run**
- [ ] **Step 7: Commit Task 6 files with `feat(monitoring): gate approved content promotion`**

### Task 7: Documentation and full local verification

**Files:**
- Create: `monitoring/README.md`
- Modify: `docs/superpowers/plans/2026-08-01-game-information-monitoring.md`
- Verify only: all monitoring, site, and build files.

**Interfaces:**
- Consumes: the complete monitoring implementation.
- Produces: operator instructions for local dry-run, fixture tests, GitHub permissions, source enrollment, evidence approval, state recovery, and failure diagnosis.

- [ ] **Step 1: Document local commands, source tiers, exact public IDs, GitHub labels/permissions, state branch bootstrap, artifact paths, approved payload format, privacy cropping, and recovery procedures**
- [ ] **Step 2: Run `npm test`**
- [ ] **Step 3: Run `npm run lint`**
- [ ] **Step 4: Run `npm run typecheck`**
- [ ] **Step 5: Run `npm run monitor:dry-run` against a temporary local state directory and inspect the summary**
- [ ] **Step 6: Run `npm run build` and confirm the Next.js production build succeeds**
- [ ] **Step 7: Run `git diff --check`, inspect `git status --short`, and confirm `README.md` and `CHANGELOG.md` remain outside monitoring commits**
- [ ] **Step 8: Commit Task 7 files with `docs(monitoring): add operator runbook`**

## Completion Evidence

The final handoff must report:

- All commands executed and exact pass/fail results.
- Local monitoring dry-run output directory and summary counts.
- Local production build result; it is not a deployment claim.
- Commits created for monitoring work.
- Remaining user-owned dirty files.
- Any external GitHub behavior that was implemented but not triggered locally.

## Execution Record — 2026-08-01

All seven tasks were completed inline on `codex/game-information-monitoring` with test-first red/green cycles for each behavior-bearing module.

- `npm test`: 35 tests passed, 0 failed.
- `npm run lint`: passed.
- `npm run typecheck`: passed.
- Fresh live dry-run: 3 official sources checked, 3 baselines created, 0 actionable changes, 0 failures.
- GitHub issue publisher: local dry-run returned no external actions.
- `npm run build`: data validation passed and Next.js generated 17 static routes.
- No GitHub Issue, external branch, pull request, merge, deployment, or `noindex` change was triggered locally.
