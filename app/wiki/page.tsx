import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ArrowIcon, BoxIcon, ClockIcon, GamepadIcon, MessageIcon, ShieldIcon, SparkIcon } from "@/components/icons";
import { InlineCallout, PageIntro, RelatedLinks, SourceList } from "@/components/PageParts";
import { VerificationBadge } from "@/components/Verification";
import { codeAudit, codes, crates, game, gamepasses, toys } from "@/lib/data";
import { formatDate, pageMetadata, SITE_URL } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Unbox ASMR Wiki",
  description: "Unbox ASMR Wiki for Roblox with verified quick facts, codes status, Gamepass prices, beginner guides, the Roblox Index, updates, and dated sources.",
  path: "/wiki/",
  absoluteTitle: true,
});

const wikiSections = [
  { href: "/beginner-guide/", title: "Beginner Guide", text: "Follow a cautious first-session route and see which steps still need current-version captures.", icon: GamepadIcon },
  { href: "/roblox-index/", title: "Roblox Index", text: "Check collection coverage and the evidence-ready crate and toy tables without invented values.", icon: BoxIcon },
  { href: "/rebirths-and-workers/", title: "Rebirths & Workers", text: "Separate the official two-worker condition from unverified delivery and reset effects.", icon: ClockIcon },
  { href: "/gamepasses/", title: "Gamepasses", text: "Compare the dated public price snapshot while keeping effects and value verdicts separate.", icon: ShieldIcon },
  { href: "/codes/", title: "Codes", text: "Get the current direct answer, redemption status, and fake-code safety checks.", icon: MessageIcon },
  { href: "/updates/", title: "Updates", text: "Review the published event window and what the current evidence does not prove.", icon: SparkIcon },
];

const faqs = [
  ["Is this the official Unbox ASMR Wiki?", "No. This is an independent fan-made resource and is not affiliated with Roblox Corporation or ASMR Labs."],
  ["Does Unbox ASMR have active codes?", `No active code string was found in the official public listing rechecked on ${formatDate(codeAudit.checkedAt)}. The Codes page keeps the dated audit and verification rules.`],
  ["Where is the Unbox ASMR Roblox Index?", "Open the Roblox Index for the crate and toy collection tables. It remains outside search until the first useful current-version dataset is verified."],
  ["How do you get two free workers?", "The official listing says to like the game and join the ASMR Labs group. Delivery inside the current game build still needs an original in-game capture."],
  ["Which crate or Gamepass is best?", "The current evidence does not support a responsible ranking. Use the live game UI for changing requirements and treat the dated public Gamepass prices as prices, not proof of value."],
];

export default function Wiki() {
  return <div className="container page-shell">
    <Breadcrumbs items={[{ label: "Wiki", href: "/wiki/" }]}/>
    <PageIntro
      eyebrow="Independent player reference"
      title="Unbox ASMR Wiki"
      description="A task-based Unbox ASMR Roblox wiki with verified public facts, dated status checks, and clear links to each detailed guide. Unknown gameplay values stay unknown instead of being copied from undated lists."
      checkedAt={codeAudit.checkedAt}
    />

    <InlineCallout title="Quick answer"><p>Unbox ASMR is a Roblox collecting experience by ASMR Labs. The official listing describes unboxing ASMR toys, upgrading a collection, unlocking better crates, earning more cash with friends, and a two-worker group reward. Exact prices, drop odds, reset effects, and optimal routes require current in-game proof.</p></InlineCallout>

    <section className="section-compact">
      <div className="section-head"><div><span className="section-kicker">Verified quick facts</span><h2>What the Unbox ASMR Roblox listing confirms</h2></div><p>Official description and public games API rechecked {formatDate(game.checkedAt)}.</p></div>
      <div className="summary-grid">
        <article className="summary-card"><VerificationBadge status="official"/><h3>Game and creator</h3><p><strong>Platform:</strong> Roblox<br/><strong>Experience:</strong> Unbox ASMR<br/><strong>Creator:</strong> ASMR Labs</p></article>
        <article className="summary-card warm-panel"><VerificationBadge status="official"/><h3>Published core loop</h3><p>Unbox rare ASMR toys, upgrade the collection, enjoy relaxing sounds, and unlock better crates.</p></article>
        <article className="summary-card"><VerificationBadge status="official"/><h3>Social rewards</h3><p>The listing advertises more cash with friends and two free workers after liking the game and joining the group. Exact delivery and multipliers are not published.</p></article>
        <article className="summary-card warm-panel"><VerificationBadge status="official"/><h3>Codes notice</h3><p>The listing mentions updates and special codes but published no active code string in the {formatDate(codeAudit.checkedAt, "short")} check.</p></article>
      </div>
    </section>

    <section className="section">
      <div className="section-head"><div><span className="section-kicker">Find the right answer</span><h2>Choose your next Unbox ASMR task</h2></div><p>Each page has one job, so a first-session guide does not compete with the collection index or Codes status.</p></div>
      <div className="card-grid">{wikiSections.map(({ href, title, text, icon: Icon }) => <Link key={href} href={href} className="guide-card"><span className="card-icon"><Icon /></span><h3>{title}</h3><p>{text}</p><ArrowIcon className="card-arrow"/></Link>)}</div>
    </section>

    <section className="section-compact">
      <div className="section-head"><div><span className="section-kicker">Coverage, not claims</span><h2>Current Wiki data coverage</h2></div><p>Counts describe what is present in this site dataset, not the total content available inside the game.</p></div>
      <div className="status-strip">
        <article className="status-card"><span>Verified active codes</span><strong>{codes.length}</strong><p>Official listing rechecked {formatDate(codeAudit.checkedAt, "short")}.</p></article>
        <article className="status-card"><span>Public Gamepass prices</span><strong>{gamepasses.length}</strong><p>Price snapshot checked Aug 1.</p></article>
        <article className="status-card"><span>Reported crate panels</span><strong>{crates.length}</strong><p>Third-party frames reviewed Aug 6.</p></article>
        <article className="status-card"><span>Reported toy details</span><strong>{toys.length}</strong><p>Current-version Index proof is still needed.</p></article>
      </div>
    </section>

    <section className="section split-cards">
      <article className="info-card"><h2>Unbox ASMR codes and current rewards</h2><p>No verified active code is published in this dataset. The separately advertised two-worker condition is a group reward, not a promo code.</p><Link className="text-link" href="/codes/">Check verified and reported code status <ArrowIcon/></Link></article>
      <article className="info-card warm-panel"><h2>Unbox ASMR Roblox Index status</h2><p>The Index now transcribes a small dated third-party snapshot with screenshots and timestamps. It remains noindex because current-version original proof and collection relationships are incomplete.</p><Link className="text-link" href="/roblox-index/">Review the reported rows and evidence gate <ArrowIcon/></Link></article>
    </section>

    <section className="section-compact narrow">
      <div className="section-head"><div><span className="section-kicker">Clear answers</span><h2>Unbox ASMR Wiki FAQ</h2></div></div>
      <div className="faq-list">{faqs.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div>
    </section>

    <RelatedLinks links={[{ href: "/beginner-guide/", label: "Unbox ASMR beginner guide" }, { href: "/roblox-index/", label: "Unbox ASMR Roblox Index" }, { href: "/sources/", label: "How Wiki claims are verified" }]}/>
    <SourceList sources={[{ label: "Official Unbox ASMR Roblox experience", url: game.robloxUrl, note: `Official description and public games API rechecked ${formatDate(game.checkedAt)}.` }, { label: "Official ASMR Labs Roblox group", url: game.groupUrl, note: `Group identity and public availability rechecked ${formatDate(game.checkedAt)}.` }]}/>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "CollectionPage", name: "Unbox ASMR Wiki", url: `${SITE_URL}/wiki/`, isPartOf: { "@type": "WebSite", name: "Unbox ASMR Guide", url: SITE_URL } }) }}/>
  </div>;
}
