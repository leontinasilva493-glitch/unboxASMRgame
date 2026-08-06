import test from "node:test";
import assert from "node:assert/strict";
import { validateDataCollections } from "../scripts/data-validation.mjs";

test("data validation rejects duplicate slugs and invalid dates", () => {
  const errors = validateDataCollections({
    events: [
      { slug: "same", startsAt: "not-a-date", endsAt: "2026-08-01T00:00:00Z", evidence: [] },
      { slug: "same", startsAt: "2026-08-02T00:00:00Z", endsAt: "2026-08-01T00:00:00Z", evidence: [] },
    ],
    codes: [],
    gamepasses: [],
    crates: [],
    toys: [],
  });

  assert.ok(errors.some((error) => error.includes("duplicate slug")));
  assert.ok(errors.some((error) => error.includes("invalid startsAt")));
  assert.ok(errors.some((error) => error.includes("ends before")));
});

test("data validation enforces evidence gates and crate references", () => {
  const errors = validateDataCollections({
    events: [],
    codes: [{ code: "FAKE", status: "active", checkedAt: "", evidence: [] }],
    gamepasses: [{ slug: "pass", verdict: "Best", evidence: [{ status: "unverified", verifiedAt: "2026-07-30" }] }],
    crates: [{ slug: "known", toyIds: [], evidence: [] }],
    toys: [{ slug: "toy", sourceCrateIds: ["missing"], evidence: [] }],
  });

  assert.ok(errors.some((error) => error.includes("active code")));
  assert.ok(errors.some((error) => error.includes("unverified gamepass")));
  assert.ok(errors.some((error) => error.includes("unknown crate")));
});

test("data validation covers rebirth and worker slugs and evidence", () => {
  const errors = validateDataCollections({
    events: [],
    codes: [],
    gamepasses: [],
    crates: [],
    toys: [],
    rebirths: [
      { slug: "rebirth-1", evidence: [{ status: "in_game_verified", verifiedAt: "invalid" }] },
      { slug: "rebirth-1", evidence: [] },
    ],
    workers: [
      { slug: "worker", evidence: [{ status: "in_game_verified", verifiedAt: "2026-08-02" }] },
      { slug: "worker", evidence: [] },
    ],
  });

  assert.ok(errors.some((error) => error.includes("rebirths: duplicate slug")));
  assert.ok(errors.some((error) => error.includes("workers: duplicate slug")));
  assert.ok(errors.some((error) => error.includes("rebirth rebirth-1: evidence has invalid verifiedAt")));
  assert.ok(errors.some((error) => error.includes("worker worker: in_game_verified evidence needs")));
});

test("community gameplay evidence requires a source, notes, and a valid video timestamp", () => {
  const errors = validateDataCollections({
    events: [], codes: [], gamepasses: [], workers: [],
    crates: [{ slug: "crate", evidence: [{ status: "community_reported", verifiedAt: "2026-08-06", videoTimestamp: "1:75" }] }],
    toys: [{ slug: "toy", evidence: [{ status: "community_reported", verifiedAt: "2026-08-06", sourceUrl: "https://www.youtube.com/watch?v=example" }] }],
    rebirths: [],
  });

  assert.ok(errors.some((error) => error.includes("invalid videoTimestamp")));
  assert.ok(errors.some((error) => error.includes("community_reported evidence needs a source URL")));
  assert.ok(errors.some((error) => error.includes("community_reported evidence needs explicit notes")));
});

test("data validation catches one-sided crate-to-toy relationships", () => {
  const errors = validateDataCollections({
    events: [], codes: [], gamepasses: [], workers: [], rebirths: [],
    crates: [{ slug: "key-crate", name: "Key Crate", possibleToys: [], evidence: [] }],
    toys: [{ slug: "keyboard", name: "Keyboard", sourceCrateIds: ["key-crate"], evidence: [] }],
  });

  assert.ok(errors.some((error) => error.includes("relationship is not mirrored by crate")));
});
