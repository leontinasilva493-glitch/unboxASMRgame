export function deriveEventStatus(startsAt, endsAt, now = new Date()) {
  const start = new Date(startsAt).getTime();
  const end = endsAt ? new Date(endsAt).getTime() : Number.POSITIVE_INFINITY;
  const current = now.getTime();

  if (current < start) return "upcoming";
  if (current >= end) return "ended";
  return "live";
}

export function getCountdownParts(targetAt, now = new Date()) {
  const totalSeconds = Math.max(0, Math.floor((new Date(targetAt).getTime() - now.getTime()) / 1000));
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}
