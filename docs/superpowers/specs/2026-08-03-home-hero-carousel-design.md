# Home Hero Carousel Design

## Goal

Replace the homepage hero's evidence-placeholder panel with a three-slide editorial image carousel that communicates the game's verified public themes without presenting generated artwork as gameplay evidence.

## Approved slides

1. **Unbox rare toys** — warm 3D clay-style crate opening; links to `/beginner-guide/`.
2. **Build the collection** — isometric crate-upgrade workshop; links to `/crates-and-toys/`.
3. **Track new updates** — purple neon sealed-crate verification scene; links to `/updates/`.

The order is fixed to put the evergreen core loop first and the time-sensitive update surface last.

## Presentation

- Keep the carousel inside the existing right-hand hero column.
- Use a 4:3 frame with cover cropping and a readable bottom gradient.
- Render titles, descriptions, and links as HTML; generated images contain no text.
- Label every slide `Editorial illustration` so it cannot be mistaken for a gameplay screenshot.
- Provide previous, next, and direct slide controls with accessible labels.
- Rotate every five seconds only when motion is allowed and the carousel is not hovered or keyboard-focused.
- Pause automatic rotation when the document is hidden.
- Keep the first image eager/preloaded and later images lazy-loaded.

## Evidence boundary

The illustrations may express only the official public themes already recorded by the project: unboxing rare toys, upgrading a collection, unlocking better crates, and following updates. They must not imply specific prices, odds, item identities, code strings, Update 3 features, worker behavior, or rebirth effects.

## Responsive behavior

- Desktop: carousel fills the existing right column with a minimum height of 360px.
- Tablet/mobile: carousel moves below hero copy and preserves the 4:3 frame.
- Controls remain at least 40px square and visible against every image.

## Validation

- Browser smoke test proves all three slides render and the next control changes the visible slide.
- Browser smoke test proves each image URL responds successfully.
- Mobile and desktop screenshots are reviewed for cropping, overlay contrast, and overflow.
- Tests, lint, typecheck, and production build pass before completion is reported.
