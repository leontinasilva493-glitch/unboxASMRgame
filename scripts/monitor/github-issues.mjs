import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptPath = fileURLToPath(import.meta.url);
const LABELS = {
  "monitor-change": { color: "7c3aed", description: "Detected public source change" },
  "monitor-health": { color: "d1242f", description: "Monitoring source or parser health problem" },
  "parser-broken": { color: "b60205", description: "Source response no longer matches its parser" },
  "source-A": { color: "1f883d", description: "A-level official or in-game source" },
  "source-B": { color: "bf8700", description: "B-level official preview source" },
  "source-C": { color: "656d76", description: "C-level investigation source" },
  "needs-in-game-verification": { color: "fbca04", description: "Current-version in-game evidence is required" },
  "needs-triage": { color: "d4c5f9", description: "Monitoring result needs human review" },
};

export async function publishIssues(summary, client, options = {}) {
  const reviews = summary?.reviews ?? [];
  if (!options.apply) return reviews.map((review) => ({ action: "would_create", issueKey: review.issueKey }));

  const results = [];
  for (const review of reviews) {
    for (const label of review.labels) await client.ensureLabel(label, LABELS[label] ?? { color: "ededed", description: "Monitoring workflow label" });
    const marker = `<!-- monitor-key:${review.issueKey} -->`;
    const existing = await client.findOpenIssue(marker);
    if (existing) {
      await client.addComment(existing.number, review.body);
      await client.setLabels(existing.number, review.labels);
      results.push({ action: "updated", issueKey: review.issueKey, number: existing.number });
    } else {
      const created = await client.createIssue({ title: review.title, body: review.body, labels: review.labels });
      results.push({ action: "created", issueKey: review.issueKey, number: created.number });
    }
  }
  return results;
}

export class GitHubIssueClient {
  constructor({ token, repository, fetchImpl = fetch }) {
    if (!token) throw new Error("GITHUB_TOKEN is required with --apply");
    const [owner, repo] = String(repository ?? "").split("/");
    if (!owner || !repo) throw new Error("GITHUB_REPOSITORY must use owner/repo format");
    this.base = `https://api.github.com/repos/${owner}/${repo}`;
    this.token = token;
    this.fetchImpl = fetchImpl;
  }

  async request(endpoint, options = {}) {
    const response = await this.fetchImpl(`${this.base}${endpoint}`, {
      ...options,
      headers: {
        accept: "application/vnd.github+json",
        authorization: `Bearer ${this.token}`,
        "x-github-api-version": "2022-11-28",
        ...options.headers,
      },
    });
    if (!response.ok) {
      const error = new Error(`GitHub API ${response.status}: ${await response.text()}`);
      error.status = response.status;
      throw error;
    }
    if (response.status === 204) return null;
    return response.json();
  }

  async ensureLabel(name, metadata) {
    try {
      await this.request(`/labels/${encodeURIComponent(name)}`);
    } catch (error) {
      if (error.status !== 404) throw error;
      await this.request("/labels", { method: "POST", body: JSON.stringify({ name, ...metadata }) });
    }
  }

  async findOpenIssue(marker) {
    const issues = await this.request("/issues?state=open&per_page=100");
    return issues.find((issue) => !issue.pull_request && issue.body?.includes(marker)) ?? null;
  }

  createIssue(input) {
    return this.request("/issues", { method: "POST", body: JSON.stringify(input) });
  }

  addComment(number, body) {
    return this.request(`/issues/${number}/comments`, { method: "POST", body: JSON.stringify({ body }) });
  }

  setLabels(number, labels) {
    return this.request(`/issues/${number}/labels`, { method: "POST", body: JSON.stringify({ labels }) });
  }
}

function parseArgs(argv) {
  const options = { apply: false };
  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] === "--summary") options.summaryPath = path.resolve(argv[++index]);
    else if (argv[index] === "--apply") options.apply = true;
    else throw new Error(`Unknown GitHub issue argument: ${argv[index]}`);
  }
  if (!options.summaryPath) throw new Error("--summary is required");
  return options;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const summary = JSON.parse(await readFile(options.summaryPath, "utf8"));
  const client = options.apply ? new GitHubIssueClient({ token: process.env.GITHUB_TOKEN, repository: process.env.GITHUB_REPOSITORY }) : null;
  console.log(JSON.stringify(await publishIssues(summary, client, options), null, 2));
}

if (process.argv[1] && path.resolve(process.argv[1]) === scriptPath) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
