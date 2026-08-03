import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CollectionFilter } from "@/components/CollectionFilter";
import { DataTable } from "@/components/DataTable";
import { EmptyVerifiedState, InlineCallout, PageIntro, RelatedLinks, SourceList } from "@/components/PageParts";
import { VerificationBadge } from "@/components/Verification";
import { game } from "@/lib/data";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Unbox ASMR Crates & Toys — Prices, Rarity & Sources",
  description: "Evidence-gated Unbox ASMR crates and toys tables for Roblox. Unverified prices, odds, rarity, and cash values are never guessed.",
  path: "/crates-and-toys/",
  noindex: true,
});

const baselineRows = [
  ["Crates", "Better crates can be unlocked", "Names, order, areas, requirements, costs, contents, displayed odds", <VerificationBadge key="crate-status" status="official"/>],
  ["Toys", "The experience advertises rare ASMR toys and collection upgrades", "Names, rarity, source crate, cash value, interaction, event status, index", <VerificationBadge key="toy-status" status="official"/>],
];

export default function CratesAndToys() {
  return <div className="container page-shell">
    <Breadcrumbs items={[{ label: "Crates & Toys", href: "/crates-and-toys/" }]}/>
    <PageIntro
      eyebrow="Collection data"
      title="Unbox ASMR Roblox Crates and Toys List"
      description="The starter schema and first-session capture route are ready. No crate or toy entity is published until the current game UI proves its exact values."
      checkedAt={game.checkedAt}
    />
    <InlineCallout title="Starter dataset status"><p>Official description confirms crates and toys, collection upgrades, and the ability to unlock better crates. It does not publish a starter crate name, price, toy pool, rarity table, cash value, or drop chance. The verified entity dataset therefore remains empty on August 1, 2026.</p></InlineCallout>

    <section className="section-compact">
      <h2>Public baseline versus gameplay data</h2>
      <div style={{height:16}}/>
      <DataTable label="Unbox ASMR starter dataset coverage" headers={["Dataset","Official public fact","Current-version capture still needed","Evidence"]} rows={baselineRows}/>
    </section>

    <section className="summary-card warm-panel">
      <h2>First-session capture order</h2>
      <ol>
        <li>Capture the first available crate panel before opening it.</li>
        <li>Keep the name, cost, currency, requirement, and displayed contents or odds in frame.</li>
        <li>Capture the resulting toy detail and Complete Index entry.</li>
        <li>Record rarity, source crate, interaction, value, event label, and index number only when visible.</li>
        <li>Repeat for the next unlocked crate; do not infer the full sequence from promotional art.</li>
      </ol>
    </section>

    <section className="section-compact"><CollectionFilter rows={[]}/></section>
    <section>
      <h2>Verified crates</h2>
      <DataTable label="Unbox ASMR crates" headers={["Name","Area / stage","Requirement","Cost","Possible toys","Event","Verified at","Evidence"]} rows={[]}/>
      <div className="spacer-small"/>
      <EmptyVerifiedState description="Capture each crate panel with its name, area, unlock requirement, cost, toy pool, and only the odds visibly displayed by the game."/>
    </section>
    <section className="section-compact">
      <h2>Verified toys</h2>
      <DataTable label="Unbox ASMR toys" headers={["Name","Rarity","Source crate","Cash value","Interaction","Event","Index","Verified at"]} rows={[]}/>
      <div className="spacer-small"/>
      <EmptyVerifiedState description="Capture the toy detail or Complete Index UI showing the exact name, rarity, source, value, interaction type, event status, and index number."/>
    </section>
    <section className="summary-grid">
      <article className="summary-card"><h3>Rarity is not earnings</h3><p>A rarity color or name will never be used to invent a value ranking. Both fields must be visible in the current game.</p></article>
      <article className="summary-card warm-panel"><h3>Promotional art is not a data table</h3><p>The official gallery shows the game theme, but dramatic cash numbers or objects in promotional images are not imported as gameplay values.</p></article>
    </section>
    <InlineCallout title="Indexing gate" tone="reported"><p>This route remains noindex until at least the first playable crate sequence and its resulting toys can be presented as a useful, current-version dataset.</p></InlineCallout>
    <RelatedLinks links={[{ href: "/beginner-guide/", label: "Beginner Guide" }, { href: "/updates/", label: "Update 3 status" }, { href: "/rebirths-and-workers/", label: "Rebirths & Workers" }]}/>
    <SourceList sources={[{ label: "Official Unbox ASMR Roblox experience", url: game.robloxUrl, note: "Public description checked August 1, 2026; no entity values were imported." }]}/>
  </div>;
}
