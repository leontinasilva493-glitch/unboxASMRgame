import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { EventCountdown } from "@/components/EventCountdown";
import { InlineCallout, PageIntro, RelatedLinks, SourceList } from "@/components/PageParts";
import { VerificationBadge } from "@/components/Verification";
import { changelog, events, game } from "@/lib/data";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Unbox ASMR Update 3 & Admin Abuse Time",
  description: "The reported Unbox ASMR Update 3 and Admin Abuse schedule with local time, a pre-update public check, and a strict implementation-evidence boundary.",
  path: "/updates/",
});

export default function Updates() {
  const event = events[0];
  return <div className="container page-shell">
    <Breadcrumbs items={[{ label: "Updates", href: "/updates/" }]}/>
    <PageIntro
      eyebrow="Event desk"
      title="Unbox ASMR Roblox Update 3 and Admin Abuse"
      description="The schedule is community-reported and converted to your local time. The reported window has begun, but the official public listing still does not provide an Update 3 feature list."
      checkedAt="2026-08-03"
    />

    <InlineCallout title="Pre-update public check" tone="reported">
      <p>The official Roblox games record was checked on August 1, 2026. It shows the public experience was updated on July 31 at 20:43 UTC, but the description still contains the general crates, toys, friends, workers, and special-codes messaging. That timestamp alone does not prove Update 3 content.</p>
    </InlineCallout>

    <div className="event-banner">
      <div className="event-banner-copy">
        <VerificationBadge status="community_reported"/>
        <h2>{event.name}</h2>
        <p>Starts Aug 2, 2026 · 3:00 PM ET / 12:00 PM PT<br/>Ends Aug 9, 2026 · 3:00 PM ET / 12:00 PM PT</p>
      </div>
      <EventCountdown startsAt={event.startsAt} endsAt={event.endsAt} initialStatus={event.publishedStatus}/>
    </div>

    <InlineCallout title="Community schedule source" tone="reported">
      <p>AbuseTime and All Things How list the August 2–9 event window. These community schedule records support timing only; they do not prove that a crate, toy, code, rebirth, worker, or Gamepass change is active in the current build.</p>
    </InlineCallout>

    <section className="section-compact split-cards">
      <article className="info-card keep-card">
        <h2>Published schedule</h2>
        <ul>{event.confirmedChanges.map((item) => <li key={item}>{item}</li>)}</ul>
        <p className="muted">Evidence level: community reported. Re-check when an official announcement or event panel is available.</p>
      </article>
      <article className="info-card">
        <h2>Not announced or verified</h2>
        <ul>{event.unconfirmedNotes.map((item) => <li key={item}>{item}</li>)}</ul>
      </article>
    </section>

    <InlineCallout title="Implementation status: current gameplay still required" tone="danger"><p>The community-reported event window began on August 2, 2026. No crate, toy, code, rebirth, worker, or Gamepass change is presented as implemented until current-version gameplay or an official announcement proves it.</p></InlineCallout>

    <section className="section-compact narrow">
      <h2>Changelog</h2>
      <ol className="ordered-cards">{changelog.map((item) => <li key={`${item.date}-${item.title}`}><strong>{item.date} · {item.title}</strong>{item.details}</li>)}</ol>
    </section>

    <section className="summary-card warm-panel">
      <h2>Update 3 verification runbook</h2>
      <ol>
        <li>Capture the event panel and server version after the reported start.</li>
        <li>Record added or changed crates and toys without inferring hidden odds.</li>
        <li>Open the rebirth confirmation and worker panels before and after any change.</li>
        <li>Check for a code redemption surface and record the exact response to any official code.</li>
        <li>Re-check Gamepass descriptions and prices without turning names into effect claims.</li>
      </ol>
    </section>

    <RelatedLinks links={[{ href: "/codes/", label: "Codes status" }, { href: "/crates-and-toys/", label: "Crates & Toys" }, { href: "/rebirths-and-workers/", label: "Rebirths & Workers" }, { href: "/sources/", label: "Evidence policy" }]}/>
    <SourceList sources={[{ label: "Official Unbox ASMR Roblox experience", url: game.robloxUrl, note: "Public description and games API checked August 1, 2026." }, { label: "AbuseTime Unbox ASMR schedule", url: "https://abusetime.dev/games/unbox-asmr/current", note: "Community schedule checked August 3, 2026; timing only, not feature proof." }, { label: "All Things How event schedule", url: "https://allthings.how/unbox-asmr-events-schedule/", note: "Community-reported schedule checked July 30, 2026; not proof of implemented features." }]}/>
  </div>;
}
