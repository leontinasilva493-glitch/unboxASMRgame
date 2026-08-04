import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { validateDataCollections } from "../data-validation.mjs";

const scriptPath = fileURLToPath(import.meta.url);
const ALLOWED_FILES = new Set([
  "data/game.json",
  "data/events.json",
  "data/codes.json",
  "data/gamepasses.json",
  "data/crates.json",
  "data/toys.json",
  "data/rebirths.json",
  "data/workers.json",
  "data/snapshots.json",
  "data/changelog.json",
]);
const EVIDENCE_STATUSES = new Set(["official", "in_game_verified", "community_reported"]);
const DANGEROUS_KEYS = new Set(["__proto__", "prototype", "constructor"]);

function validDate(value) {
  return typeof value === "string" && !Number.isNaN(new Date(value).getTime());
}

export function validateApprovedPayload(payload) {
  const errors = [];
  if (!Number.isInteger(payload?.issueNumber) || payload.issueNumber < 1) errors.push("issueNumber must be a positive integer");
  if (typeof payload?.sourceId !== "string" || !payload.sourceId.trim()) errors.push("sourceId is required");
  if (!validDate(payload?.verifiedAt)) errors.push("verifiedAt must be an absolute date-time");
  if (typeof payload?.gameVersion !== "string" || !payload.gameVersion.trim()) errors.push("gameVersion is required");
  if (!Array.isArray(payload?.evidence) || !payload.evidence.length) errors.push("evidence must contain at least one item");
  for (const [index, evidence] of (payload?.evidence ?? []).entries()) {
    if (!EVIDENCE_STATUSES.has(evidence?.status)) errors.push(`evidence[${index}]: unsupported status`);
    if (!validDate(evidence?.verifiedAt)) errors.push(`evidence[${index}]: invalid verifiedAt`);
    if (evidence?.sourceUrl) {
      try { new URL(evidence.sourceUrl); } catch { errors.push(`evidence[${index}]: invalid sourceUrl`); }
    }
    if (evidence?.status === "in_game_verified" && !evidence.screenshot && !evidence.notes) {
      errors.push(`evidence[${index}]: in_game_verified requires screenshot or notes`);
    }
  }
  if (!Array.isArray(payload?.operations) || !payload.operations.length) errors.push("operations must contain at least one item");
  for (const [index, operation] of (payload?.operations ?? []).entries()) {
    if (!ALLOWED_FILES.has(operation?.file)) errors.push(`operations[${index}]: file must match an allowed data/*.json file`);
    if (!new Set(["add", "replace"]).has(operation?.op)) errors.push(`operations[${index}]: op must be add or replace`);
    if (typeof operation?.path !== "string" || !operation.path.startsWith("/")) errors.push(`operations[${index}]: path must be a JSON pointer`);
    if (!("value" in (operation ?? {}))) errors.push(`operations[${index}]: value is required`);
  }
  return errors;
}

function decodePointer(pointer) {
  return pointer.slice(1).split("/").map((part) => part.replace(/~1/g, "/").replace(/~0/g, "~"));
}

function applyOperation(document, operation) {
  const parts = decodePointer(operation.path);
  if (!parts.length || parts.some((part) => DANGEROUS_KEYS.has(part))) throw new Error(`Unsafe JSON pointer: ${operation.path}`);
  let parent = document;
  for (const part of parts.slice(0, -1)) {
    if (parent === null || typeof parent !== "object" || !(part in parent)) throw new Error(`JSON pointer parent does not exist: ${operation.path}`);
    parent = parent[part];
  }
  const key = parts.at(-1);
  if (Array.isArray(parent)) {
    if (operation.op === "add") {
      if (key === "-") parent.push(operation.value);
      else {
        const index = Number(key);
        if (!Number.isInteger(index) || index < 0 || index > parent.length) throw new Error(`Invalid array index: ${operation.path}`);
        parent.splice(index, 0, operation.value);
      }
    } else {
      const index = Number(key);
      if (!Number.isInteger(index) || index < 0 || index >= parent.length) throw new Error(`Replace target does not exist: ${operation.path}`);
      parent[index] = operation.value;
    }
    return;
  }
  if (!parent || typeof parent !== "object") throw new Error(`JSON pointer parent is not an object: ${operation.path}`);
  if (operation.op === "replace" && !(key in parent)) throw new Error(`Replace target does not exist: ${operation.path}`);
  parent[key] = operation.value;
}

async function loadJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}

function validatePromotionGates(collections) {
  const errors = validateDataCollections(collections);
  for (const code of collections.codes ?? []) {
    if (code.status === "active" && !(code.evidence ?? []).some((item) => ["official", "in_game_verified"].includes(item.status))) {
      errors.push(`active code ${code.code}: official or in-game evidence is required`);
    }
  }
  for (const pass of collections.gamepasses ?? []) {
    if (pass.verdict && !(pass.evidence ?? []).some((item) => item.status === "in_game_verified")) {
      errors.push(`gamepass ${pass.slug}: verdict requires in-game evidence`);
    }
  }
  return errors;
}

async function atomicWrite(filePath, value) {
  await mkdir(path.dirname(filePath), { recursive: true });
  const temporary = `${filePath}.${randomUUID()}.tmp`;
  await writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  await rename(temporary, filePath);
}

export async function promote({ payload, root, apply = false, expectedIssue }) {
  const errors = validateApprovedPayload(payload);
  if (expectedIssue !== undefined && payload?.issueNumber !== Number(expectedIssue)) errors.push("payload issueNumber does not match the approved issue");
  if (errors.length) throw new Error(`Invalid approved payload:\n${errors.map((error) => `- ${error}`).join("\n")}`);

  const documents = new Map();
  for (const operation of payload.operations) {
    if (!documents.has(operation.file)) documents.set(operation.file, await loadJson(path.join(root, operation.file)));
    applyOperation(documents.get(operation.file), operation);
  }

  const collections = {};
  for (const name of ["events", "codes", "gamepasses", "crates", "toys"]) {
    const relative = `data/${name}.json`;
    collections[name] = documents.has(relative) ? documents.get(relative) : await loadJson(path.join(root, relative));
  }
  const gateErrors = validatePromotionGates(collections);
  if (gateErrors.length) throw new Error(`Promoted data failed evidence gates:\n${gateErrors.map((error) => `- ${error}`).join("\n")}`);

  if (apply) {
    for (const [relative, document] of documents) await atomicWrite(path.join(root, relative), document);
  }
  return { applied: apply, files: [...documents.keys()].sort(), issueNumber: payload.issueNumber };
}

export function hasApprovedLabel(issue) {
  return (issue?.labels ?? []).some((label) => (typeof label === "string" ? label : label.name) === "evidence-approved");
}

function parseArgs(argv) {
  const options = { apply: false };
  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] === "--payload") options.payloadPath = path.resolve(argv[++index]);
    else if (argv[index] === "--expected-issue") options.expectedIssue = Number(argv[++index]);
    else if (argv[index] === "--apply") options.apply = true;
    else throw new Error(`Unknown promotion argument: ${argv[index]}`);
  }
  if (!options.payloadPath) throw new Error("--payload is required");
  return options;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const payload = JSON.parse(await readFile(options.payloadPath, "utf8"));
  const root = path.resolve(path.dirname(scriptPath), "..", "..");
  console.log(JSON.stringify(await promote({ payload, root, apply: options.apply, expectedIssue: options.expectedIssue }), null, 2));
}

if (process.argv[1] && path.resolve(process.argv[1]) === scriptPath) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
