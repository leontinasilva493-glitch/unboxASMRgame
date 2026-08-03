import type { Metadata } from "next";
import Link from "next/link";
import { Hero } from "@/components/Hero";
import { HomeAnswerFinder } from "@/components/HomeAnswerFinder";
import { ArrowIcon, BoxIcon, ClockIcon, GamepadIcon, MessageIcon, QuestionIcon, ShieldIcon, SparkIcon } from "@/components/icons";
import { VerificationBadge } from "@/components/Verification";
import { EventCountdown } from "@/components/EventCountdown";
import { RelatedLinks, SourceList } from "@/components/PageParts";
import { events, gamepasses } from "@/lib/data";
import { pageMetadata, SITE_URL } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Unbox ASMR Guide — Verified Crates, Toys & Rebirth Data",
  description: "Verified Unbox ASMR guide with dated sources for Gamepasses, codes and events, plus evidence-gated crates, toys, rebirths and workers.",
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
  ["Are there active Unbox ASMR codes?", "No active code was verified in the August 1, 2026 public-source check. The official description mentions special codes but publishes no code string."],
  ["Which Unbox ASMR Gamepass is best?", "There is not enough in-game evidence for a responsible ranking yet. Public prices are shown separately from effects and value verdicts."],
  ["Why are some tables empty?", "Empty tables are intentional. Gameplay values remain unpublished until current-version screenshots or recordings prove them."],
];

export default function Home() {
  const event = events[0];
  return <>
    <Hero />
    <div className="container status-strip" aria-label="Quick status">
      <article className="status-card"><div className="status-card-head"><span>Update 3 status</span><span className="status-icon"><QuestionIcon /></span></div><strong>Implementation not verified</strong><p>Pre-update public check completed Aug 1.</p></article>
      <article className="status-card"><div className="status-card-head"><span>Next scheduled event</span><span className="status-icon"><ClockIcon /></span></div><strong>Update 3 · Aug 2</strong><p>3:00 PM ET / 12:00 PM PT</p></article>
      <article className="status-card"><div className="status-card-head"><span>Codes status</span><span className="status-icon"><MessageIcon /></span></div><strong>No active code verified</strong><p>Checked August 1, 2026</p></article>
      <article className="status-card"><div className="status-card-head"><span>Latest verification</span><span className="status-icon"><ShieldIcon /></span></div><strong>Official public listing</strong><p>Checked August 1, 2026</p></article>
    </div>

    <HomeAnswerFinder />

    <section className="section-compact"><div className="container evidence-overview"><div><span className="section-kicker">Use the guide safely</span><h2>How to use this Unbox ASMR Roblox guide</h2></div><div className="evidence-overview-copy"><p>Start with the answer finder when you have an immediate question. Each answer tells you what the current evidence supports, what remains unknown, and which detailed page has the underlying table or checklist. You can make a safer next decision on the homepage without opening six tabs or treating an unfinished dataset as a complete wiki.</p><p><strong>Official</strong> means the fact appears on the Roblox experience page or another ASMR Labs surface. <strong>Community reported</strong> means a dated public source is useful for context but still needs confirmation. <strong>Unverified</strong> means the site will not publish a value, ranking, route, or recommendation as fact. These labels matter because Unbox ASMR can change after an update while copied guides keep presenting old information without a date.</p><p>The site also separates a public price from a proven effect. A Gamepass name can suggest what it does, yet that name alone does not establish the exact multiplier, duration, stacking rule, or return on Robux. The same rule applies to crate rarity, toy value, worker behavior, and rebirth rewards: a confident answer requires a current screenshot, recording, official statement, or reproducible in-game result.</p></div></div></section>

    <section className="section"><div className="container"><div className="section-head"><div><span className="section-kicker">Detailed player guides</span><h2>Choose your next Unbox ASMR check</h2></div><p>Use these focused pages when you need the full evidence notes, dated tables, or a step-by-step capture checklist behind the homepage answer.</p></div><div className="card-grid">{guides.map(({ href, title, text, icon: Icon }) => <Link key={href} href={href} className="guide-card" data-event="guide_card_click"><span className="card-icon"><Icon /></span><h3>{title}</h3><p>{text}</p><ArrowIcon className="card-arrow" /></Link>)}</div></div></section>

    <section className="section warm-panel"><div className="container"><div className="section-head"><div><span className="section-kicker">Beginner route</span><h2>Your first four checks</h2></div><Link className="text-link" href="/beginner-guide/">Open the full guide <ArrowIcon /></Link></div><div className="step-grid"><article className="step-card"><h3>Find the first crate flow</h3><p>Follow the in-game prompts and record the exact label before publishing instructions.</p></article><article className="step-card"><h3>Open and place a toy</h3><p>Confirm the toy name, rarity, interaction, and earnings from the current UI.</p></article><article className="step-card"><h3>Locate the sell point</h3><p>Capture the frog NPC location and the complete sell interaction.</p></article><article className="step-card"><h3>Check worker rewards</h3><p>Verify the group reward panel before claiming any “two free workers” instruction.</p></article></div></div></section>

    <section className="section"><div className="container"><div className="summary-grid"><article className="summary-card"><VerificationBadge status="unverified"/><h3>Crates & Toys data room</h3><p>The tables and filters are ready, but costs, odds, rarity, and earnings remain gated until current-version proof is available.</p><Link className="text-link" href="/crates-and-toys/">See the evidence requirements <ArrowIcon /></Link></article><article className="summary-card warm-panel"><VerificationBadge status="community_reported"/><h3>{gamepasses.length} public Gamepass prices</h3><p>A dated Rolimon’s snapshot is available. Effects, player fit, and value verdicts are deliberately not inferred from price.</p><Link className="text-link" href="/gamepasses/">Compare the snapshot <ArrowIcon /></Link></article></div></div></section>

    <section className="section-compact"><div className="container"><div className="event-banner"><div className="event-banner-copy"><span className="eyebrow">Next reported event</span><h2>{event.name}</h2><p>The schedule is community-reported and must be re-checked against official channels before publication. No feature list is being guessed.</p><Link className="text-link" href="/updates/">Open update details <ArrowIcon /></Link></div><EventCountdown startsAt={event.startsAt} endsAt={event.endsAt} initialStatus={event.publishedStatus}/></div></div></section>

    <section className="section"><div className="container narrow"><div className="section-head"><div><span className="section-kicker">Clear answers</span><h2>Frequently asked questions</h2></div></div><div className="faq-list">{faqs.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div><SourceList sources={[{ label: "Official Unbox ASMR Roblox experience", url: "https://www.roblox.com/games/112233638491976/Unbox-ASMR", note: "Official public description checked August 1, 2026." }, { label: "Rolimon’s public game snapshot", url: "https://www.rolimons.com/game/112233638491976", note: "Third-party price and popularity source; re-checked August 1, 2026." }]} /><RelatedLinks links={[{ href: "/sources/", label: "Evidence policy" }, { href: "/about/", label: "About this guide" }]} /></div></section>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "WebPage", name: "Unbox ASMR Roblox Guide & Verified Data Tracker", url: SITE_URL }) }} />
  </>;
}
