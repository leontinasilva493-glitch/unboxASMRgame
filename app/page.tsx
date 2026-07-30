import type { Metadata } from "next";
import Link from "next/link";
import { Hero } from "@/components/Hero";
import { ArrowIcon, BoxIcon, ClockIcon, GamepadIcon, MessageIcon, QuestionIcon, ShieldIcon, SparkIcon } from "@/components/icons";
import { VerificationBadge } from "@/components/Verification";
import { EventCountdown } from "@/components/EventCountdown";
import { RelatedLinks, SourceList } from "@/components/PageParts";
import { events, gamepasses } from "@/lib/data";
import { pageMetadata, SITE_URL } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Unbox ASMR Roblox Wiki: Crates, Toys & Rebirths",
  description: "Verified Unbox ASMR Roblox guides for crates, toys, workers, rebirths, gamepasses, codes and weekly events. Checked after every update.",
  path: "/",
});

const guides = [
  { href: "/beginner-guide/", title: "Start your first loop", text: "Learn what to verify before you buy, open, place, and sell your first toy.", icon: GamepadIcon },
  { href: "/crates-and-toys/", title: "Compare crates & toys", text: "Browse the evidence-ready tables without invented odds or cash values.", icon: BoxIcon },
  { href: "/rebirths-and-workers/", title: "Prepare for a rebirth", text: "Check what resets, what stays, and how workers behave—only after proof.", icon: ClockIcon },
  { href: "/gamepasses/", title: "Check Gamepass prices", text: "See the dated public price snapshot and why price alone is not a verdict.", icon: ShieldIcon },
  { href: "/updates/", title: "Find the next event time", text: "Convert the published ET/PT schedule to your own local time.", icon: SparkIcon },
  { href: "/codes/", title: "Check real codes", text: "Get the direct answer and avoid recycled codes that have not been redeemed.", icon: MessageIcon },
];

const faqs = [
  ["Is this the official Unbox ASMR wiki?", "No. This is an independent fan-made guide and is not affiliated with Roblox or ASMR Labs."],
  ["Are there active Unbox ASMR codes?", "No active code was reliably confirmed in the July 30, 2026 evidence snapshot. The Codes page explains how a new code becomes verified."],
  ["Which Unbox ASMR Gamepass is best?", "There is not enough in-game evidence for a responsible ranking yet. Public prices are shown separately from effects and value verdicts."],
  ["Why are some tables empty?", "Empty tables are intentional. Gameplay values remain unpublished until current-version screenshots or recordings prove them."],
];

export default function Home() {
  const event = events[0];
  const faqJsonLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map(([question, answer]) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })) };
  return <>
    <Hero />
    <div className="container status-strip" aria-label="Quick status">
      <article className="status-card"><div className="status-card-head"><span>Current event</span><span className="status-icon"><QuestionIcon /></span></div><strong>In-game check pending</strong><p>Event content is not confirmed yet.</p></article>
      <article className="status-card"><div className="status-card-head"><span>Next scheduled event</span><span className="status-icon"><ClockIcon /></span></div><strong>Update 3 · Aug 2</strong><p>3:00 PM ET / 12:00 PM PT</p></article>
      <article className="status-card"><div className="status-card-head"><span>Codes status</span><span className="status-icon"><MessageIcon /></span></div><strong>No active code verified</strong><p>Checked July 30, 2026</p></article>
      <article className="status-card"><div className="status-card-head"><span>Latest verification</span><span className="status-icon"><ShieldIcon /></span></div><strong>Official game identity</strong><p>Checked July 30, 2026</p></article>
    </div>

    <section className="section"><div className="container"><div className="section-head"><div><span className="section-kicker">Player shortcuts</span><h2>What do you need help with?</h2></div><p>Start with the question you have now. Every page separates confirmed information from what still needs a gameplay check.</p></div><div className="card-grid">{guides.map(({ href, title, text, icon: Icon }) => <Link key={href} href={href} className="guide-card" data-event="guide_card_click"><span className="card-icon"><Icon /></span><h3>{title}</h3><p>{text}</p><ArrowIcon className="card-arrow" /></Link>)}</div></div></section>

    <section className="section warm-panel"><div className="container"><div className="section-head"><div><span className="section-kicker">Beginner route</span><h2>Your first four checks</h2></div><Link className="text-link" href="/beginner-guide/">Open the full guide <ArrowIcon /></Link></div><div className="step-grid"><article className="step-card"><h3>Find the first crate flow</h3><p>Follow the in-game prompts and record the exact label before publishing instructions.</p></article><article className="step-card"><h3>Open and place a toy</h3><p>Confirm the toy name, rarity, interaction, and earnings from the current UI.</p></article><article className="step-card"><h3>Locate the sell point</h3><p>Capture the frog NPC location and the complete sell interaction.</p></article><article className="step-card"><h3>Check worker rewards</h3><p>Verify the group reward panel before claiming any “two free workers” instruction.</p></article></div></div></section>

    <section className="section"><div className="container"><div className="summary-grid"><article className="summary-card"><VerificationBadge status="unverified"/><h3>Crates & Toys data room</h3><p>The tables and filters are ready, but costs, odds, rarity, and earnings remain gated until current-version proof is available.</p><Link className="text-link" href="/crates-and-toys/">See the evidence requirements <ArrowIcon /></Link></article><article className="summary-card warm-panel"><VerificationBadge status="community_reported"/><h3>{gamepasses.length} public Gamepass prices</h3><p>A dated Rolimon’s snapshot is available. Effects, player fit, and value verdicts are deliberately not inferred from price.</p><Link className="text-link" href="/gamepasses/">Compare the snapshot <ArrowIcon /></Link></article></div></div></section>

    <section className="section-compact"><div className="container"><div className="event-banner"><div className="event-banner-copy"><span className="eyebrow">Next reported event</span><h2>{event.name}</h2><p>The schedule is community-reported and must be re-checked against official channels before publication. No feature list is being guessed.</p><Link className="text-link" href="/updates/">Open update details <ArrowIcon /></Link></div><EventCountdown startsAt={event.startsAt} endsAt={event.endsAt} initialStatus={event.publishedStatus}/></div></div></section>

    <section className="section"><div className="container narrow"><div className="section-head"><div><span className="section-kicker">Clear answers</span><h2>Frequently asked questions</h2></div></div><div className="faq-list">{faqs.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div><SourceList sources={[{ label: "Official Unbox ASMR Roblox experience", url: "https://www.roblox.com/games/112233638491976/Unbox-ASMR", note: "Official identity and developer attribution." }, { label: "Rolimon’s public game snapshot", url: "https://www.rolimons.com/game/112233638491976", note: "Dated third-party snapshot; not live data." }]} /><RelatedLinks links={[{ href: "/sources/", label: "Evidence policy" }, { href: "/about/", label: "About this guide" }]} /></div></section>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "WebPage", name: "Unbox ASMR Roblox Guide & Verified Wiki", url: SITE_URL }) }} />
  </>;
}
