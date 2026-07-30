"use client";

import { useEffect, useMemo, useState } from "react";
import { deriveEventStatus, getCountdownParts } from "@/scripts/event-utils.mjs";

export function EventCountdown({ startsAt, endsAt, initialStatus = "upcoming" }: { startsAt: string; endsAt?: string; initialStatus?: "upcoming" | "live" | "ended" }) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const initial = window.setTimeout(() => setNow(new Date()), 0);
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => {
      window.clearTimeout(initial);
      window.clearInterval(timer);
    };
  }, []);

  const status = now ? deriveEventStatus(startsAt, endsAt, now) : initialStatus;
  const target = status === "live" && endsAt ? endsAt : startsAt;
  const parts = now ? getCountdownParts(target, now) : { days: 0, hours: 0, minutes: 0, seconds: 0 };
  const local = useMemo(() => new Intl.DateTimeFormat("en-US", { dateStyle: "full", timeStyle: "short" }).format(new Date(startsAt)), [startsAt]);

  return <div className="countdown" aria-live="polite" data-event="event_countdown_view">
    <div className="countdown-head"><span className={`event-status status-${status}`}>{status === "live" ? "● Live" : status}</span><span>{status === "ended" ? "Event ended" : status === "live" ? "Ends in" : "Starts in"}</span></div>
    {status !== "ended" && <div className="countdown-grid">{Object.entries(parts).map(([label, value]) => <span key={label}><strong>{String(value).padStart(2, "0")}</strong><small>{label}</small></span>)}</div>}
    <p className="local-time"><strong>Your local time:</strong> {local}</p>
    <noscript><p>Starts August 2, 2026 at 3:00 PM ET / 12:00 PM PT.</p></noscript>
  </div>;
}
