import { readFile } from "node:fs/promises";

const TIERS = new Set(["A", "B", "C"]);
const KINDS = new Set(["roblox_api", "webpage", "rss", "social", "manual"]);
const CADENCES = new Set(["twice_daily", "daily", "twice_weekly", "update_window", "manual"]);
const GAMEPLAY_CLAIMS = new Set([
  "gameplay",
  "gameplay_effect",
  "price",
  "unlock_condition",
  "rebirth_result",
  "code_validity",
]);

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

export function validateSourceRegistry(input) {
  const errors = [];
  if (!input || input.version !== 1) errors.push("registry: version must be 1");
  if (!Array.isArray(input?.sources)) return [...errors, "registry: sources must be an array"];

  const ids = new Set();
  for (const [index, source] of input.sources.entries()) {
    const label = `sources[${index}]`;
    if (!isNonEmptyString(source?.id)) errors.push(`${label}: id is required`);
    if (ids.has(source?.id)) errors.push(`${label}: duplicate id ${source.id}`);
    ids.add(source?.id);
    if (!isNonEmptyString(source?.label)) errors.push(`${label}: label is required`);
    if (!TIERS.has(source?.tier)) errors.push(`${label}: tier must be A, B, or C`);
    if (!KINDS.has(source?.kind)) errors.push(`${label}: unsupported kind`);
    if (!CADENCES.has(source?.cadence)) errors.push(`${label}: unsupported cadence`);
    if (!isNonEmptyString(source?.parser)) errors.push(`${label}: parser is required`);
    try {
      new URL(source?.url);
    } catch {
      errors.push(`${label}: url must be absolute`);
    }

    for (const field of ["allowedClaims", "affectedRoutes", "contentFields", "trendFields"]) {
      if (!Array.isArray(source?.[field])) errors.push(`${label}: ${field} must be an array`);
    }
    if (typeof source?.enabled !== "boolean") errors.push(`${label}: enabled must be boolean`);
    if (!source?.expectedIdentity || typeof source.expectedIdentity !== "object" || Array.isArray(source.expectedIdentity)) {
      errors.push(`${label}: expectedIdentity must be an object`);
    }

    const hasGameplayClaim = (source?.allowedClaims ?? []).some((claim) => GAMEPLAY_CLAIMS.has(claim));
    if (hasGameplayClaim && source?.kind !== "manual") {
      errors.push(`${label}: gameplay claims require a manual in-game source`);
    }
  }

  return errors;
}

export async function loadSourceRegistry(filePath) {
  const input = JSON.parse(await readFile(filePath, "utf8"));
  const errors = validateSourceRegistry(input);
  if (errors.length) throw new Error(`Invalid monitoring source registry:\n${errors.map((error) => `- ${error}`).join("\n")}`);
  return input.sources;
}
