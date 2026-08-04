import test from "node:test";
import assert from "node:assert/strict";
import {
  buildCollectionFilterRows,
  buildCrateViewModels,
  buildGamepassViewModels,
  buildRebirthViewModels,
  buildToyViewModels,
  buildWorkerViewModels,
} from "../lib/content-view-models.mjs";

const evidence = [{
  status: "in_game_verified",
  verifiedAt: "2026-08-02T10:00:00+08:00",
  screenshot: "/evidence/update-3/panel.webp",
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
    verifiedAt: "2026-08-02T10:00:00+08:00",
    evidenceStatus: "in_game_verified",
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
  }]);
});
