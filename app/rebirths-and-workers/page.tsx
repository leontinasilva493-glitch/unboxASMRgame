import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { DataTable } from "@/components/DataTable";
import { EmptyVerifiedState, InlineCallout, PageIntro, RelatedLinks, SourceList } from "@/components/PageParts";
import { MissingValue, VerificationBadge } from "@/components/Verification";
import { buildRebirthViewModels, buildWorkerViewModels } from "@/lib/content-view-models.mjs";
import { rebirths, workers } from "@/lib/data";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({ title: "Unbox ASMR Rebirths & Workers — Costs, Resets & Unlocks", description: "A safe Unbox ASMR rebirth and workers guide for Roblox that keeps resets, rewards, and offline behavior unverified until proven.", path: "/rebirths-and-workers/", noindex: true });

function show(value: string | null): ReactNode {
  return value ?? <MissingValue/>;
}

export default function RebirthsAndWorkers() {
  const rebirthModels = buildRebirthViewModels(rebirths);
  const workerModels = buildWorkerViewModels(workers);
  const rebirthRows = rebirthModels.map((rebirth) => [show(rebirth.name), show(rebirth.requirement), show(rebirth.resets), show(rebirth.keeps), show(rebirth.reward), show(rebirth.unlock), show(rebirth.version), show(rebirth.verifiedAt), <VerificationBadge key="evidence" status={rebirth.evidenceStatus}/>]);
  const workerRows = workerModels.map((worker) => [show(worker.source), show(worker.unlock), show(worker.cost), show(worker.slot), show(worker.task), show(worker.offlineBehavior), show(worker.knownFix), show(worker.verifiedAt)]);
  const firstRebirth = rebirthModels[0];

  return <div className="container page-shell">
    <Breadcrumbs items={[{ label: "Rebirths & Workers", href: "/rebirths-and-workers/" }]}/>
    <PageIntro eyebrow="Progression safety" title="Unbox ASMR Rebirths and Workers Guide" description="Rebirth decisions can erase progress. This guide will not publish a reset list, multiplier, or worker behavior until the current confirmation panels prove it."/>
    <InlineCallout title="Direct answer" tone="danger"><p>Do not rebirth based on an undated guide. Read the complete in-game confirmation screen in your current server, and cancel if the reset or retained-progress text is unclear.</p></InlineCallout>
    <section className="section-compact"><div className="keep-reset-grid">
      <article className="info-card reset-card"><VerificationBadge status={firstRebirth?.evidenceStatus ?? "unverified"}/><h2>What you lose</h2><p>{show(firstRebirth?.resets ?? null)}</p></article>
      <article className="info-card keep-card"><VerificationBadge status={firstRebirth?.evidenceStatus ?? "unverified"}/><h2>What you keep</h2><p>{show(firstRebirth?.keeps ?? null)}</p></article>
    </div></section>
    <section><h2>Rebirth requirements and rewards</h2><p className="muted">The table schema is ready for requirements, resets, retained progress, permanent rewards, new ASMR unlocks, event scope, and evidence.</p><div style={{height:16}}/><DataTable label="Unbox ASMR rebirths" headers={["Rebirth","Requirement","Resets","Keeps","Reward","Unlock","Event / version","Verified at","Evidence"]} rows={rebirthRows}/>{rebirthRows.length === 0 && <><div style={{height:16}}/><EmptyVerifiedState description="Capture the rebirth panel and the complete confirmation dialog. The evidence must distinguish permanent rewards from session earnings."/></>}</section>
    <section className="section"><h2>Workers</h2><p className="muted">Worker source, unlock condition, cost, slot requirement, task, offline behavior, and known fixes all remain evidence-gated.</p><div style={{height:16}}/><DataTable label="Unbox ASMR workers" headers={["Source","Unlock","Cost","Slot","Task","Offline behavior","Known fix","Verified at"]} rows={workerRows}/>{workerRows.length === 0 && <><div style={{height:16}}/><EmptyVerifiedState description="Record the workers panel before and after any official group reward, including available slots and what happens after a server rejoin."/></>}</section>
    <section className="summary-grid"><article className="summary-card"><h3>Worker not showing?</h3><p>Capture the reward state, slot count, server state, and any error message. A rejoin may be worth testing, but it is not presented as a confirmed fix yet.</p></article><article className="summary-card warm-panel"><h3>Offline earnings?</h3><p>Not publicly verified. This guide does not claim workers operate 24/7 or generate income while you are away.</p></article></section>
    <RelatedLinks links={[{ href: "/beginner-guide/", label: "Beginner Guide" }, { href: "/crates-and-toys/", label: "Crates & Toys" }, { href: "/gamepasses/", label: "Gamepasses" }]}/>
    <SourceList sources={[{ label: "Official Unbox ASMR Roblox experience", url: "https://www.roblox.com/games/112233638491976/Unbox-ASMR" }, { label: "Official ASMR Labs Roblox group", url: "https://www.roblox.com/communities/1110056661/ASMR-Labs" }]}/>
  </div>;
}
