export const PARSER_VERSION = "1";

export function normalizeText(value) {
  if (value === null || value === undefined) return "";
  return String(value)
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((line) => line.trim().replace(/[\t ]+/g, " "))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function sortValue(value) {
  if (Array.isArray(value)) return value.map(sortValue);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(Object.keys(value).sort().map((key) => [key, sortValue(value[key])]));
}

export function stableJson(value) {
  return JSON.stringify(sortValue(value));
}

function requireObject(value, message) {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error(message);
  return value;
}

function parsePlaceUniverse(source, payload) {
  const data = requireObject(payload, "Place/Universe response must be an object");
  if (!Number.isInteger(data.universeId)) throw new Error("Place/Universe response is missing universeId");
  return {
    identity: {
      placeId: source.expectedIdentity?.placeId,
      universeId: data.universeId,
    },
    content: {},
    trends: {},
  };
}

function parseGame(source, payload) {
  const data = requireObject(payload, "Game response must be an object");
  if (!Array.isArray(data.data) || data.data.length !== 1) throw new Error("Game response must contain exactly one record");
  const game = requireObject(data.data[0], "Game record must be an object");
  const creator = requireObject(game.creator, "Game record is missing creator");
  return {
    identity: {
      universeId: game.id,
      placeId: game.rootPlaceId,
      creatorId: creator.id,
      creatorType: creator.type,
    },
    content: {
      name: normalizeText(game.name),
      description: normalizeText(game.description),
      creatorName: normalizeText(creator.name),
      updated: game.updated ? new Date(game.updated).toISOString() : null,
      canonicalUrlPath: game.canonicalUrlPath ?? null,
      maxPlayers: game.maxPlayers ?? null,
      isContentRestricted: Boolean(game.isContentRestricted),
    },
    trends: {
      playing: game.playing ?? null,
      visits: game.visits ?? null,
      favoritedCount: game.favoritedCount ?? null,
    },
  };
}

function parseGroup(_source, payload) {
  const group = requireObject(payload, "Group response must be an object");
  return {
    identity: { groupId: group.id },
    content: {
      name: normalizeText(group.name),
      description: normalizeText(group.description),
      shout: group.shout ? normalizeText(group.shout.body ?? group.shout) : null,
    },
    trends: { memberCount: group.memberCount ?? null },
  };
}

const PARSERS = {
  roblox_place_universe: parsePlaceUniverse,
  roblox_game: parseGame,
  roblox_group: parseGroup,
};

export function parseSource(source, payload) {
  const parser = PARSERS[source.parser];
  if (!parser) throw new Error(`Unsupported monitoring parser: ${source.parser}`);
  return parser(source, payload);
}
