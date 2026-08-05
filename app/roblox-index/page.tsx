import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CollectionFilter } from "@/components/CollectionFilter";
import { DataTable } from "@/components/DataTable";
import { EmptyVerifiedState, InlineCallout, PageIntro, RelatedLinks, SourceList } from "@/components/PageParts";
import { VerificationBadge } from "@/components/Verification";
import { VideoReference } from "@/components/VideoReference";
import { game } from "@/lib/data";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Unbox ASMR Roblox Index",
  description: "Evidence-gated Unbox ASMR Roblox Index for crates, toys, rarity, source crates, values, and Complete Index entries verified in the current game.",
  path: "/roblox-index/",
  noindex: true,
  absoluteTitle: true,
});

const baselineRows = [
  ["Crates", "Better crates can be unlocked", "Names, order, areas, requirements, costs, contents, displayed odds", <VerificationBadge key="crate-status" status="official"/>],
  ["Toys", "The experience advertises rare ASMR toys and collection upgrades", "Names, rarity, source crate, cash value, interaction, event status, Complete Index number", <VerificationBadge key="toy-status" status="official"/>],
];

export default function RobloxIndex() {
  return <div className="container page-shell">
    <Breadcrumbs items={[{ label: "Wiki", href: "/wiki/" }, { label: "Roblox Index", href: "/roblox-index/" }]}/>
    <PageIntro
      eyebrow="Collection data"
      title="Unbox ASMR Roblox Index"
      description="Track verified crates, toys, source relationships, and Complete Index entries from the current Roblox game. The schema is ready, but no entity is published until the live UI proves its exact fields."
      checkedAt={game.checkedAt}
    />
    <InlineCallout title="Index coverage"><p>The official description confirms crates, toys, collection upgrades, and better-crate unlocks. It does not publish crate names, prices, toy pools, rarity tables, cash values, drop chances, or Complete Index numbers. The verified entity count therefore remains zero until current-version captures are added.</p></InlineCallout>

    <section className="section-compact">
      <h2>Public baseline versus Complete Index data</h2>
      <div style={{height:16}}/>
      <DataTable label="Unbox ASMR Roblox Index coverage" headers={["Dataset","Official public fact","Current-version capture still needed","Evidence"]} rows={baselineRows}/>
    </section>

    <section className="summary-card warm-panel">
      <h2>How entries enter this Roblox Index</h2>
      <ol>
        <li>Capture the available crate panel before opening it.</li>
        <li>Keep its name, cost, currency, requirement, and displayed contents or odds in frame.</li>
        <li>Capture the resulting toy detail and Complete Index entry.</li>
        <li>Record rarity, source crate, interaction, value, event label, and index number only when visible.</li>
        <li>Repeat for the next unlocked crate without inferring the full sequence from promotional art.</li>
      </ol>
    </section>

    <VideoReference
      sectionId="crate-video"
      videoId="UgwslmyT87o"
      heading="How Crate Unlocks Look in Recent Gameplay"
      intro="This short third-party video shows the crate area, several crate panels, and the route to another visible crate. Use it to recognize where the interface may appear, then capture the current panel before adding any value to this Index."
      videoTitle="How to Get More Crates in Unbox ASMR Roblox"
      channel="VendoPlus"
      reviewedAt="August 3, 2026"
      compareItems={[
        "Where crate panels and their unlock prompts appear in the recorded base.",
        "Whether the current server still presents the next crate in a similar area and sequence.",
      ]}
      unverifiedItems={[
        "The full crate order, current names, prices, requirements, currencies, or drop odds.",
        "Toy pools, rarity rankings, cash values, Complete Index numbers, and whether the recorded route is optimal.",
      ]}
    />

    <section className="section-compact"><CollectionFilter rows={[]}/></section>
    <section>
      <h2>Verified crate index</h2>
      <DataTable label="Unbox ASMR crate index" headers={["Name","Area / stage","Requirement","Cost","Possible toys","Event","Verified at","Evidence"]} rows={[]}/>
      <div className="spacer-small"/>
      <EmptyVerifiedState description="Capture each crate panel with its name, area, unlock requirement, cost, toy pool, and only the odds visibly displayed by the game."/>
    </section>
    <section className="section-compact">
      <h2>Verified toy index</h2>
      <DataTable label="Unbox ASMR toy index" headers={["Name","Rarity","Source crate","Cash value","Interaction","Event","Index","Verified at"]} rows={[]}/>
      <div className="spacer-small"/>
      <EmptyVerifiedState description="Capture the toy detail or Complete Index UI showing the exact name, rarity, source, value, interaction type, event status, and index number."/>
    </section>
    <section className="summary-grid">
      <article className="summary-card"><h3>Missing entries stay visible</h3><p>A missing field remains unknown. Rarity labels, promotional art, and neighboring Index numbers are never used to fill gaps.</p></article>
      <article className="summary-card warm-panel"><h3>Rarity is not earnings</h3><p>A rarity color or name does not prove cash value or the best collection choice. Both fields need current-version evidence.</p></article>
    </section>
    <InlineCallout title="Indexing gate" tone="reported"><p>This route remains noindex until at least the first playable crate sequence and its resulting toys can be presented as a useful, searchable, current-version dataset.</p></InlineCallout>
    <RelatedLinks links={[{ href: "/wiki/", label: "Unbox ASMR Wiki" }, { href: "/beginner-guide/", label: "Beginner Guide" }, { href: "/updates/", label: "Update status" }, { href: "/rebirths-and-workers/", label: "Rebirths & Workers" }]}/>
    <SourceList sources={[{ label: "Official Unbox ASMR Roblox experience", url: game.robloxUrl, note: "Public description checked August 1, 2026; no entity values were imported." }, { label: "VendoPlus crate gameplay video", url: "https://www.youtube.com/watch?v=UgwslmyT87o", note: "Third-party gameplay manually reviewed August 3, 2026; no displayed values were imported." }]}/>
  </div>;
}
