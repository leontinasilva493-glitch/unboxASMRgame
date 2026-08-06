import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { test } from "node:test";

const readJson = (path) => JSON.parse(readFileSync(new URL(`../${path}`, import.meta.url), "utf8"));

function assertCommunityEvidence(record) {
  const evidence = record.evidence?.at(-1);
  assert.equal(evidence?.status, "community_reported", `${record.slug} must not be promoted beyond its third-party evidence`);
  assert.match(evidence?.sourceUrl ?? "", /^https:\/\/www\.youtube\.com\/watch\?/);
  assert.match(evidence?.videoTimestamp ?? "", /^\d+:[0-5]\d$/);
  assert.match(evidence?.gameVersion ?? "", /(July 27|August 1), 2026/);
  assert.equal(evidence?.verifiedAt, "2026-08-06");
  assert.ok(evidence?.notes);
  assert.ok(evidence?.screenshot?.startsWith("/images/evidence/"));
  assert.equal(existsSync(new URL(`../public${evidence.screenshot}`, import.meta.url)), true, `${record.slug} screenshot must exist`);
}

test("Roblox Index ships a first attributed community snapshot without claiming completeness", () => {
  const crates = readJson("data/crates.json");
  const toys = readJson("data/toys.json");

  assert.equal(crates.length, 10);
  assert.equal(toys.length, 5);
  assert.deepEqual(crates.map(({ name, cost }) => [name, cost]), [
    ["Needle Crate", "$150"],
    ["Foam Ball Crate", "$2K"],
    ["Cheese Squishy Crate", "$8.5K"],
    ["Candy Key Crate", "$10K (Jul 27); $1.0K (Aug 1)"],
    ["Wax Foam Ball Crate", "$20K"],
    ["Rainbow Key Crate", "$120K"],
    ["Honey Key Crate", "$39.9M"],
    ["Chocolate Key Crate", "$100"],
    ["Honey Dipper Crate", "$4K"],
    ["Slime Crate", "$25K"],
  ]);
  assert.deepEqual(toys.map(({ name, rarity, cashValue }) => [name, rarity, cashValue]), [
    ["Chocolate Keyboard", "Common", "+$4 / Use"],
    ["Candy Keyboard", "Uncommon", undefined],
    ["Needoo", "Common", undefined],
    ["Honey Dipper", undefined, undefined],
    ["Slime", "Rare", undefined],
  ]);
  crates.forEach(assertCommunityEvidence);
  toys.forEach(assertCommunityEvidence);
});

test("rebirth snapshot answers the four decision questions without lifting the evidence gate", () => {
  const rebirths = readJson("data/rebirths.json");
  assert.equal(rebirths.length, 1);
  assert.equal(rebirths[0].requirement, "$75K Money and Rare Slime");
  assert.equal(rebirths[0].resets, "Everything except limited, exclusive, or rebirth ASMRs");
  assert.equal(rebirths[0].keeps, "Limited, exclusive, and rebirth ASMRs");
  assert.equal(rebirths[0].reward, "+10% Money Bonus; Lightning Keyboard (Rebirth ASMR); +2 Worker Slots");
  assertCommunityEvidence(rebirths[0]);
});
