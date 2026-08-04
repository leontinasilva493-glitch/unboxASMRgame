const stageLabels = {
  beginner: "Beginner",
  midgame: "Midgame",
  late_game: "Late game",
  all: "All stages",
};

function text(value) {
  if (value === undefined || value === null || value === "") return null;
  if (Array.isArray(value)) return value.length ? value.join(", ") : null;
  return String(value);
}

function latestEvidence(record) {
  const evidence = record.evidence?.at(-1);
  return {
    verifiedAt: evidence?.verifiedAt ?? null,
    evidenceStatus: evidence?.status ?? "unverified",
  };
}

function isEventLimited(value) {
  const normalized = text(value)?.toLowerCase();
  return Boolean(normalized && !["standard", "none", "no"].includes(normalized));
}

export function buildCrateViewModels(records) {
  return records.map((record) => ({
    name: text(record.name),
    area: text(record.area ?? record.stage),
    requirement: text(record.unlockRequirement ?? record.requirement),
    cost: text(record.cost),
    possibleToys: text(record.possibleToys ?? record.toyIds),
    event: text(record.event ?? record.eventName),
    ...latestEvidence(record),
  }));
}

export function buildToyViewModels(records, crates) {
  const crateNames = new Map(crates.map((crate) => [crate.slug, crate.name ?? crate.slug]));
  return records.map((record) => ({
    name: text(record.name),
    rarity: text(record.rarity),
    sourceCrates: text((record.sourceCrateIds ?? []).map((id) => crateNames.get(id) ?? id)),
    cashValue: text(record.cashValue),
    interaction: text(record.interaction ?? record.interactionType),
    event: text(record.event ?? record.eventName),
    indexNumber: text(record.indexNumber ?? record.index),
    ...latestEvidence(record),
  }));
}

export function buildRebirthViewModels(records) {
  return records.map((record) => ({
    name: text(record.name ?? record.label ?? record.slug),
    requirement: text(record.requirement),
    resets: text(record.resets),
    keeps: text(record.keeps),
    reward: text(record.reward),
    unlock: text(record.unlock),
    version: text(record.event ?? record.eventName ?? record.gameVersion),
    ...latestEvidence(record),
  }));
}

export function buildWorkerViewModels(records) {
  return records.map((record) => ({
    source: text(record.source),
    unlock: text(record.unlock ?? record.unlockRequirement),
    cost: text(record.cost),
    slot: text(record.slot ?? record.slotRequirement),
    task: text(record.task),
    offlineBehavior: text(record.offlineBehavior),
    knownFix: text(record.knownFix),
    ...latestEvidence(record),
  }));
}

export function buildGamepassViewModels(records) {
  return records.map((record) => ({
    name: text(record.name),
    price: record.priceRobux === undefined ? null : `${record.priceRobux} Robux`,
    effect: text(record.effect),
    bestFor: text(record.bestFor),
    gameStage: stageLabels[record.gameStage] ?? text(record.gameStage),
    verdict: text(record.verdict),
    ...latestEvidence(record),
  }));
}

export function buildCollectionFilterRows({ crates, toys }) {
  const crateNames = new Map(crates.map((crate) => [crate.slug, crate.name ?? crate.slug]));
  return [
    ...crates.map((crate) => ({
      type: "crate",
      name: crate.name ?? crate.slug,
      crate: crate.name ?? crate.slug,
      rarity: undefined,
      eventLimited: isEventLimited(crate.event ?? crate.eventName),
    })),
    ...toys.map((toy) => ({
      type: "toy",
      name: toy.name ?? toy.slug,
      crate: (toy.sourceCrateIds ?? []).map((id) => crateNames.get(id) ?? id).join(", ") || undefined,
      rarity: toy.rarity,
      eventLimited: isEventLimited(toy.event ?? toy.eventName),
    })),
  ];
}
