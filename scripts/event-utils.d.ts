export function deriveEventStatus(
  startsAt: string,
  endsAt?: string,
  now?: Date,
): "upcoming" | "live" | "ended";

export function getCountdownParts(
  targetAt: string,
  now?: Date,
): { days: number; hours: number; minutes: number; seconds: number };
