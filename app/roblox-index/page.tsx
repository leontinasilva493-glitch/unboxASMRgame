import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CollectionFilter } from "@/components/CollectionFilter";
import { DataTable } from "@/components/DataTable";
import { InlineCallout, PageIntro, RelatedLinks, SourceList } from "@/components/PageParts";
import { EvidenceReference, MissingValue } from "@/components/Verification";
import { VideoReference } from "@/components/VideoReference";
import { buildCollectionFilterRows, buildCrateViewModels, buildEvidenceHref, buildToyViewModels } from "@/lib/content-view-models.mjs";
import { crates, game, toys } from "@/lib/data";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Unbox ASMR Roblox Index",
  description: "Evidence-gated Unbox ASMR Roblox Index for crates, toys, rarity, source crates, values, and Complete Index entries verified in the current game.",
  path: "/roblox-index/",
  noindex: true,
  absoluteTitle: true,
});

function show(value: string | null): ReactNode {
  return value ?? <MissingValue/>;
}

export default function RobloxIndex() {
  const crateModels = buildCrateViewModels(crates);
  const toyModels = buildToyViewModels(toys, crates);
  const cratesByName = new Map(crateModels.map((crate) => [crate.name, crate]));
  const relationToyModels = toyModels.filter((toy) => toy.sourceCrates);
  const relationRows: ReactNode[][] = relationToyModels.flatMap((toy) => {
    if (!toy.sourceCrates) return [];
    const crate = cratesByName.get(toy.sourceCrates);
    return [[
      show(crate?.name ?? null),
      show(crate?.cost ?? null),
      show(toy.name),
      show(toy.rarity),
      show(toy.verifiedAt),
      <a key={`${toy.name}-relation-evidence`} className="text-link" href={buildEvidenceHref(toy.evidenceUrl, toy.evidenceTimestamp) ?? "#relationship-evidence"} target="_blank" rel="noopener noreferrer">Result at {toy.evidenceTimestamp}</a>,
    ]];
  });
  const crateRows = crateModels.map((crate) => [show(crate.name), show(crate.rarity), show(crate.cost), show(crate.area), show(crate.requirement), show(crate.possibleToys), show(crate.verifiedAt), <a key={`${crate.name}-evidence`} className="text-link" href={buildEvidenceHref(crate.evidenceUrl, crate.evidenceTimestamp) ?? "#relationship-evidence"} target="_blank" rel="noopener noreferrer">Video {crate.evidenceTimestamp}</a>]);
  const toyRows = toyModels.map((toy) => [show(toy.name), show(toy.rarity), show(toy.cashValue), show(toy.interaction), show(toy.sourceCrates), show(toy.indexNumber), show(toy.verifiedAt), <a key={`${toy.name}-evidence`} className="text-link" href={buildEvidenceHref(toy.evidenceUrl, toy.evidenceTimestamp) ?? "#relationship-evidence"} target="_blank" rel="noopener noreferrer">Video {toy.evidenceTimestamp}</a>]);

  return <div className="container page-shell">
    <Breadcrumbs items={[{ label: "Wiki", href: "/wiki/" }, { label: "Roblox Index", href: "/roblox-index/" }]}/>
    <PageIntro
      eyebrow="Collection data"
      title="Unbox ASMR Roblox Index"
      description="Look up the first dated crate-to-toy results from recent Roblox gameplay, then open the exact source timestamp before spending. Unknown fields stay unknown instead of being filled with guessed values."
      checkedAt="2026-08-06"
    />
    <InlineCallout title="First community-reported snapshot" tone="reported"><p>This MVP records {crates.length} crate panels, {toys.length} toy details, and {relationRows.length} observed crate-to-toy results from gameplay uploaded July 27-August 2, 2026. There is no current-version original capture, so these rows remain community reported and this route remains noindex.</p></InlineCallout>

    <section className="status-strip" aria-label="Roblox Index coverage">
      <article className="status-card"><span>Recorded crates</span><strong>{crates.length}</strong><p>Dated panels with names and only the visible fields filled.</p></article>
      <article className="status-card"><span>Recorded toys</span><strong>{toys.length}</strong><p>Named results with rarity left blank whenever the frame does not prove it.</p></article>
      <article className="status-card"><span>Observed results</span><strong>{relationRows.length}</strong><p>Continuous openings, not claims about each crate&apos;s full drop pool.</p></article>
      <article className="status-card"><span>Complete Index</span><strong>4/64 observed</strong><p>A dated third-party panel, not a current live-game completion count.</p></article>
    </section>

    <section>
      <div className="section-head"><div><span className="section-kicker">Direct answer</span><h2>Which toy came from each crate?</h2></div><p>These are individual observed openings. A crate may contain other toys that are not yet documented here.</p></div>
      <DataTable label="Observed Unbox ASMR crate-to-toy results" headers={["Crate","Observed price","Observed result","Result rarity","Reviewed","Evidence"]} rows={relationRows}/>
    </section>

    <VideoReference
      sectionId="crate-route-video"
      videoId="xPiGrQ2t_V8"
      heading="Watch the First Crate-to-Toy Route"
      intro="This third-party new-player recording keeps several purchases and openings in one sequence. Use the listed timestamps to compare the crate panel with the displayed result; do not treat the route as a complete drop table."
      videoTitle="Unboxing the RAREST ASMR Toys in Roblox"
      channel="Nolannati"
      reviewedAt="August 6, 2026"
      compareItems={[
        "Chocolate Key at 00:17, Candy Key at 00:58, Needle/Needoo around 01:54-02:05, Honey Dipper at 01:59-02:49, and Slime at 03:06-03:39.",
        "Whether the names, displayed prices, rarity labels, and opening results still match your live server.",
      ]}
      unverifiedItems={[
        "Full drop pools, odds, unlock order, event availability, and whether any observed result is guaranteed.",
        "Spoken payout amounts that are not simultaneously visible in a readable game panel.",
      ]}
    />

    <section className="section-compact">
      <div className="summary-grid">
        <article className="summary-card warm-panel">
          <span className="section-kicker">Dated Complete Index view</span>
          <h2>Complete Index snapshot: 4/64 Found</h2>
          <p>An August 2 recording shows <strong>4/64 Found</strong>, a visible Divine Squishy Dumpling tile, and undiscovered Mythic, Divine, and Honey-labeled slots.</p>
          <p>The observed UI does not display a stable numeric item ID for each toy. This page therefore leaves “Index slot / Found evidence” blank unless a readable panel proves it.</p>
        </article>
        <EvidenceReference
          status="community_reported"
          sourceUrl="https://www.youtube.com/watch?v=lutxF0LFCPI"
          screenshot="/images/evidence/index/complete-index-4-of-64.webp"
          videoTimestamp="01:10"
          gameVersion="Third-party gameplay uploaded August 2, 2026"
          verifiedAt="2026-08-06"
          notes="This proves only what the dated frame displays. It does not prove that 64 is the current total after later updates."
        />
      </div>
    </section>

    <InlineCallout title="Conflicting Candy Key Crate prices" tone="reported"><p>A July 27 capture displays <strong>$10K</strong>, while an August 1 continuous opening displays <strong>$1.0K</strong>. Both dated observations remain visible because the difference may reflect a game update or recording context. Check the current conveyor panel before spending.</p></InlineCallout>

    <section className="section-compact"><CollectionFilter rows={buildCollectionFilterRows({ crates, toys })}/></section>
    <section>
      <h2>All recorded crates</h2>
      <p>“Possible toys” lists only an observed result; it is not a complete pool. Blank area and requirement cells still need a current-version capture.</p>
      <DataTable label="All recorded Unbox ASMR crates" headers={["Name","Rarity / label","Observed price","Area / stage","Requirement","Observed result","Reviewed","Evidence"]} rows={crateRows}/>
    </section>
    <section className="section-compact">
      <h2>Recorded toys and source crates</h2>
      <p>Spoken-only payouts are kept in evidence notes rather than published as structured values. Index fields remain blank when the game panel does not show them.</p>
      <DataTable label="Recorded Unbox ASMR toys and source crates" headers={["Name","Rarity / label","Displayed value","Interaction","Observed source crate","Index slot / Found evidence","Reviewed","Evidence"]} rows={toyRows}/>
    </section>

    <section className="section-compact" id="relationship-evidence">
      <div className="section-head"><div><span className="section-kicker">Screenshots and timestamps</span><h2>Evidence for the five observed results</h2></div><p>These representative frames show the displayed result. Open the source at its timestamp to inspect the surrounding purchase and opening sequence.</p></div>
      <div className="evidence-grid">
        {relationToyModels.map((toy) => <div key={toy.name ?? toy.evidenceScreenshot} className="evidence-item"><h3>{toy.name}</h3><EvidenceReference status={toy.evidenceStatus} sourceUrl={toy.evidenceUrl} screenshot={toy.evidenceScreenshot} videoTimestamp={toy.evidenceTimestamp} gameVersion={toy.evidenceVersion} verifiedAt={toy.verifiedAt} notes={toy.evidenceNotes}/></div>)}
      </div>
    </section>

    <section className="summary-grid">
      <article className="summary-card"><h2>What still needs live verification</h2><p>Area order, unlock conditions, full toy pools, drop odds, event state, exact Index slots, and current prices still need an original capture from the live build.</p></article>
      <article className="summary-card warm-panel"><h2>How to add the next record</h2><p>Capture the crate panel, keep the opening in one uninterrupted sequence, capture the result and Index view, then record the version and date. Missing fields stay blank.</p></article>
    </section>
    <InlineCallout title="Indexing gate" tone="reported"><p>This route remains noindex and stays out of the sitemap. The gate opens only after an original current-version capture confirms a playable crate sequence, resulting toys, source relationships, and enough Complete Index fields to answer comparison questions reliably.</p></InlineCallout>
    <RelatedLinks links={[{ href: "/wiki/", label: "Unbox ASMR Wiki" }, { href: "/beginner-guide/", label: "Beginner Guide" }, { href: "/updates/", label: "Update status" }, { href: "/rebirths-and-workers/", label: "Rebirths & Workers" }]}/>
    <SourceList sources={[
      { label: "Official Unbox ASMR Roblox experience", url: game.robloxUrl, note: "Public description checked August 6, 2026; it confirms the crate-and-toy theme but not the imported entity values." },
      { label: "Nolannati new-player opening route", url: "https://www.youtube.com/watch?v=xPiGrQ2t_V8", note: "Third-party gameplay uploaded August 1 and manually reviewed August 6, 2026; used for the five observed opening relationships." },
      { label: "CaylusBlox Chocolate Key cross-check", url: "https://www.youtube.com/watch?v=MeEcGabrpb8", note: "Third-party gameplay uploaded July 31; used only to cross-check the Chocolate Keyboard name." },
      { label: "CoralBlox2 Complete Index view", url: "https://www.youtube.com/watch?v=lutxF0LFCPI", note: "Third-party gameplay uploaded August 2; its 4/64 Found panel is a dated snapshot, not a current total." },
      { label: "VendoPlus earlier crate panels", url: "https://www.youtube.com/watch?v=UgwslmyT87o", note: "Third-party gameplay uploaded July 27; retained as an earlier dated price and crate-panel observation." },
    ]}/>
  </div>;
}
