import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { DataTable } from "@/components/DataTable";
import { InlineCallout, PageIntro, RelatedLinks, SourceList } from "@/components/PageParts";
import { VerificationBadge } from "@/components/Verification";
import { game } from "@/lib/data";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Unbox ASMR Codes (August 2026): No Verified Active Codes",
  description: "No reliably verified active Unbox ASMR codes as of August 1, 2026. See the official-source check, redemption status, and verification rule.",
  path: "/codes/",
});

export default function Codes() {
  return <div className="container page-shell">
    <Breadcrumbs items={[{ label: "Codes", href: "/codes/" }]}/>
    <PageIntro
      eyebrow="No recycled lists"
      title="Unbox ASMR Roblox Codes (August 2026)"
      description="No active code was verified in the August 1 public-source check. The official listing mentions special codes, but it does not publish a code string, reward, expiry date, or redemption path."
      checkedAt={game.checkedAt}
    />
    <InlineCallout title="Direct answer"><p>There are no verified active Unbox ASMR codes in this build. No code string is published in the official game description checked on August 1, 2026. A general mention of “special codes” is not an active code.</p></InlineCallout>

    <section className="section-compact">
      <h2>Active codes</h2>
      <div style={{height:16}}/>
      <DataTable label="Active Unbox ASMR codes" headers={["Code","Reward","Status","Added","Expires","Checked","Evidence"]} rows={[]}/>
      <p className="muted">No verified active codes · Checked August 1, 2026</p>
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
      <h2>How a new code becomes verified</h2>
      <ol className="ordered-cards">
        <li><strong>Find an official source or current in-game prompt.</strong> Record the URL or uncropped UI context and date.</li>
        <li><strong>Redeem it in the current game version.</strong> Capture the exact result without exposing a username or chat.</li>
        <li><strong>Record the reward and status.</strong> Add checked, added, and expiry dates when known.</li>
        <li><strong>Re-check after every update.</strong> Move failed or expired codes out of the active table.</li>
      </ol>
    </section>
    <RelatedLinks links={[{ href: "/updates/", label: "Update 3 status" }, { href: "/beginner-guide/", label: "Beginner Guide" }, { href: "/rebirths-and-workers/", label: "Free workers" }]}/>
    <SourceList sources={[{ label: "Official Unbox ASMR Roblox experience", url: game.robloxUrl, note: "Description checked August 1, 2026." }, { label: "Official ASMR Labs Roblox group", url: game.groupUrl, note: "Checked separately from code status." }]}/>
  </div>;
}
