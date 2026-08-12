import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { DataTable } from "@/components/DataTable";
import { InlineCallout, PageIntro, RelatedLinks, SourceList } from "@/components/PageParts";
import { VerificationBadge } from "@/components/Verification";
import { codeAudit, game } from "@/lib/data";
import { formatDate, pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Unbox ASMR Codes (August 2026): Active, Expired & Fake Codes",
  description: "No verified active Unbox ASMR Roblox codes as of August 11, 2026. Check three reported candidates, redemption evidence, fake-code warnings, and official sources.",
  path: "/codes/",
});

const faqs = [
  ["Is there an Unbox ASMR code?", `No active code string was verified in the official public listing rechecked on ${formatDate(codeAudit.checkedAt)}. Its general mention of special codes is not a redeemable code.`],
  ["Are there any Unbox ASMR Roblox codes?", "There are no verified active Unbox ASMR Roblox codes in this dataset. Any future code must be tied to an official source or a successful current-version redemption before it enters the active table."],
  ["Are “Unboxing ASMR codes” the same game?", "Searchers sometimes type unboxing asmr codes, but this page tracks only the Roblox experience named Unbox ASMR by ASMR Labs. A code from a different unboxing or ASMR game is not valid evidence for this experience."],
  ["Where do you enter codes in Unbox ASMR?", "A current-version in-game redemption box and its location have not been verified. This page will not invent menu steps from another Roblox game."],
  ["When will new Unbox ASMR codes be released?", `No official code release schedule was found in the ${formatDate(codeAudit.checkedAt)} public-source check. Follow the official experience and ASMR Labs surfaces for announcements.`],
  ["Why is my Unbox ASMR code not working?", "Check spelling and spaces, then confirm the string appears in a dated official announcement. Recycled strings such as RELEASE, THANKS, and SORRY are not treated as valid without a successful current-version redemption."],
];

export default function Codes() {
  const reportedRows = codeAudit.reportedCandidates.map((candidate) => [
    <code key={`${candidate.code}-value`}>{candidate.code}</code>,
    <VerificationBadge key={`${candidate.code}-status`} status="community_reported"/>,
    formatDate(candidate.checkedAt),
    "Candidate only — no successful current-version redemption recorded.",
  ]);

  return <div className="container page-shell">
    <Breadcrumbs items={[{ label: "Codes", href: "/codes/" }]}/>
    <PageIntro
      eyebrow="No recycled lists"
      title="Unbox ASMR Roblox Codes (August 2026)"
      description={`No active code was verified in the ${formatDate(codeAudit.checkedAt)} public-source check. Community reports are queued for in-game testing, not copied into the Active codes table.`}
      checkedAt={codeAudit.checkedAt}
    />
    <div className="status-strip codes-status-strip" aria-label="Current Unbox ASMR codes status">
      <article className="status-card"><span>Verified active</span><strong>{codeAudit.verifiedActiveCount}</strong><p>Nothing enters Active without a successful current-version redemption.</p></article>
      <article className="status-card"><span>Community reported</span><strong>{codeAudit.reportedCandidateCount}</strong><p>Candidate strings are awaiting an in-game result and are not published as active.</p></article>
      <article className="status-card"><span>Redemption box</span><strong>Not verified</strong><p>{codeAudit.redemptionInterfaceStatus}</p></article>
      <article className="status-card"><span>Last audit</span><strong>{formatDate(codeAudit.checkedAt, "short")}</strong><p>Official listing and reported-candidate queue checked together.</p></article>
    </div>
    <InlineCallout title="Direct answer"><p>There are no verified active Unbox ASMR codes in this build. {codeAudit.officialListingStatus} The {codeAudit.reportedCandidateCount} community-reported candidates remain outside the active table until an in-game test succeeds.</p></InlineCallout>

    <section className="section-compact">
      <h2>Reported codes awaiting an in-game result</h2>
      <p>These strings were present in the dated community report. Listing them here makes the test queue transparent; it does not label them active, working, expired, or safe to redeem.</p>
      <DataTable label="Community-reported Unbox ASMR code candidates" headers={["Reported code","Status","Report checked","What this proves"]} rows={reportedRows}/>
      <p className="muted">Candidate only. Use the current in-game redemption surface and record the exact success, invalid, or expired response before changing a status.</p>
    </section>

    <section className="section-compact">
      <h2>Active codes</h2>
      <div style={{height:16}}/>
      <DataTable label="Active Unbox ASMR codes" headers={["Code","Reward","Status","Added","Expires","Checked","Evidence"]} rows={[]}/>
      <p className="muted">No verified active codes · Checked {formatDate(codeAudit.checkedAt)}</p>
    </section>

    <section>
      <h2>What was checked</h2>
      <div className="summary-grid">
        <article className="summary-card">
          <VerificationBadge status="official"/>
          <h3>Official experience description</h3>
          <p>It says to follow for updates and special codes. It does not contain an active code string or reward.</p>
        </article>
        <article className="summary-card warm-panel">
          <VerificationBadge status="unverified"/>
          <h3>In-game redemption interface</h3>
          <p>No current-version screenshot proves that a redemption box is present or where it appears.</p>
        </article>
      </div>
    </section>

    <section className="section-compact">
      <h2>Expired codes</h2>
      <div style={{height:16}}/>
      <DataTable label="Expired Unbox ASMR codes" headers={["Code","Reward","Status","Added","Expired","Checked","Evidence"]} rows={[]}/>
      <p className="muted">No expired code has been verified for this dataset.</p>
    </section>

    <section className="section split-cards">
      <article className="info-card"><h2>Is there a redemption box?</h2><p>Not publicly verified in-game for this build. Capture the current HUD, settings, shop, and reward surfaces before publishing click instructions.</p></article>
      <article className="info-card warm-panel"><h2>Non-code reward</h2><p>The official description advertises two free workers for liking the game and joining the group. That is a separate reward condition, not a promo code.</p></article>
    </section>

    <InlineCallout title="Fake code warning" tone="reported"><p>Familiar strings such as <s>RELEASE</s>, <s>THANKS</s>, or <s>SORRY</s> are not listed as active without an official announcement or a successful current-version redemption. Do not enter Roblox credentials into a code generator or third-party form.</p></InlineCallout>
    <section className="section-compact narrow">
      <h2>How a community report becomes a verified code</h2>
      <ol className="ordered-cards">
        <li><strong>Community discovery.</strong> Add the report to a private candidate queue with its URL and discovery date. A repeated claim is still only a report.</li>
        <li><strong>In-game verification.</strong> Test the exact string in the current game build and capture the redemption screen plus the success, invalid, or expired result.</li>
        <li><strong>Publish or reject.</strong> Publish only a successful result with its reward and checked date. Failed or unsupported reports stay out of Active codes.</li>
        <li><strong>Re-check after every update.</strong> Retest published codes and move failed or expired entries out of the active table.</li>
      </ol>
      <p className="muted">Current rule: {codeAudit.publicationRule}</p>
    </section>
    <section className="section-compact narrow">
      <h2>Unbox ASMR codes FAQ</h2>
      <div className="faq-list">{faqs.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div>
    </section>
    <RelatedLinks links={[{ href: "/wiki/", label: "Unbox ASMR Wiki" }, { href: "/updates/", label: "Latest update evidence" }, { href: "/rebirths-and-workers/", label: "Free workers" }]}/>
    <SourceList sources={[{ label: "Official Unbox ASMR Roblox experience", url: game.robloxUrl, note: `Description and public games API rechecked ${formatDate(codeAudit.checkedAt)}.` }, { label: "Community report awaiting redemption", url: codeAudit.reportedSourceUrl, note: `${codeAudit.reportedCandidateCount} candidate strings observed ${formatDate(codeAudit.reportedSourceCheckedAt)}; none is labeled Active without an in-game result.` }, { label: "Official ASMR Labs Roblox group", url: game.groupUrl, note: `Group surface checked separately from code status on ${formatDate(codeAudit.checkedAt)}.` }]}/>
  </div>;
}
