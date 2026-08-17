import type { Metadata } from "next";
import Link from "next/link";
import { Hero } from "@/components/Hero";
import { HomeAnswerFinder } from "@/components/HomeAnswerFinder";
import { ArrowIcon, BoxIcon, ClockIcon, GamepadIcon, MessageIcon, QuestionIcon, ShieldIcon, SparkIcon } from "@/components/icons";
import { VerificationBadge } from "@/components/Verification";
import { EventCountdown } from "@/components/EventCountdown";
import { RelatedLinks, SourceList } from "@/components/PageParts";
import { codeAudit, crates, events, game, gamepasses, toys } from "@/lib/data";
import { formatDate, pageMetadata, SITE_URL } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Unbox ASMR Guide — Verified Crates, Toys & Rebirth Data",
  description: "Verified Unbox ASMR guide with dated sources for Gamepasses, codes and events, plus evidence-gated crates, toys, rebirths and workers.",
  path: "/",
});

const guides = [
  { href: "/wiki/", title: "Open the Unbox ASMR Wiki", text: "Use one hub for verified quick facts, current coverage, and every focused player guide.", icon: QuestionIcon },
  { href: "/beginner-guide/", title: "Start your first loop", text: "Learn what to verify before you buy, open, place, and sell your first toy.", icon: GamepadIcon },
  { href: "/roblox-index/", title: "Browse the Roblox Index", text: "Review the evidence-ready crate and toy tables without invented odds or cash values.", icon: BoxIcon },
  { href: "/rebirths-and-workers/", title: "Prepare for a rebirth", text: "Check what resets, what stays, and how workers behave—only after proof.", icon: ClockIcon },
  { href: "/gamepasses/", title: "Check Gamepass prices", text: "See the dated public price snapshot and why price alone is not a verdict.", icon: ShieldIcon },
  { href: "/updates/", title: "Find the next event time", text: "Convert the published ET/PT schedule to your own local time.", icon: SparkIcon },
  { href: "/codes/", title: "Check Unbox ASMR Roblox codes", text: "See the verified status and why community reports wait for an in-game result.", icon: MessageIcon },
];

const faqs = [
  ["Is this the official Unbox ASMR wiki?", "No. This is an independent fan-made guide and is not affiliated with Roblox or ASMR Labs."],
  ["Are there active Unbox ASMR codes?", `No active code was verified in the ${formatDate(codeAudit.checkedAt)} public-source check. The official description mentions special codes but publishes no code string.`],
  ["Which Unbox ASMR Gamepass is best?", "There is not enough in-game evidence for a responsible ranking yet. Public prices are shown separately from effects and value verdicts."],
  ["Why are some tables empty?", "Empty tables are intentional. Gameplay values remain unpublished until current-version screenshots or recordings prove them."],
];

const relatedGameGroups = [
  {
    title: "Plan the journey",
    links: [
      { href: "https://bigwalkwalkthrough.com/beginner-guide", label: "First-session tips" },
      { href: "https://bigwalkwalkthrough.com/walkthrough", label: "Big Walk routes" },
      { href: "https://bigwalkwalkthrough.com/multiplayer", label: "Big Walk crossplay" },
      { href: "https://bigwalkwalkthrough.com/multiplayer/how-to-find-players", label: "Find Big Walk players" },
    ],
  },
  {
    title: "Solve and complete",
    links: [
      { href: "https://bigwalkwalkthrough.com/puzzles", label: "Big Walk puzzle guide" },
      { href: "https://bigwalkwalkthrough.com/puzzles/purple-challenges", label: "All 7 purple challenges" },
      { href: "https://bigwalkwalkthrough.com/achievements", label: "Big Walk trophy guide" },
    ],
  },
] as const;

export default function Home() {
  const event = events[0];
  return <>
    <Hero />
    <div className="container status-strip" aria-label="Quick status">
      <article className="status-card"><div className="status-card-head"><span>Official listing</span><span className="status-icon"><QuestionIcon /></span></div><strong>Broad description unchanged</strong><p>Checked {formatDate(game.checkedAt)}</p></article>
      <article className="status-card"><div className="status-card-head"><span>Reported event archive</span><span className="status-icon"><ClockIcon /></span></div><strong>Update 3 window ended</strong><p>Reported end: Aug 9</p></article>
      <article className="status-card"><div className="status-card-head"><span>Codes status</span><span className="status-icon"><MessageIcon /></span></div><strong>No active code verified</strong><p>Checked {formatDate(codeAudit.checkedAt)}</p></article>
      <article className="status-card"><div className="status-card-head"><span>Public record updated</span><span className="status-icon"><ShieldIcon /></span></div><strong>{formatDate(game.officialUpdatedAt, "short")}</strong><p>Timestamp is not gameplay proof</p></article>
    </div>

    <HomeAnswerFinder />

    <section className="section-compact"><div className="container evidence-overview"><div><span className="section-kicker">Use the guide safely</span><h2>How to use this Unbox ASMR Roblox guide</h2></div><div className="evidence-overview-copy"><p>Start with the answer finder when you have an immediate question. Each answer tells you what the current evidence supports, what remains unknown, and which detailed page has the underlying table or checklist. You can make a safer next decision on the homepage without opening six tabs or treating an unfinished dataset as a complete wiki.</p><p><strong>Official</strong> means the fact appears on the Roblox experience page or another ASMR Labs surface. <strong>Community reported</strong> means a dated public source is useful for context but still needs confirmation. <strong>Unverified</strong> means the site will not publish a value, ranking, route, or recommendation as fact. These labels matter because Unbox ASMR can change after an update while copied guides keep presenting old information without a date.</p><p>The site also separates a public price from a proven effect. A Gamepass name can suggest what it does, yet that name alone does not establish the exact multiplier, duration, stacking rule, or return on Robux. The same rule applies to crate rarity, toy value, worker behavior, and rebirth rewards: a confident answer requires a current screenshot, recording, official statement, or reproducible in-game result.</p></div></div></section>

    <section className="section"><div className="container"><div className="section-head"><div><span className="section-kicker">Detailed player guides</span><h2>Choose your next Unbox ASMR Roblox guide</h2></div><p>Use these focused pages when you need the full evidence notes, dated tables, or a step-by-step capture checklist behind the homepage answer.</p></div><div className="card-grid">{guides.map(({ href, title, text, icon: Icon }) => <Link key={href} href={href} className="guide-card" data-event="guide_card_click"><span className="card-icon"><Icon /></span><h3>{title}</h3><p>{text}</p><ArrowIcon className="card-arrow" /></Link>)}</div></div></section>

    <section className="section warm-panel"><div className="container"><div className="section-head"><div><span className="section-kicker">Beginner route</span><h2>Your first four checks</h2></div><Link className="text-link" href="/beginner-guide/">Open the full guide <ArrowIcon /></Link></div><div className="step-grid"><article className="step-card"><h3>Find the first crate flow</h3><p>Follow the in-game prompts and record the exact label before publishing instructions.</p></article><article className="step-card"><h3>Open and place a toy</h3><p>Confirm the toy name, rarity, interaction, and earnings from the current UI.</p></article><article className="step-card"><h3>Locate the sell point</h3><p>Capture the frog NPC location and the complete sell interaction.</p></article><article className="step-card"><h3>Check worker rewards</h3><p>Verify the group reward panel before claiming any “two free workers” instruction.</p></article></div></div></section>

    <section className="section"><div className="container"><div className="summary-grid"><article className="summary-card"><VerificationBadge status="community_reported"/><h3>Roblox Index evidence room</h3><p>The dated gameplay snapshot now covers {crates.length} crates, {toys.length} toys, and five observed crate-to-toy results. It remains noindex because current-version original captures, full drop pools, unlock conditions, and stable Complete Index fields are incomplete.</p><Link className="text-link" href="/roblox-index/">Review crate-to-toy evidence <ArrowIcon /></Link></article><article className="summary-card warm-panel"><VerificationBadge status="community_reported"/><h3>{gamepasses.length} public Gamepass prices</h3><p>A dated Rolimon’s snapshot is available. Effects, player fit, and value verdicts are deliberately not inferred from price.</p><Link className="text-link" href="/gamepasses/">Compare the snapshot <ArrowIcon /></Link></article></div></div></section>

    <section className="section-compact"><div className="container"><div className="event-banner"><div className="event-banner-copy"><span className="eyebrow">Reported event archive</span><h2>{event.name}</h2><p>The community-reported window ended August 9. The August 11 official listing check still does not publish a numbered update or feature list, so gameplay changes remain unverified.</p><Link className="text-link" href="/updates/">Open update evidence <ArrowIcon /></Link></div><EventCountdown startsAt={event.startsAt} endsAt={event.endsAt} initialStatus={event.publishedStatus}/></div></div></section>

    <section className="section related-game-section" aria-label="Related game recommendation"><div className="container"><div className="section-head"><div><span className="section-kicker">Beyond the box</span><h2>Try another game that rewards curiosity</h2></div><p>When you want a different kind of discovery, continue with a focused guide for a cooperative puzzle adventure.</p></div><article className="related-game-card"><div className="related-game-feature"><div className="related-game-mark" aria-hidden="true"><span>BW</span></div><div className="related-game-copy"><span className="eyebrow">Featured independent guide</span><h3>Big Walk Walkthrough</h3><p>Swap the collection loop for a cooperative puzzle trip. This companion organizes puzzle help, routes, multiplayer setup, achievements, and ways to find other players.</p><a className="related-game-primary" href="https://bigwalkwalkthrough.com/" target="_blank" rel="noopener">Big Walk walkthrough <ArrowIcon /></a></div></div><div className="related-game-groups">{relatedGameGroups.map((group) => <div className="related-game-group" key={group.title}><h4>{group.title}</h4><div>{group.links.map((link) => <a href={link.href} target="_blank" rel="noopener" key={link.href}>{link.label}<span aria-hidden="true">↗</span></a>)}</div></div>)}</div></article></div></section>

    <section className="section"><div className="container narrow"><div className="section-head"><div><span className="section-kicker">Clear answers</span><h2>Unbox ASMR Roblox questions</h2></div></div><div className="faq-list">{faqs.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div><SourceList sources={[{ label: "Official Unbox ASMR Roblox experience", url: game.robloxUrl, note: `Official public description and games API checked ${formatDate(game.checkedAt)}.` }, { label: "Rolimon’s public game snapshot", url: "https://www.rolimons.com/game/112233638491976", note: "Third-party price and popularity source; re-checked August 1, 2026." }]} /><RelatedLinks links={[{ href: "/sources/", label: "How this guide verifies claims" }, { href: "/about/", label: "About the Unbox ASMR guide" }]} /></div></section>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "WebPage", name: "Unbox ASMR Roblox Guide & Verified Data Tracker", url: SITE_URL }) }} />
  </>;
}
