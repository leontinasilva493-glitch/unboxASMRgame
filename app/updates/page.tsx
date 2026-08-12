import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { EventCountdown } from "@/components/EventCountdown";
import { InlineCallout, PageIntro, RelatedLinks, SourceList } from "@/components/PageParts";
import { VerificationBadge } from "@/components/Verification";
import { changelog, events, game } from "@/lib/data";
import { formatDate, pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Unbox ASMR Updates — Latest Official Check & Event Status",
  description: "Latest official Unbox ASMR Roblox listing check, archived event timing, gameplay verification gaps, and the weather-events evidence queue.",
  path: "/updates/",
});

export default function Updates() {
  const event = events[0];
  return <div className="container page-shell">
    <Breadcrumbs items={[{ label: "Updates", href: "/updates/" }]}/>
    <PageIntro
      eyebrow="Event desk"
      title="Unbox ASMR Updates and Event Status"
      description="Start with the latest official listing check, then review the expired community-reported event window and the gameplay evidence still needed for weather, codes, crates, workers, and rebirths."
      checkedAt={game.checkedAt}
    />

    <InlineCallout title="Latest official check" tone="reported">
      <p>The official Roblox games API was checked on {formatDate(game.checkedAt)}. It shows the public record updated on {formatDate(game.officialUpdatedAt)}, while the description still contains only the broad crates, toys, friends, workers, and special-codes messaging. An update timestamp does not prove a numbered update, weather mechanic, active code, or gameplay value.</p>
    </InlineCallout>

    <div className="event-banner">
      <div className="event-banner-copy">
        <VerificationBadge status="community_reported"/>
        <span className="eyebrow">Reported event archive</span>
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

    <InlineCallout title="Implementation status: current gameplay still required" tone="danger"><p>The community-reported event window ended on August 9, 2026. No crate, toy, weather event, code, rebirth, worker, or Gamepass change is presented as implemented until current-version gameplay or an official announcement proves it.</p></InlineCallout>

    <section className="section-compact summary-card warm-panel">
      <span className="section-kicker">High-value content gap</span>
      <h2>Weather events evidence queue</h2>
      <p>Search research shows player interest in weather events, but this build has no current-version first-party capture that proves an event name, trigger, duration, and effect together. A dedicated weather page would stay noindex and thin until it can answer what changed and what the player should do.</p>
      <ol>
        <li>Capture the event banner or weather label with the server and current game context visible.</li>
        <li>Record the same action before and during the event to separate a real effect from coincidence.</li>
        <li>Keep any countdown, start/end state, reward result, and relevant UI in one continuous recording.</li>
        <li>Repeat the observation or find an official announcement before publishing a stable mechanic as fact.</li>
      </ol>
      <p className="muted">SEO decision: do not add <code>/weather-events/</code> to the sitemap until the page contains differentiated, reproducible gameplay evidence.</p>
    </section>

    <section className="section-compact narrow">
      <h2>Changelog</h2>
      <ol className="ordered-cards">{changelog.map((item) => <li key={`${item.date}-${item.title}`}><strong>{item.date} · {item.title}</strong>{item.details}</li>)}</ol>
    </section>

    <section className="summary-card warm-panel">
      <h2>Current gameplay verification runbook</h2>
      <ol>
        <li>Capture the event panel and server version after the reported start.</li>
        <li>Record added or changed crates and toys without inferring hidden odds.</li>
        <li>Open the rebirth confirmation and worker panels before and after any change.</li>
        <li>Check for a code redemption surface and record the exact response to any official code.</li>
        <li>Re-check Gamepass descriptions and prices without turning names into effect claims.</li>
      </ol>
    </section>

    <RelatedLinks links={[{ href: "/wiki/", label: "Unbox ASMR Wiki" }, { href: "/codes/", label: "Codes status" }, { href: "/roblox-index/", label: "Roblox Index" }, { href: "/rebirths-and-workers/", label: "Rebirths & Workers" }, { href: "/sources/", label: "Evidence policy" }]}/>
    <SourceList sources={[{ label: "Official Unbox ASMR Roblox experience", url: game.robloxUrl, note: `Public description and games API checked ${formatDate(game.checkedAt)}.` }, { label: "AbuseTime Unbox ASMR schedule", url: "https://abusetime.dev/games/unbox-asmr/current", note: "Community schedule checked August 3, 2026; timing only, not feature proof." }, { label: "All Things How event schedule", url: "https://allthings.how/unbox-asmr-events-schedule/", note: "Community-reported schedule checked July 30, 2026; not proof of implemented features." }]}/>
  </div>;
}
