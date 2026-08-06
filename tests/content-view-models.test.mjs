import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  buildCollectionFilterRows,
  buildCrateViewModels,
  buildEvidenceHref,
  buildGamepassViewModels,
  buildRebirthViewModels,
  buildToyViewModels,
  buildWorkerViewModels,
} from "../lib/content-view-models.mjs";

const evidence = [{
  status: "in_game_verified",
  verifiedAt: "2026-08-02T10:00:00+08:00",
  screenshot: "/evidence/update-3/panel.webp",
  sourceUrl: "https://www.youtube.com/watch?v=example",
  videoTimestamp: "00:54",
  gameVersion: "Community recording from July 27, 2026",
  notes: "Third-party recording; current build still needs an original capture.",
}];

test("content view models expose verified collection and progression records to pages", () => {
  const crates = [{
    slug: "starter-box",
    name: "Starter Box",
    area: "Spawn",
    unlockRequirement: "Available immediately",
    cost: "100 Cash",
    possibleToys: ["Duck", "Frog"],
    event: "Standard",
    evidence,
  }];
  const toys = [{
    slug: "duck",
    name: "Duck",
    rarity: "Common",
    sourceCrateIds: ["starter-box"],
    cashValue: "25 Cash",
    interaction: "Squeak",
    event: "Standard",
    indexNumber: 1,
    evidence,
  }];

  assert.deepEqual(buildCrateViewModels(crates), [{
    name: "Starter Box",
    area: "Spawn",
    requirement: "Available immediately",
    cost: "100 Cash",
    possibleToys: "Duck, Frog",
    event: "Standard",
    rarity: null,
    verifiedAt: "2026-08-02T10:00:00+08:00",
    evidenceStatus: "in_game_verified",
    evidenceUrl: "https://www.youtube.com/watch?v=example",
    evidenceScreenshot: "/evidence/update-3/panel.webp",
    evidenceTimestamp: "00:54",
    evidenceVersion: "Community recording from July 27, 2026",
    evidenceNotes: "Third-party recording; current build still needs an original capture.",
  }]);
  assert.deepEqual(buildToyViewModels(toys, crates), [{
    name: "Duck",
    rarity: "Common",
    sourceCrates: "Starter Box",
    cashValue: "25 Cash",
    interaction: "Squeak",
    event: "Standard",
    indexNumber: "1",
    verifiedAt: "2026-08-02T10:00:00+08:00",
    evidenceStatus: "in_game_verified",
    evidenceUrl: "https://www.youtube.com/watch?v=example",
    evidenceScreenshot: "/evidence/update-3/panel.webp",
    evidenceTimestamp: "00:54",
    evidenceVersion: "Community recording from July 27, 2026",
    evidenceNotes: "Third-party recording; current build still needs an original capture.",
  }]);
  assert.deepEqual(buildCollectionFilterRows({ crates, toys }), [
    { type: "crate", name: "Starter Box", crate: "Starter Box", rarity: undefined, eventLimited: false },
    { type: "toy", name: "Duck", crate: "Starter Box", rarity: "Common", eventLimited: false },
  ]);

  assert.equal(buildRebirthViewModels([{ slug: "rebirth-1", name: "Rebirth 1", requirement: "1M Cash", resets: ["Cash"], keeps: ["Gamepasses"], reward: "2x multiplier", unlock: "Worker slot", gameVersion: "Update 3", evidence }])[0].reward, "2x multiplier");
  assert.equal(buildWorkerViewModels([{ slug: "group-worker", source: "ASMR Labs group", unlock: "Join group", cost: "Free", slot: "1", task: "Open crates", offlineBehavior: "No", knownFix: "Rejoin", evidence }])[0].task, "Open crates");
});

test("gamepass view models expose effects and leave genuinely missing fields empty", () => {
  assert.deepEqual(buildGamepassViewModels([{
    slug: "2x-money",
    name: "2x Money",
    priceRobux: 11,
    effect: "Doubles cash earned",
    bestFor: ["Active players"],
    gameStage: "all",
    evidence,
  }]), [{
    name: "2x Money",
    price: "11 Robux",
    effect: "Doubles cash earned",
    bestFor: "Active players",
    gameStage: "All stages",
    verdict: null,
    verifiedAt: "2026-08-02T10:00:00+08:00",
    evidenceStatus: "in_game_verified",
    evidenceUrl: "https://www.youtube.com/watch?v=example",
    evidenceScreenshot: "/evidence/update-3/panel.webp",
    evidenceTimestamp: "00:54",
    evidenceVersion: "Community recording from July 27, 2026",
    evidenceNotes: "Third-party recording; current build still needs an original capture.",
  }]);
});

test("video evidence links open at the recorded timestamp", () => {
  assert.equal(
    buildEvidenceHref("https://www.youtube.com/watch?v=example", "01:05"),
    "https://www.youtube.com/watch?v=example&t=65s",
  );
  assert.equal(buildEvidenceHref("https://example.com/article", "00:54"), "https://example.com/article");
});

test("Roblox Index data answers five observed crate-to-toy relationships", () => {
  const crates = JSON.parse(readFileSync(new URL("../data/crates.json", import.meta.url), "utf8"));
  const toys = JSON.parse(readFileSync(new URL("../data/toys.json", import.meta.url), "utf8"));
  const crateModels = buildCrateViewModels(crates);
  const toyModels = buildToyViewModels(toys, crates);
  const byToy = new Map(toyModels.map((toy) => [toy.name, toy]));
  const byCrate = new Map(crateModels.map((crate) => [crate.name, crate]));

  assert.equal(crates.length, 10);
  assert.equal(toys.length, 5);
  assert.equal(byToy.get("Chocolate Keyboard")?.sourceCrates, "Chocolate Key Crate");
  assert.equal(byToy.get("Candy Keyboard")?.sourceCrates, "Candy Key Crate");
  assert.equal(byToy.get("Needoo")?.sourceCrates, "Needle Crate");
  assert.equal(byToy.get("Honey Dipper")?.sourceCrates, "Honey Dipper Crate");
  assert.equal(byToy.get("Slime")?.sourceCrates, "Slime Crate");
  assert.equal(byCrate.get("Candy Key Crate")?.cost, "$10K (Jul 27); $1.0K (Aug 1)");
});
