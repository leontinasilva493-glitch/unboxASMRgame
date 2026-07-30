import type { VerificationStatus } from "@/lib/types";
import { formatDate } from "@/lib/site";
import { GamepadIcon, MessageIcon, QuestionIcon, ShieldIcon } from "./icons";

const config = {
  official: { label: "Official", icon: ShieldIcon },
  in_game_verified: { label: "In-game verified", icon: GamepadIcon },
  community_reported: { label: "Community reported", icon: MessageIcon },
  unverified: { label: "Unverified", icon: QuestionIcon },
} satisfies Record<VerificationStatus, { label: string; icon: typeof ShieldIcon }>;

export function VerificationBadge({ status }: { status: VerificationStatus }) {
  const item = config[status];
  const Icon = item.icon;
  return <span className={`verification-badge badge-${status}`}><Icon />{item.label}</span>;
}

export function LastVerified({ date, prefix = "Last verified" }: { date: string; prefix?: string }) {
  return <span className="last-verified">{prefix}: {formatDate(date, "short")}</span>;
}

export function MissingValue() {
  return <span className="missing-value">Not publicly verified</span>;
}
