import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { collectSource } from "../scripts/monitor/collect.mjs";
import { normalizeText, parseSource, stableJson } from "../scripts/monitor/normalize.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function fixture(name) {
  return JSON.parse(await readFile(path.join(root, "tests", "fixtures", "monitor", name), "utf8"));
}

const gameSource = {
  id: "roblox-game-details",
  parser: "roblox_game",
  expectedIdentity: {
    universeId: 10454554751,
    placeId: 112233638491976,
    creatorId: 1110056661,
    creatorType: "Group",
  },
};

test("game parser separates content, identity, and trend fields", async () => {
  const parsed = parseSource(gameSource, await fixture("game-details.json"));

  assert.equal(parsed.content.name, "[🍯] Unbox ASMR!");
  assert.equal(parsed.content.description, "📦Unbox ASMR Toys! 🎧Relax & collect!\n\n🔔 Follow for updates and special codes!");
  assert.equal(parsed.trends.playing, 38182);
  assert.equal(parsed.identity.creatorId, 1110056661);
  assert.equal(parsed.identity.placeId, 112233638491976);
});

test("place and group parsers retain pinned identities", async () => {
  const place = parseSource({ id: "place", parser: "roblox_place_universe", expectedIdentity: { placeId: 112233638491976 } }, await fixture("place-universe.json"));
  const group = parseSource({ id: "group", parser: "roblox_group", expectedIdentity: {} }, await fixture("group-details.json"));

  assert.deepEqual(place.identity, { placeId: 112233638491976, universeId: 10454554751 });
  assert.equal(group.identity.groupId, 1110056661);
  assert.equal(group.content.shout, null);
});

test("normalization is stable across whitespace and object key order", () => {
  assert.equal(normalizeText("  hello  \r\n\r\n world  "), "hello\n\nworld");
  assert.equal(stableJson({ b: 2, a: { d: 4, c: 3 } }), '{"a":{"c":3,"d":4},"b":2}');
});

test("collector retries transient failures and returns normalized data", async () => {
  const payload = await fixture("game-details.json");
  let attempts = 0;
  const fetchImpl = async () => {
    attempts += 1;
    if (attempts < 3) return new Response("temporary", { status: 503 });
    return Response.json(payload);
  };

  const result = await collectSource({ ...gameSource, url: "https://example.com" }, {
    fetchImpl,
    delay: async () => {},
    now: () => new Date("2026-08-01T00:00:00Z"),
  });

  assert.equal(attempts, 3);
  assert.equal(result.ok, true);
  assert.equal(result.checkedAt, "2026-08-01T00:00:00.000Z");
  assert.equal(result.normalized.identity.universeId, 10454554751);
});

test("collector classifies not-found without replacing it with empty data", async () => {
  let attempts = 0;
  const result = await collectSource({ ...gameSource, url: "https://example.com" }, {
    fetchImpl: async () => {
      attempts += 1;
      return new Response("missing", { status: 404 });
    },
    delay: async () => {},
  });

  assert.equal(attempts, 1);
  assert.equal(result.ok, false);
  assert.equal(result.error.category, "not_found");
  assert.equal("normalized" in result, false);
});
