import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

export async function readSnapshot(stateDir, sourceId) {
  try {
    return JSON.parse(await readFile(path.join(stateDir, `${sourceId}.json`), "utf8"));
  } catch (error) {
    if (error?.code === "ENOENT") return null;
    throw error;
  }
}

export async function writeSnapshot(stateDir, sourceId, snapshot) {
  await mkdir(stateDir, { recursive: true });
  const target = path.join(stateDir, `${sourceId}.json`);
  const temporary = `${target}.${randomUUID()}.tmp`;
  await writeFile(temporary, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
  await rename(temporary, target);
}

export function createSuccessSnapshot(previous, result) {
  if (!result?.ok) throw new Error("A successful collection result is required");
  const playing = result.normalized?.trends?.playing;
  const previousZeroStreak = previous?.health?.zeroPlayingStreak ?? 0;
  return {
    sourceId: result.sourceId,
    lastCheckedAt: result.checkedAt,
    consecutiveFailures: 0,
    lastError: null,
    health: {
      zeroPlayingStreak: playing === 0 ? previousZeroStreak + 1 : 0,
    },
    lastSuccess: {
      checkedAt: result.checkedAt,
      parserVersion: result.parserVersion,
      normalized: result.normalized,
    },
  };
}

export function recordFailure(previous, result) {
  if (result?.ok !== false) throw new Error("A failed collection result is required");
  return {
    sourceId: result.sourceId,
    lastCheckedAt: result.checkedAt,
    consecutiveFailures: (previous?.consecutiveFailures ?? 0) + 1,
    lastError: result.error,
    health: previous?.health ?? { zeroPlayingStreak: 0 },
    lastSuccess: previous?.lastSuccess ?? null,
  };
}
