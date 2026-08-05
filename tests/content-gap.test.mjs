import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { auditContent, writeContentAudit } from "../scripts/monitor/content-gap.mjs";

const requirements = {
  version: 1,
  pages: [
    {
      route: "/crates-and-toys/",
      collections: [{
        id: "crates",
        dataFile: "data/crates.json",
        label: "Crates",
        requiredFields: ["name", "area", "cost", "evidence"],
        captureInstruction: "Capture every crate panel.",
      }],
    },
    {
      route: "/gamepasses/",
      collections: [{
        id: "gamepasses",
        dataFile: "data/gamepasses.json",
        label: "Gamepasses",
        requiredFields: ["name", "priceRobux", "effect", "gameStage", "verdict", "evidence"],
        captureInstruction: "Capture the purchase panel and a safe before/after test.",
      }],
    },
  ],
};

test("content audit turns empty collections and incomplete records into route-specific work", () => {
  const audit = auditContent(requirements, {
    crates: [],
    gamepasses: [{ slug: "2x-money", name: "2x Money", priceRobux: 11, evidence: [{ status: "community_reported", verifiedAt: "2026-07-30" }] }],
  }, "2026-08-02T10:00:00.000Z");

  assert.equal(audit.summary.emptyCollectionCount, 1);
  assert.equal(audit.summary.incompleteRecordCount, 1);
  assert.equal(audit.summary.pagesAffected, 2);
  assert.deepEqual(audit.opportunities[0], {
    route: "/crates-and-toys/",
    collection: "crates",
    dataFile: "data/crates.json",
    type: "empty_collection",
    recordSlug: null,
    missingFields: ["name", "area", "cost", "evidence"],
    captureInstruction: "Capture every crate panel.",
    detectedAt: "2026-08-02T10:00:00.000Z",
    status: "needs_capture",
  });
  assert.deepEqual(audit.opportunities[1].missingFields, ["effect", "gameStage", "verdict"]);
  assert.equal(audit.coverage[1].completionPercent, 50);
});

test("content audit writes machine-readable opportunities and human capture reports", async () => {
  const temporary = await mkdtemp(path.join(os.tmpdir(), "unbox-content-audit-"));
  try {
    const audit = auditContent(requirements, { crates: [], gamepasses: [] }, "2026-08-02T10:00:00.000Z");
    const files = await writeContentAudit(temporary, audit);

    const opportunities = JSON.parse(await readFile(files.opportunitiesFile, "utf8"));
    const capturePlan = await readFile(files.capturePlanFile, "utf8");
    const coverageSummary = await readFile(files.coverageSummaryFile, "utf8");
    assert.equal(opportunities.length, 2);
    assert.match(capturePlan, /\/crates-and-toys\//);
    assert.match(capturePlan, /Capture every crate panel\./);
    assert.match(coverageSummary, /0%/);
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
});
