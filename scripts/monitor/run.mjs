import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { collectSource } from "./collect.mjs";
import { runContentAudit } from "./content-gap.mjs";
import { loadSourceRegistry } from "./config.mjs";
import { compareSnapshot } from "./diff.mjs";
import { writeReviewFiles } from "./report.mjs";
import { createSuccessSnapshot, readSnapshot, recordFailure, writeSnapshot } from "./state.mjs";

const scriptPath = fileURLToPath(import.meta.url);
const defaultRoot = path.resolve(path.dirname(scriptPath), "..", "..");
const HOUR = 60 * 60 * 1_000;

export function isUpdateWindow(events, now) {
  const current = now.getTime();
  return (events ?? []).some((event) => {
    const startsAt = new Date(event.startsAt).getTime();
    return Number.isFinite(startsAt) && current >= startsAt - (12 * HOUR) && current <= startsAt + (24 * HOUR);
  });
}

async function loadEvents(root) {
  return JSON.parse(await readFile(path.join(root, "data", "events.json"), "utf8"));
}

function selectSources(sources, options, events) {
  const enabled = sources.filter((source) => source.enabled && (!options.sourceId || source.id === options.sourceId));
  if (options.mode === "hourly" && !isUpdateWindow(events, options.now)) return [];
  return enabled;
}

function outputStamp(date) {
  return date.toISOString().replace(/[:.]/g, "-");
}

export async function runMonitoring(options = {}) {
  const root = options.root ?? defaultRoot;
  const now = options.now instanceof Date ? options.now : new Date(options.now ?? Date.now());
  const mode = options.mode ?? "scheduled";
  const sources = options.sources ?? await loadSourceRegistry(path.join(root, "monitoring", "sources.json"));
  const events = options.events ?? await loadEvents(root);
  const selected = selectSources(sources, { ...options, now, mode }, events);
  const stateDir = options.stateDir ?? path.join(root, ".monitor-state", "state");
  const outputDir = options.outputDir ?? path.join(root, "artifacts", "monitoring", `run-${outputStamp(now)}`);
  const collectSourceImpl = options.collectSourceImpl ?? collectSource;
  const startedAt = now.toISOString();

  if (!selected.length) {
    return { status: "skipped", mode, startedAt, baselinesCreated: 0, sourcesChecked: 0, failures: [], changes: [], actionable: [], reviews: [], outputDir };
  }

  await mkdir(path.join(outputDir, "raw"), { recursive: true });
  const changes = [];
  const failures = [];
  let baselinesCreated = 0;

  for (const source of selected) {
    const previous = await readSnapshot(stateDir, source.id);
    const result = await collectSourceImpl(source);
    const current = result.ok ? createSuccessSnapshot(previous, result) : recordFailure(previous, result);
    if (result.ok && !previous?.lastSuccess) baselinesCreated += 1;
    if (result.ok) {
      await writeFile(path.join(outputDir, "raw", `${source.id}.json`), `${JSON.stringify(result.raw, null, 2)}\n`, "utf8");
    } else {
      failures.push({ sourceId: source.id, checkedAt: result.checkedAt, error: result.error });
    }
    changes.push(...compareSnapshot(source, previous, current));
    await writeSnapshot(stateDir, source.id, current);
  }

  const actionable = changes.filter((item) => item.kind !== "trend");
  const sourcesById = new Map(sources.map((source) => [source.id, source]));
  const reviews = await writeReviewFiles(outputDir, sourcesById, actionable, startedAt);
  const contentAudit = await runContentAudit(root, outputDir, startedAt);
  const summary = {
    status: failures.length ? "partial_success" : "success",
    mode,
    startedAt,
    baselinesCreated,
    sourcesChecked: selected.length,
    failures,
    changes,
    actionable,
    reviews,
    contentAudit,
    outputDir,
  };
  await writeFile(path.join(outputDir, "run-summary.json"), `${JSON.stringify(summary, null, 2)}\n`, "utf8");
  return summary;
}

function parseArgs(argv) {
  const options = {};
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--mode") options.mode = argv[++index];
    else if (arg === "--state-dir") options.stateDir = path.resolve(argv[++index]);
    else if (arg === "--output-dir") options.outputDir = path.resolve(argv[++index]);
    else if (arg === "--source") options.sourceId = argv[++index];
    else if (arg === "--now") options.now = new Date(argv[++index]);
    else throw new Error(`Unknown monitoring argument: ${arg}`);
  }
  return options;
}

async function main() {
  const summary = await runMonitoring(parseArgs(process.argv.slice(2)));
  console.log(JSON.stringify({
    status: summary.status,
    sourcesChecked: summary.sourcesChecked,
    baselinesCreated: summary.baselinesCreated,
    actionable: summary.actionable.length,
    contentOpportunities: summary.contentAudit?.summary.totalOpportunities ?? 0,
    emptyCollections: summary.contentAudit?.summary.emptyCollectionCount ?? 0,
    incompleteRecords: summary.contentAudit?.summary.incompleteRecordCount ?? 0,
    failures: summary.failures.length,
    outputDir: summary.outputDir,
  }, null, 2));
  if (summary.status === "partial_success") process.exitCode = 2;
}

if (process.argv[1] && path.resolve(process.argv[1]) === scriptPath) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
