# Inner-page video references implementation plan

**Goal:** Add evidence-bounded, click-to-load third-party gameplay references to the three thin guide pages while keeping the homepage metadata unchanged and preserving every current noindex gate.

**Scope:**

1. Add browser-smoke assertions for deferred YouTube loading, the selected video on each route, responsive overflow, and the post-start Update 3 wording.
2. Build one reusable client component that shows a YouTube thumbnail first, loads a `youtube-nocookie.com` iframe only after user intent, identifies the channel and review date, and separates useful visual comparisons from unverified claims.
3. Place the beginner video after the five safe steps, the crates video after the capture order, and the rebirth video after the safety checklist. Keep the existing screenshot/data gates in place.
4. Correct the stale Update 3 status and add a community schedule source without turning it into evidence of implemented gameplay features.
5. Run targeted tests, lint, type checking, data validation, a production build, and desktop/mobile browser smoke checks against the fresh local build.

**Non-goals:** Homepage Title/Description changes, publishing third-party claims as verified game data, removing noindex, committing, pushing, or deploying.

**Acceptance:** The production build succeeds; each selected inner page initially contains no video iframe and loads only its approved video after a click; the surrounding copy states what can and cannot be inferred; `/updates/` reflects that the reported window began; mobile pages have no horizontal overflow.
