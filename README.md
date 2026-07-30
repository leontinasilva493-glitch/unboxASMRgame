# Unbox ASMR Guide

An English, evidence-gated fan guide for the Roblox experience **Unbox ASMR**. The site is built with Next.js App Router, TypeScript, and plain CSS; it has no database, login, CMS, or runtime third-party data requests.

## Local development

```powershell
npm install
npm run dev
```

Open <http://localhost:3000>. Production checks:

```powershell
npm test
npm run lint
npm run typecheck
npm run build
```

## Updating verified data

- Events: edit `data/events.json` with ISO 8601 timestamps including the timezone offset. Keep unconfirmed changes separate.
- Codes: edit `data/codes.json`. An active code requires `checkedAt` and evidence.
- Gamepasses: edit `data/gamepasses.json`. Do not add a verdict until the effect is verified in-game.
- Crates/toys/rebirths/workers: add only values supported by current-version evidence. Follow `DATA_NEEDED.md`.
- Run `npm run validate:data` before every build. It checks dates, duplicate slugs, evidence gates, and crate references.

Set `NEXT_PUBLIC_SITE_URL` before deployment so canonical and sitemap URLs use the production domain. `NEXT_PUBLIC_ROBLOX_GAME_URL` may override the official game CTA. Analytics is deliberately left as a privacy-safe event hook until a provider is selected.
