import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { DataTable } from "@/components/DataTable";
import { EmptyVerifiedState, InlineCallout, PageIntro, RelatedLinks, SourceList } from "@/components/PageParts";
import { MissingValue, VerificationBadge } from "@/components/Verification";
import { game } from "@/lib/data";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Unbox ASMR Rebirths & Workers — Costs, Resets & Unlocks",
  description: "A safe Unbox ASMR rebirth and workers guide for Roblox that keeps resets, rewards, and offline behavior unverified until proven.",
  path: "/rebirths-and-workers/",
  noindex: true,
});

export default function RebirthsAndWorkers() {
  return <div className="container page-shell">
    <Breadcrumbs items={[{ label: "Rebirths & Workers", href: "/rebirths-and-workers/" }]}/>
    <PageIntro
      eyebrow="Progression safety"
      title="Unbox ASMR Roblox Rebirths and Workers Guide"
      description="The public worker-reward condition is now separated from delivery and behavior that require gameplay proof. Rebirth reset and reward claims remain blocked until the complete confirmation panel is captured."
      checkedAt={game.checkedAt}
    />
    <InlineCallout title="Direct answer" tone="danger"><p>Do not rebirth based on an undated guide. Read the complete in-game confirmation screen, record what resets and what remains, and cancel if any part is unclear.</p></InlineCallout>

    <section className="section-compact">
      <h2>Publicly advertised worker reward</h2>
      <VerificationBadge status="official"/>
      <p>The official Roblox experience description checked on August 1 says: “Like the game and join the group for 2 FREE workers.” This verifies the advertised condition, not successful delivery, worker slots, tasks, output, upgrade effects, or offline behavior.</p>
      <ol className="ordered-cards">
        <li><strong>Join the official ASMR Labs group.</strong> Confirm the group identity before joining.</li>
        <li><strong>Like the official experience.</strong> Use the same Roblox account that will enter the game.</li>
        <li><strong>Launch or rejoin the current server.</strong> Open the worker or reward panel and look for an explicit delivery state.</li>
        <li><strong>Capture before and after.</strong> Keep the reward label, worker count, available slots, and any message visible.</li>
      </ol>
    </section>

    <section className="summary-grid">
      <article className="summary-card"><h3>Worker not showing?</h3><p>Confirm the correct group membership, like state, server rejoin, available worker slots, and any error text. Rejoining is a test step, not a guaranteed fix.</p></article>
      <article className="summary-card warm-panel"><h3>Offline earnings?</h3><p>Not publicly verified. This guide does not claim that workers operate continuously or generate income while the player is away.</p></article>
    </section>

    <section className="section-compact">
      <h2>First rebirth safety checklist</h2>
      <ol className="ordered-cards">
        <li><strong>Open the rebirth panel without confirming.</strong> Capture the requirement and every visible reward.</li>
        <li><strong>Read the complete confirmation dialog.</strong> Record each reset item and each retained item separately.</li>
        <li><strong>Separate permanent and session effects.</strong> Do not call a temporary reward a permanent multiplier.</li>
        <li><strong>Record the current event or version.</strong> Rebirth behavior can change after an update.</li>
        <li><strong>Cancel when evidence is incomplete.</strong> A missing line is not permission to infer the result.</li>
      </ol>
    </section>

    <section className="section-compact">
      <div className="keep-reset-grid">
        <article className="info-card reset-card"><VerificationBadge status="unverified"/><h2>What you lose</h2><p><MissingValue/> — the full reset list needs a current-version confirmation screenshot.</p></article>
        <article className="info-card keep-card"><VerificationBadge status="unverified"/><h2>What you keep</h2><p><MissingValue/> — retained items and permanent progress must be shown by the game.</p></article>
      </div>
    </section>

    <section>
      <h2>Verified rebirth requirements and rewards</h2>
      <p className="muted">No current-version rebirth record is eligible for publication yet.</p>
      <div style={{height:16}}/>
      <DataTable label="Unbox ASMR rebirths" headers={["Rebirth","Requirement","Resets","Keeps","Reward","Unlock","Event / version","Verified at","Evidence"]} rows={[]}/>
      <div style={{height:16}}/>
      <EmptyVerifiedState description="Capture the rebirth panel and the complete confirmation dialog. The evidence must distinguish permanent rewards from session earnings."/>
    </section>

    <section className="section">
      <h2>Verified workers</h2>
      <p className="muted">The public reward condition is known, but worker delivery and behavior are not yet verified in-game.</p>
      <div style={{height:16}}/>
      <DataTable label="Unbox ASMR workers" headers={["Source","Unlock","Cost","Slot","Task","Offline behavior","Known fix","Verified at"]} rows={[]}/>
      <div style={{height:16}}/>
      <EmptyVerifiedState description="Record the worker panel before and after the official group reward, including available slots and what happens after a server rejoin."/>
    </section>

    <InlineCallout title="Indexing gate" tone="reported"><p>This route remains noindex until the advertised workers are verified inside the game and the first rebirth decision can be explained from a complete current-version confirmation screen.</p></InlineCallout>
    <RelatedLinks links={[{ href: "/beginner-guide/", label: "Beginner Guide" }, { href: "/crates-and-toys/", label: "Crates & Toys" }, { href: "/gamepasses/", label: "Gamepasses" }]}/>
    <SourceList sources={[{ label: "Official Unbox ASMR Roblox experience", url: game.robloxUrl, note: "Worker-reward condition checked August 1, 2026." }, { label: "Official ASMR Labs Roblox group", url: game.groupUrl, note: "Group identity checked August 1, 2026." }]}/>
  </div>;
}
