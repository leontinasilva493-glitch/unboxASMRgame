import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ArrowIcon } from "@/components/icons";
import { InlineCallout, PageIntro, RelatedLinks, SourceList, TableOfContents } from "@/components/PageParts";
import { VideoReference } from "@/components/VideoReference";
import { VerificationBadge } from "@/components/Verification";
import { game } from "@/lib/data";
import { formatDate, pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Unbox ASMR Beginner Guide for Roblox",
  description: "A cautious beginner path for Unbox ASMR on Roblox, separating official starting facts from gameplay steps that still need current-version captures.",
  path: "/beginner-guide/",
  noindex: true,
});

const toc = [
  { href: "#quick-index", label: "Quick guide index" },
  { href: "#official-baseline", label: "Official baseline" },
  { href: "#first-steps", label: "First five steps" },
  { href: "#beginner-video", label: "Gameplay reference" },
  { href: "#more-crates", label: "More crates" },
  { href: "#frog-npc", label: "Frog NPC" },
  { href: "#free-workers", label: "Free workers" },
  { href: "#troubleshooting", label: "Troubleshooting" },
];

export default function BeginnerGuide() {
  return <div className="container page-shell">
    <Breadcrumbs items={[{ label: "Beginner Guide", href: "/beginner-guide/" }]}/>
    <PageIntro
      eyebrow="Start here"
      title="Unbox ASMR Roblox Beginner Guide"
      description="A safe first-session route built from the current official Roblox listing. Exact buttons, values, selling steps, and reward delivery remain gated until original gameplay captures are available."
      checkedAt={game.checkedAt}
    />
    <div className="content-layout">
      <article className="prose">
        <InlineCallout title="30-second answer">
          <p>Open the official experience, read the onboarding shown in your server, complete one crate-to-toy loop, and check the next visible unlock before spending. The official listing confirms toys, collection upgrades, better crates, a friend cash benefit, and a two-worker group reward; it does not publish the exact in-game steps or values.</p>
        </InlineCallout>

        <section id="quick-index">
          <h2>Quick guide index</h2>
          <p>Choose the page that matches the decision in front of you. Verification status stays visible, so this index does not turn incomplete gameplay evidence into a complete wiki.</p>
          <div className="summary-grid">
            <article className="summary-card"><h3>Codes and rewards</h3><p>See verified active, reported, and unverified redemption states.</p><Link className="text-link" href="/codes/">Check codes <ArrowIcon /></Link></article>
            <article className="summary-card warm-panel"><h3>Crates, toys, and the Roblox Index</h3><p>Review dated opening results, conflicts, and missing current-version fields.</p><Link className="text-link" href="/roblox-index/">Open the Index <ArrowIcon /></Link></article>
            <article className="summary-card warm-panel"><h3>Gamepass prices</h3><p>Compare seven dated public prices without treating a pass name as a proven effect.</p><Link className="text-link" href="/gamepasses/">Compare prices <ArrowIcon /></Link></article>
            <article className="summary-card"><h3>Rebirths and workers</h3><p>Read the recorded first-rebirth panel and the still-unverified worker delivery path.</p><Link className="text-link" href="/rebirths-and-workers/">Review reset evidence <ArrowIcon /></Link></article>
            <article className="summary-card"><h3>Latest updates and weather evidence</h3><p>Check the latest official listing timestamp, archived event timing, and what a weather guide still needs to prove.</p><Link className="text-link" href="/updates/">Open update evidence <ArrowIcon /></Link></article>
          </div>
        </section>

        <h2 id="official-baseline">Official Roblox listing: what it confirms</h2>
        <VerificationBadge status="official"/>
        <p>The official Roblox listing was checked on {formatDate(game.checkedAt)}. It publicly describes these starting facts:</p>
        <ul>
          {game.officialClaims.coreLoop.map((claim) => <li key={claim}>{claim}.</li>)}
          <li>{game.officialClaims.friendBenefit}.</li>
          <li>{game.officialClaims.workerReward}.</li>
          <li>{game.officialClaims.codesNotice}.</li>
        </ul>
        <p className="muted">These are public description claims, not proof of exact multipliers, button labels, crate prices, worker delivery, or code redemption behavior.</p>

        <h2 id="first-steps">Your first five safe steps</h2>
        <ol className="ordered-cards">
          <li><strong>Use the official experience link.</strong> Confirm the creator is ASMR Labs before joining a server.</li>
          <li><strong>Read the current onboarding.</strong> Follow the labels visible in your server; this guide does not invent a button name.</li>
          <li><strong>Complete one visible crate-to-toy loop.</strong> Record the crate name, cost, resulting toy, rarity label, and any interaction the UI actually shows.</li>
          <li><strong>Check the next unlock before spending again.</strong> Compare your current balance with the displayed requirement instead of following an undated upgrade order.</li>
          <li><strong>Delay irreversible choices.</strong> Do not rebirth or buy a Gamepass until the current confirmation or purchase panel explains the result.</li>
        </ol>
        <VideoReference
          sectionId="beginner-video"
          videoId="7JfyM_GSipY"
          heading="Recent Unbox ASMR Roblox Beginner Gameplay"
          headingLevel="h3"
          intro="This third-party walkthrough shows a recent starter area, early collection, upgrade prompts, and worker placement. Use it to recognize the general flow after completing the five safe checks above; labels and requirements in your current server remain the authority."
          videoTitle="BEGINNER GUIDE in Unbox ASMR Roblox - Fast Money, Rebirth, Workers and Best Progression Tips"
          channel="Roblox Guides"
          reviewedAt="August 3, 2026"
          compareItems={[
            "The starter-area HUD, first crate-to-toy loop, and where early upgrade prompts appear.",
            "How a worker is placed on a toy and how the recorded account moves into later crates.",
          ]}
          unverifiedItems={[
            "Current prices, earnings, fastest route, or any claim that an upgrade is best.",
            "The frog selling route, worker reward delivery, and exact rebirth reset effects.",
          ]}
        />
        <div className="screenshot-slot"><div><strong>Gameplay capture still required</strong><span>Spawn/HUD, onboarding, and the first complete crate-to-toy loop</span></div></div>

        <h2 id="more-crates">How to get more crates</h2>
        <VerificationBadge status="unverified"/>
        <p>The official description confirms that better crates can be unlocked, but it does not publish the unlock sequence, costs, currencies, or contents. Use the requirement displayed on the next locked crate and keep the exact panel in frame when capturing evidence.</p>

        <h2 id="frog-npc">How to sell to the frog NPC</h2>
        <VerificationBadge status="unverified"/>
        <p>The frog NPC location and sell interaction are not present in the official public description and have not been captured in the current game version. Do not follow a copied route until the NPC, approach path, prompt, and sell result can be shown together.</p>
        <figure className="guide-illustration">
          <Image
            src="/images/guides/frog-npc-toy-sale-illustration.webp"
            alt="Concept illustration of a player offering a toy to a friendly frog merchant in exchange for coins"
            width={1672}
            height={941}
            sizes="(max-width: 900px) 100vw, 900px"
          />
          <figcaption><strong>Concept illustration.</strong> This is not an in-game screenshot and does not verify the NPC location, approach route, interaction prompt, or sale result.</figcaption>
        </figure>

        <h2 id="free-workers">How to claim the publicly advertised workers</h2>
        <VerificationBadge status="official"/>
        <p>The official Roblox listing says: “Like the game and join the group for 2 FREE workers.” The condition is official; delivery inside the current build is not yet in-game verified.</p>
        <ol className="ordered-cards">
          <li><strong>Open the official ASMR Labs group.</strong> Confirm the group name and join it while signed in to the Roblox account you use to play.</li>
          <li><strong>Return to the official experience page.</strong> Like the experience if the control is available to your account.</li>
          <li><strong>Launch or rejoin Unbox ASMR.</strong> Check the current worker or reward panel instead of assuming delivery is automatic.</li>
          <li><strong>Record the result.</strong> Capture the panel before and after the claim, available slots, and any message shown by the game.</li>
        </ol>

        <h2 id="troubleshooting">Troubleshooting without guessing</h2>
        <ul>
          <li>If a prompt differs from this guide, trust the current game UI and record the change.</li>
          <li>If workers do not appear, confirm the correct group membership, like state, server rejoin, available slots, and any error text.</li>
          <li>If an item value is missing, do not infer it from rarity or promotional art.</li>
          <li>If a rebirth prompt is unclear, cancel and capture the complete confirmation screen first.</li>
        </ul>
        <InlineCallout title="Indexing gate" tone="reported"><p>This guide remains out of search until original current-version captures prove the first loop, selling path, and worker delivery. The written route is ready for those assets but does not pretend they already exist.</p></InlineCallout>
        <RelatedLinks links={[{ href: "/wiki/", label: "Unbox ASMR Wiki" }, { href: "/roblox-index/", label: "Roblox Index" }, { href: "/rebirths-and-workers/", label: "Rebirths & Workers" }, { href: "/gamepasses/", label: "Gamepasses" }]}/>
        <SourceList sources={[{ label: "Official Unbox ASMR Roblox experience", url: game.robloxUrl, note: `Public description and games API checked ${formatDate(game.checkedAt)}.` }, { label: "Official ASMR Labs Roblox group", url: game.groupUrl, note: `Group identity and availability checked ${formatDate(game.checkedAt)}.` }, { label: "Roblox Guides beginner gameplay video", url: "https://www.youtube.com/watch?v=7JfyM_GSipY", note: "Third-party gameplay manually reviewed August 3, 2026; used only as a visual reference." }]}/>
      </article>
      <TableOfContents items={toc}/>
    </div>
  </div>;
}
