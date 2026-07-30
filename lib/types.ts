export type VerificationStatus =
  | "official"
  | "in_game_verified"
  | "community_reported"
  | "unverified";

export type Evidence = {
  status: VerificationStatus;
  verifiedAt: string;
  gameVersion?: string;
  eventName?: string;
  sourceUrl?: string;
  screenshot?: string;
  notes?: string;
};

export type EventRecord = {
  slug: string;
  name: string;
  startsAt: string;
  endsAt?: string;
  publishedStatus: "upcoming" | "live" | "ended";
  accentColor: "purple" | "pink";
  confirmedChanges: string[];
  unconfirmedNotes: string[];
  evidence: Evidence[];
};

export type GamepassRecord = {
  slug: string;
  name: string;
  priceRobux?: number;
  effect?: string;
  bestFor?: string[];
  gameStage?: "beginner" | "midgame" | "late_game" | "all";
  verdict?: string;
  evidence: Evidence[];
};
