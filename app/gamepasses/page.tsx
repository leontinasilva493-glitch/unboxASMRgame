import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { DataTable } from "@/components/DataTable";
import { InlineCallout, PageIntro, RelatedLinks, SourceList } from "@/components/PageParts";
import { MissingValue, VerificationBadge } from "@/components/Verification";
import { buildGamepassViewModels } from "@/lib/content-view-models.mjs";
import { gamepasses } from "@/lib/data";
import { pageMetadata, ROBLOX_URL } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Unbox ASMR Gamepasses Guide — All 7 Prices (August 2026)",
  description: "All seven dated Unbox ASMR Gamepass price snapshots for Roblox, with effects and value verdicts withheld until in-game verification.",
  path: "/gamepasses/",
});

function show(value: string | null): ReactNode {
  return value ?? <MissingValue/>;
}

export default function Gamepasses() {
  const models = buildGamepassViewModels(gamepasses);
  const rows = models.map((pass) => [
    show(pass.name),
    <span className="numeric" key="price">{show(pass.price)}</span>,
    show(pass.effect),
    show(pass.bestFor),
    show(pass.gameStage),
    show(pass.verdict),
    <VerificationBadge key="badge" status={pass.evidenceStatus}/>,
    show(pass.verifiedAt),
  ]);

  return <div className="container page-shell">
    <Breadcrumbs items={[{ label: "Gamepasses", href: "/gamepasses/" }]}/>
    <PageIntro
      eyebrow="Spend with context"
      title="Unbox ASMR Gamepasses Guide: Prices & Evidence"
      description="Seven public prices were re-checked on August 1. Their names and prices are a public snapshot; effects, limitations, player fit, and value still require current-version purchase panels and gameplay tests."
      checkedAt="2026-08-01"
    />
    <InlineCallout title="Direct answer"><p>There is not enough current in-game evidence to name a best Unbox ASMR Gamepass. Public price only: a pass name and Robux amount do not prove the exact effect, usefulness, stacking rules, or return on Robux.</p></InlineCallout>

    <section className="section-compact">
      <div className="desktop-gamepass-table"><DataTable label="Unbox ASMR Gamepass comparison" headers={["Name","Public price","Verified effect","Best for","Stage","Value verdict","Evidence","Checked"]} rows={rows}/></div>
      <div className="mobile-card-table">{models.map((pass, index) => <article className="mobile-data-card" key={gamepasses[index].slug}><h3>{show(pass.name)}</h3><dl><dt>Public price</dt><dd>{show(pass.price)}</dd><dt>Effect</dt><dd>{show(pass.effect)}</dd><dt>Best for</dt><dd>{show(pass.bestFor)}</dd><dt>Stage</dt><dd>{show(pass.gameStage)}</dd><dt>Value verdict</dt><dd>{show(pass.verdict)}</dd><dt>Evidence</dt><dd><VerificationBadge status={pass.evidenceStatus}/></dd><dt>Checked</dt><dd>{show(pass.verifiedAt)}</dd></dl></article>)}</div>
    </section>

    <section className="section-compact">
      <h2>Effect verification queue</h2>
      <p>For each pass, capture these fields before adding a recommendation:</p>
      <ol className="ordered-cards">
        <li><strong>Official purchase surface.</strong> Record the current name, price, description, seller, and destination experience.</li>
        <li><strong>In-game description.</strong> Capture the complete text and any limits, exclusions, or stacking rule.</li>
        <li><strong>Before-and-after test.</strong> Where safe, compare the same action before and after the pass without inferring from its name.</li>
        <li><strong>Player stage and alternatives.</strong> Identify whether a free action or normal upgrade solves the same problem.</li>
        <li><strong>Dated verdict.</strong> Only publish “best,” “skip,” or “worth it” after the effect and limitations are proven.</li>
      </ol>
    </section>

    <section className="split-cards">
      <article className="info-card"><h2>For free-to-play players</h2><p>You do not need a Gamepass to use this guide. Wait until the exact effect, stage fit, and limitations are visible in the current game UI.</p></article>
      <article className="info-card warm-panel"><h2>What the snapshot can prove</h2><p>It can show that seven named passes and their listed prices were present in the checked public source. It cannot prove that the name exactly describes the implemented effect.</p></article>
    </section>

    <section className="section-compact narrow">
      <h2>Price snapshot timeline</h2>
      <ol className="ordered-cards">
        <li><strong>August 1, 2026 · Public source re-check</strong> The source still listed seven passes from 11 to 499 Robux. Effects and value were not verified.</li>
        <li><strong>July 30, 2026 · Baseline created</strong> The first dated price-only snapshot was added to this guide.</li>
      </ol>
      <p className="muted">Prices and effects can change after an update. Re-check the official Roblox purchase surface before spending. This site does not sell Robux or Gamepasses.</p>
      <div style={{height:20}}/>
      <a className="button button-secondary" href={ROBLOX_URL} target="_blank" rel="noopener noreferrer" data-event="gamepass_official_click">View the official experience on Roblox ↗</a>
    </section>
    <RelatedLinks links={[{ href: "/updates/", label: "Latest update evidence" }, { href: "/beginner-guide/", label: "Beginner Guide" }, { href: "/rebirths-and-workers/", label: "Rebirths & Workers" }]}/>
    <SourceList sources={[{ label: "Rolimon’s Unbox ASMR public page", url: "https://www.rolimons.com/game/112233638491976", note: "Community-reported price source re-checked August 1, 2026; source cards reported their own older update age." }, { label: "Official Unbox ASMR Roblox experience", url: ROBLOX_URL, note: "Use Roblox as the purchase authority and re-check live before spending." }]}/>
  </div>;
}
