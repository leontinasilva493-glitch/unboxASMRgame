import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CollectionFilter } from "@/components/CollectionFilter";
import { DataTable } from "@/components/DataTable";
import { EmptyVerifiedState, InlineCallout, PageIntro, RelatedLinks, SourceList } from "@/components/PageParts";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Unbox ASMR Crates & Toys — Prices, Rarity & Sources",
  description: "Evidence-gated Unbox ASMR crates and toys tables for Roblox. Unverified prices, odds, rarity, and cash values are never guessed.",
  path: "/crates-and-toys/",
  noindex: true,
});

export default function CratesAndToys() {
  return <div className="container page-shell">
    <Breadcrumbs items={[{ label: "Crates & Toys", href: "/crates-and-toys/" }]}/>
    <PageIntro eyebrow="Collection data" title="Unbox ASMR Crates and Toys List" description="The data interface is ready, but the gameplay dataset is not. This page stays out of search until current-version crate and toy evidence makes it genuinely useful."/>
    <InlineCallout title="Direct answer"><p>No complete, current-version crate or toy list has been verified for this build. Costs, displayed odds, rarity, and cash values remain blank by design.</p></InlineCallout>
    <section className="section-compact"><CollectionFilter rows={[]}/></section>
    <section><h2>Crates</h2><DataTable label="Unbox ASMR crates" headers={["Name","Area / stage","Requirement","Cost","Possible toys","Event","Verified at","Evidence"]} rows={[]}/><div className="spacer-small"/><EmptyVerifiedState description="Capture each crate panel with its name, area, unlock requirement, cost, toy pool, and only the odds visibly displayed by the game."/></section>
    <section className="section-compact"><h2>Toys</h2><DataTable label="Unbox ASMR toys" headers={["Name","Rarity","Source crate","Cash value","Interaction","Event","Index","Verified at"]} rows={[]}/><div className="spacer-small"/><EmptyVerifiedState description="Capture the toy detail or Complete Index UI showing the exact name, rarity, source, value, interaction type, event status, and index number."/></section>
    <section className="summary-grid"><article className="summary-card"><h3>Rarity is not earnings</h3><p>Common, Uncommon, Rare, Epic, and Legendary labels will be displayed only when the game confirms them. A rarity color will never be used to invent a value ranking.</p></article><article className="summary-card warm-panel"><h3>Event-limited means proven</h3><p>An item only receives an event-limited label when the current event UI or an official announcement supports it.</p></article></section>
    <RelatedLinks links={[{ href: "/beginner-guide/", label: "Beginner Guide" }, { href: "/updates/", label: "Updates" }]}/>
    <SourceList sources={[{ label: "Official Unbox ASMR Roblox experience", url: "https://www.roblox.com/games/112233638491976/Unbox-ASMR", note: "The gameplay capture source; no item values were imported for this build." }]}/>
  </div>;
}
