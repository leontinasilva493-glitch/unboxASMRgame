import test from "node:test";
import assert from "node:assert/strict";
import { filterCollectionRows } from "../scripts/filter-utils.mjs";

const rows = [
  { type: "crate", name: "Starter Box", eventLimited: false },
  { type: "toy", name: "Honey Bell", crate: "Honey Crate", rarity: "Epic", eventLimited: true },
  { type: "toy", name: "Soft Drum", crate: "Starter Box", rarity: "Common", eventLimited: false },
];

test("collection filter combines query, crate, rarity, and event state", () => {
  assert.deepEqual(filterCollectionRows(rows, { query: "bell", crate: "Honey Crate", rarity: "Epic", event: "limited" }), [rows[1]]);
  assert.deepEqual(filterCollectionRows(rows, { event: "standard" }), [rows[0], rows[2]]);
  assert.deepEqual(filterCollectionRows(rows, { query: "SOFT" }), [rows[2]]);
});
