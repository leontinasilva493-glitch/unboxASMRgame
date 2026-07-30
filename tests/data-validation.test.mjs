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
