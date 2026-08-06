import type { VerificationStatus } from "@/lib/types";
import Image from "next/image";
import { formatDate } from "@/lib/site";
import { buildEvidenceHref } from "@/lib/content-view-models.mjs";
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

export function EvidenceReference({
  status,
  sourceUrl,
  screenshot,
  videoTimestamp,
  gameVersion,
  verifiedAt,
  notes,
}: {
  status: VerificationStatus;
  sourceUrl?: string | null;
  screenshot?: string | null;
  videoTimestamp?: string | null;
  gameVersion?: string | null;
  verifiedAt?: string | null;
  notes?: string | null;
}) {
  const evidenceHref = buildEvidenceHref(sourceUrl ?? null, videoTimestamp ?? null);
  return <article className="evidence-reference">
    {screenshot ? <a href={evidenceHref ?? screenshot} target="_blank" rel="noopener noreferrer" className="evidence-reference-image"><Image src={screenshot} alt="Gameplay evidence frame" width={1280} height={720} sizes="(max-width: 767px) 100vw, 50vw"/></a> : null}
    <div className="evidence-reference-copy">
      <div className="evidence-reference-meta"><VerificationBadge status={status}/>{verifiedAt ? <LastVerified date={verifiedAt} prefix="Reviewed"/> : null}</div>
      {gameVersion ? <p><strong>Recording/version:</strong> {gameVersion}</p> : null}
      {evidenceHref ? <p><a className="text-link" href={evidenceHref} target="_blank" rel="noopener noreferrer">Open source{videoTimestamp ? ` at ${videoTimestamp}` : ""}</a></p> : null}
      {notes ? <p className="muted">{notes}</p> : null}
    </div>
  </article>;
}
