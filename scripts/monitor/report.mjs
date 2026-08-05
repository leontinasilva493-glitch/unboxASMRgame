import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

function displayValue(value) {
  const rendered = typeof value === "string" ? value : JSON.stringify(value, null, 2);
  if (rendered === undefined) return "(missing)";
  return rendered.length > 2_000 ? `${rendered.slice(0, 2_000)}\n…(truncated)` : rendered;
}

function labelsFor(change) {
  const labels = [change.kind === "health" ? "monitor-health" : "monitor-change", `source-${change.sourceTier}`];
  if (change.kind === "health" && change.error?.category === "parse_error") labels.push("parser-broken");
  if (["content", "investigation"].includes(change.kind)) labels.push("needs-in-game-verification");
  else labels.push("needs-triage");
  return labels;
}

export function renderReview(source, change, checkedAt) {
  const status = ["content", "investigation"].includes(change.kind) ? "needs_in_game_verification" : "needs_triage";
  const title = `[Monitor][${source.tier}] ${source.label}: ${change.topic}`;
  const body = `<!-- monitor-key:${change.issueKey} -->

## Monitoring change

- Discovered at: ${checkedAt}
- Source tier: ${source.tier}
- Source: ${source.url}
- Topic: ${change.topic}
- Kind: ${change.kind}
- Affected routes: ${(change.affectedRoutes ?? []).join(", ") || "None"}
- Current status: ${status}

### Before

\`\`\`text
${displayValue(change.before)}
\`\`\`

### After

\`\`\`text
${displayValue(change.after)}
\`\`\`

### Evidence boundary

This monitor detected a public-source change. It does not prove prices, effects, unlock conditions, rebirth results, or code validity inside the current game version.

### Review checklist

- [ ] Capture a current-version in-game screenshot or recording when gameplay facts are affected.
- [ ] Keep the UI context that proves the value, button, requirement, or result.
- [ ] Crop usernames, chat, and unrelated personal information.
- [ ] Record verifiedAt, game version/event, source URL, and evidence status.
- [ ] Update only the affected JSON/page fields and changelog.
- [ ] Run data validation, tests, lint, typecheck, and build.
`;
  return { issueKey: change.issueKey, title, body, labels: labelsFor(change) };
}

export async function writeReviewFiles(outputDir, sourcesById, changes, checkedAt) {
  const reviewDir = path.join(outputDir, "reviews");
  await mkdir(reviewDir, { recursive: true });
  const reviews = [];
  for (const change of changes) {
    const review = renderReview(sourcesById.get(change.sourceId), change, checkedAt);
    const filePath = path.join(reviewDir, `${review.issueKey.replace(/[^a-zA-Z0-9._-]/g, "-")}.md`);
    await writeFile(filePath, review.body, "utf8");
    reviews.push({ ...review, filePath });
  }
  return reviews;
}
