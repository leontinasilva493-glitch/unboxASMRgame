import test from "node:test";
import assert from "node:assert/strict";
import { deriveEventStatus, getCountdownParts } from "../scripts/event-utils.mjs";

test("deriveEventStatus covers upcoming, live, and ended windows", () => {
  const startsAt = "2026-08-02T15:00:00-04:00";
  const endsAt = "2026-08-09T15:00:00-04:00";

  assert.equal(deriveEventStatus(startsAt, endsAt, new Date("2026-08-01T00:00:00Z")), "upcoming");
  assert.equal(deriveEventStatus(startsAt, endsAt, new Date("2026-08-04T00:00:00Z")), "live");
  assert.equal(deriveEventStatus(startsAt, endsAt, new Date("2026-08-10T00:00:00Z")), "ended");
});

test("getCountdownParts clamps completed countdowns to zero", () => {
  assert.deepEqual(
    getCountdownParts("2026-08-02T19:00:00Z", new Date("2026-08-03T00:00:00Z")),
    { days: 0, hours: 0, minutes: 0, seconds: 0 },
  );
});
