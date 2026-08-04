import { PARSER_VERSION, parseSource } from "./normalize.mjs";

const DEFAULT_TIMEOUT_MS = 15_000;
const DEFAULT_ATTEMPTS = 3;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function categoryForStatus(status) {
  if (status === 404) return "not_found";
  if (status === 429) return "rate_limited";
  return "http_error";
}

function shouldRetryStatus(status) {
  return status === 429 || status >= 500;
}

function failure(source, checkedAt, category, message, details = {}) {
  return {
    ok: false,
    sourceId: source.id,
    checkedAt,
    error: { category, message, ...details },
  };
}

export async function collectSource(source, options = {}) {
  const fetchImpl = options.fetchImpl ?? fetch;
  const delay = options.delay ?? sleep;
  const now = options.now ?? (() => new Date());
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const maxAttempts = options.maxAttempts ?? DEFAULT_ATTEMPTS;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const checkedAt = now().toISOString();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetchImpl(source.url, {
        headers: { accept: "application/json", "user-agent": "unbox-asmr-guide-monitor/1.0" },
        signal: controller.signal,
      });
      if (!response.ok) {
        if (attempt < maxAttempts && shouldRetryStatus(response.status)) {
          await delay(250 * (2 ** (attempt - 1)));
          continue;
        }
        return failure(source, checkedAt, categoryForStatus(response.status), `HTTP ${response.status}`, { status: response.status, attempts: attempt });
      }

      const raw = await response.json();
      try {
        return {
          ok: true,
          sourceId: source.id,
          checkedAt,
          parserVersion: PARSER_VERSION,
          raw,
          normalized: parseSource(source, raw),
          attempts: attempt,
        };
      } catch (error) {
        return failure(source, checkedAt, "parse_error", error.message, { attempts: attempt });
      }
    } catch (error) {
      const category = error?.name === "AbortError" ? "timeout" : "network";
      if (attempt < maxAttempts) {
        await delay(250 * (2 ** (attempt - 1)));
        continue;
      }
      return failure(source, checkedAt, category, error?.message ?? String(error), { attempts: attempt });
    } finally {
      clearTimeout(timeout);
    }
  }

  throw new Error("Collector exhausted attempts without a result");
}
