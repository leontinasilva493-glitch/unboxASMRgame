function getPath(value, dottedPath) {
  return dottedPath.split(".").reduce((current, key) => current?.[key], value);
}

function topicFromPath(dottedPath) {
  return dottedPath.split(".").at(-1);
}

function change(source, topic, kind, before, after, extra = {}) {
  return {
    sourceId: source.id,
    sourceTier: source.tier,
    topic,
    kind,
    issueKey: `${source.id}:${topic}`,
    before,
    after,
    affectedRoutes: source.affectedRoutes ?? [],
    ...extra,
  };
}

function contentKind(source) {
  return source.tier === "A" ? "content" : "investigation";
}

function identityChanges(source, current) {
  const changes = [];
  const actual = current?.lastSuccess?.normalized?.identity ?? {};
  for (const [key, expected] of Object.entries(source.expectedIdentity ?? {})) {
    if (expected !== undefined && actual[key] !== expected) {
      changes.push(change(source, `identity-${key}`, "health", expected, actual[key], { severity: "critical" }));
    }
  }
  return changes;
}

export function compareSnapshot(source, previous, current) {
  const changes = [];
  const previousFailures = previous?.consecutiveFailures ?? 0;
  if ((current?.consecutiveFailures ?? 0) >= 3 && previousFailures < 3) {
    changes.push(change(source, "collection-failure", "health", previousFailures, current.consecutiveFailures, {
      error: current.lastError,
      severity: "high",
    }));
  }

  if (!current?.lastSuccess) return changes;
  changes.push(...identityChanges(source, current));
  if (!previous?.lastSuccess) return changes;

  const beforeData = previous.lastSuccess.normalized;
  const afterData = current.lastSuccess.normalized;
  for (const field of source.contentFields ?? []) {
    const before = getPath(beforeData, field);
    const after = getPath(afterData, field);
    if (!Object.is(before, after)) {
      changes.push(change(source, topicFromPath(field), contentKind(source), before, after, { field }));
    }
  }

  for (const field of source.trendFields ?? []) {
    const before = getPath(beforeData, field);
    const after = getPath(afterData, field);
    if (Object.is(before, after)) continue;
    const topic = topicFromPath(field);
    if (["visits", "favoritedCount"].includes(topic) && Number.isFinite(before) && Number.isFinite(after) && before > 0 && after < before * 0.99) {
      changes.push(change(source, `${topic}-regression`, "health", before, after, { field, severity: "high" }));
    } else {
      changes.push(change(source, topic, "trend", before, after, { field }));
    }
  }

  const previousZeros = previous.health?.zeroPlayingStreak ?? 0;
  const currentZeros = current.health?.zeroPlayingStreak ?? 0;
  if (currentZeros >= 3 && previousZeros < 3) {
    changes.push(change(source, "playing-zero", "health", previousZeros, currentZeros, { severity: "high" }));
  }

  return changes;
}
