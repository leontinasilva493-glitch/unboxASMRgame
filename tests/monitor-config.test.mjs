import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadSourceRegistry, validateSourceRegistry } from "../scripts/monitor/config.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

test("registry accepts the pinned Roblox public sources", async () => {
  const sources = await loadSourceRegistry(path.join(root, "monitoring", "sources.json"));

  assert.deepEqual(sources.map((source) => source.id), [
    "roblox-place-universe",
    "roblox-game-details",
    "roblox-group-details",
  ]);
  assert.equal(sources[1].expectedIdentity.universeId, 10454554751);
  assert.equal(sources[1].expectedIdentity.creatorId, 1110056661);
});

test("registry rejects D-tier sources", () => {
  const errors = validateSourceRegistry({
    version: 1,
    sources: [{
      id: "leak",
      label: "Leak",
      tier: "D",
      kind: "webpage",
      url: "https://example.com",
      cadence: "daily",
      parser: "webpage_text",
      allowedClaims: ["gameplay"],
      affectedRoutes: ["/updates/"],
      enabled: true,
      contentFields: [],
      trendFields: [],
      expectedIdentity: {},
    }],
  });

  assert.ok(errors.some((error) => error.includes("tier")));
});

test("registry rejects gameplay claims from automatic sources", () => {
  const errors = validateSourceRegistry({
    version: 1,
    sources: [{
      id: "unsafe",
      label: "Unsafe",
      tier: "A",
      kind: "roblox_api",
      url: "https://games.roblox.com/v1/games",
      cadence: "daily",
      parser: "roblox_game",
      allowedClaims: ["gameplay_effect"],
      affectedRoutes: ["/gamepasses/"],
      enabled: true,
      contentFields: [],
      trendFields: [],
      expectedIdentity: {},
    }],
  });

  assert.ok(errors.some((error) => error.includes("manual")));
});
