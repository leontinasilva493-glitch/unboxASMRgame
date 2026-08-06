import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { DataTable } from "@/components/DataTable";
import { EmptyVerifiedState, InlineCallout, PageIntro, RelatedLinks, SourceList } from "@/components/PageParts";
import { EvidenceReference, MissingValue, VerificationBadge } from "@/components/Verification";
import { VideoReference } from "@/components/VideoReference";
import { buildEvidenceHref, buildRebirthViewModels, buildWorkerViewModels } from "@/lib/content-view-models.mjs";
import { game, rebirths, workers } from "@/lib/data";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Unbox ASMR Rebirths & Workers — Costs, Resets & Unlocks",
  description: "Unbox ASMR rebirth requirement, reset, keep, and reward answers from dated Roblox gameplay, followed by the official two-worker condition and evidence limits.",
  path: "/rebirths-and-workers/",
  noindex: true,
});

function show(value: string | null): ReactNode {
  return value ?? <MissingValue/>;
}

export default function RebirthsAndWorkers() {
  const rebirthModels = buildRebirthViewModels(rebirths);
  const workerModels = buildWorkerViewModels(workers);
  const firstRebirth = rebirthModels[0];
  const rebirthRows = rebirthModels.map((rebirth) => [
    show(rebirth.name), show(rebirth.requirement), show(rebirth.resets), show(rebirth.keeps), show(rebirth.reward), show(rebirth.unlock), show(rebirth.version), show(rebirth.verifiedAt),
    <a key="evidence" className="text-link" href={buildEvidenceHref(rebirth.evidenceUrl, rebirth.evidenceTimestamp) ?? "#rebirth-evidence"} target="_blank" rel="noopener noreferrer">Video {rebirth.evidenceTimestamp}</a>,
  ]);
  const workerRows = workerModels.map((worker) => [show(worker.source), show(worker.unlock), show(worker.cost), show(worker.slot), show(worker.task), show(worker.offlineBehavior), show(worker.knownFix), show(worker.verifiedAt)]);

  return <div className="container page-shell">
    <Breadcrumbs items={[{ label: "Rebirths & Workers", href: "/rebirths-and-workers/" }]}/>
    <PageIntro
      eyebrow="Rebirth decision first"
      title="Unbox ASMR Roblox Rebirths and Workers Guide"
      description="Answer the first rebirth requirement, reset, keep, and reward questions from one dated gameplay panel before checking the separate two-worker reward. Third-party evidence is labeled and never turned into a best-time recommendation."
      checkedAt="2026-08-06"
    />
    <InlineCallout title="Evidence status" tone="reported"><p>A July 27 third-party recording contains one readable rebirth panel. It is useful enough to answer what that panel displayed, but it is not an original current-version test. Confirm the same wording in your own server before accepting an irreversible reset.</p></InlineCallout>

    <section className="section-compact">
      <div className="section-head"><div><span className="section-kicker">Four answers before you reset</span><h2>First rebirth answers from dated gameplay</h2></div><VerificationBadge status={firstRebirth?.evidenceStatus ?? "unverified"}/></div>
      <div className="summary-grid rebirth-answer-grid">
        <article className="summary-card"><h3>What does the first rebirth cost?</h3><p>The recorded panel requires <strong>{show(firstRebirth?.requirement ?? null)}</strong>.</p><p className="muted">This is a displayed requirement from the recording, not a current-server guarantee.</p></article>
        <article className="summary-card reset-card"><h3>What resets?</h3><p><strong>{show(firstRebirth?.resets ?? null)}</strong>.</p><p className="muted">The panel summarizes the reset rule; it does not itemize every affected balance or upgrade.</p></article>
        <article className="summary-card keep-card"><h3>What stays?</h3><p><strong>{show(firstRebirth?.keeps ?? null)}</strong>.</p><p className="muted">Do not assume another item survives unless the current panel names it.</p></article>
        <article className="summary-card warm-panel"><h3>What are the rewards?</h3><p><strong>{show(firstRebirth?.reward ?? null)}</strong>.</p><p className="muted">The page does not infer stacking, permanence beyond the label, or the best time to rebirth.</p></article>
      </div>
    </section>

    <section className="section-compact" id="rebirth-evidence">
      <div className="section-head"><div><span className="section-kicker">Screenshot and timestamp</span><h2>Evidence for the first rebirth panel</h2></div><p>Open the source at 00:54 to inspect the surrounding gameplay context.</p></div>
      <EvidenceReference status={firstRebirth?.evidenceStatus ?? "unverified"} sourceUrl={firstRebirth?.evidenceUrl} screenshot={firstRebirth?.evidenceScreenshot} videoTimestamp={firstRebirth?.evidenceTimestamp} gameVersion={firstRebirth?.evidenceVersion} verifiedAt={firstRebirth?.verifiedAt} notes={firstRebirth?.evidenceNotes}/>
    </section>

    <section className="section-compact">
      <h2>Community-reported rebirth record</h2>
      <p className="muted">The row transcribes only the readable panel. It remains community reported until reproduced in the current game build.</p>
      <div style={{height:16}}/>
      <DataTable label="Unbox ASMR community-reported rebirth" headers={["Rebirth","Requirement","Resets","Keeps","Reward","Unlock","Recording / version","Reviewed","Evidence"]} rows={rebirthRows}/>
    </section>

    <VideoReference
      sectionId="rebirth-video"
      videoId="FbqF-ydPuUw"
      heading="Watch the short rebirth walkthrough"
      intro="This short third-party walkthrough reaches the readable panel near 00:54. Use it to locate and compare the current rebirth screen; do not copy a reset decision from the recording without checking your own server."
      videoTitle="How to Rebirth Fast in Unbox ASMR Roblox"
      channel="VendoPlus"
      reviewedAt="August 6, 2026"
      compareItems={[
        "The displayed $75K Money and Rare Slime requirement.",
        "The +10% Money Bonus, Lightning Keyboard Rebirth ASMR, +2 Worker Slots, and reset-exception line.",
      ]}
      unverifiedItems={[
        "Whether every displayed value still matches the current game build.",
        "The best rebirth timing, reward stacking, exact inventory effects, or an optimal progression route.",
      ]}
      secondaryLink={{ label: "Long rebirth progression recording by RobloMine", url: "https://www.youtube.com/watch?v=-G26P9S5yGY" }}
    />

    <section className="section-compact">
      <h2>First rebirth safety checklist</h2>
      <ol className="ordered-cards">
        <li><strong>Open the current rebirth panel without confirming.</strong> Compare its requirement with the dated screenshot above.</li>
        <li><strong>Read the reset-exception line.</strong> Stop if the wording differs or is cut off.</li>
        <li><strong>Check every reward tile.</strong> Record the bonus, Rebirth ASMR, and worker-slot wording shown in your server.</li>
        <li><strong>Capture the current version and date.</strong> That original evidence is required before this guide can recommend a timing strategy.</li>
      </ol>
    </section>

    <section className="section" id="workers">
      <div className="section-head"><div><span className="section-kicker">Separate reward system</span><h2>Workers and the two-worker reward</h2></div><VerificationBadge status="official"/></div>
      <p>The official Roblox experience description checked August 6 says players can like the game and join the ASMR Labs group for two free workers. This verifies the advertised condition, not delivery, tasks, output, slot behavior, or offline earnings.</p>
      <ol className="ordered-cards">
        <li><strong>Join the official ASMR Labs group.</strong> Confirm the creator identity before joining.</li>
        <li><strong>Like the official experience.</strong> Use the same Roblox account that will enter the game.</li>
        <li><strong>Launch or rejoin the current server.</strong> Inspect the worker or reward panel for an explicit delivery state.</li>
        <li><strong>Capture before and after.</strong> Keep the reward label, worker count, available slots, and any error text visible.</li>
      </ol>
      <div className="summary-grid">
        <article className="summary-card"><h3>Worker not showing?</h3><p>Confirm the correct group membership, like state, server rejoin, available slots, and exact error text. Rejoining is a test step, not a guaranteed fix.</p></article>
        <article className="summary-card warm-panel"><h3>Offline earnings?</h3><p>Not publicly verified. This guide does not claim that workers operate continuously or generate income while the player is away.</p></article>
      </div>
    </section>

    <section className="section-compact">
      <h2>Verified worker behavior</h2>
      <p className="muted">The public reward condition is known, but no worker delivery or behavior record has passed an in-game evidence check.</p>
      <div style={{height:16}}/>
      <DataTable label="Unbox ASMR workers" headers={["Source","Unlock","Cost","Slot","Task","Offline behavior","Known fix","Verified at"]} rows={workerRows}/>
      {workerRows.length === 0 && <><div style={{height:16}}/><EmptyVerifiedState description="Record the worker panel before and after the official group reward, including available slots and what happens after a server rejoin."/></>}
    </section>

    <InlineCallout title="Indexing gate" tone="reported"><p>This route remains noindex and outside the sitemap. The rebirth snapshot still needs an original current-version reproduction, and advertised workers still need in-game delivery and behavior evidence.</p></InlineCallout>
    <RelatedLinks links={[{ href: "/wiki/", label: "Unbox ASMR Wiki" }, { href: "/beginner-guide/", label: "Beginner Guide" }, { href: "/roblox-index/", label: "Roblox Index" }, { href: "/gamepasses/", label: "Gamepasses" }]}/>
    <SourceList sources={[{ label: "Official Unbox ASMR Roblox experience", url: game.robloxUrl, note: "Worker-reward condition rechecked August 6, 2026." }, { label: "Official ASMR Labs Roblox group", url: game.groupUrl, note: "Group identity rechecked August 6, 2026." }, { label: "VendoPlus rebirth walkthrough", url: "https://www.youtube.com/watch?v=FbqF-ydPuUw", note: "Third-party gameplay uploaded July 27 and manually reviewed August 6, 2026; readable panel fields remain community reported." }, { label: "RobloMine rebirth progression video", url: "https://www.youtube.com/watch?v=-G26P9S5yGY", note: "Long third-party progression context; not used as proof of current reset behavior." }]}/>
  </div>;
}
