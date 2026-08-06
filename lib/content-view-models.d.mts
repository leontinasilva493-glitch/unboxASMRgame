import type { VerificationStatus } from "./types";

type RecordValue = Record<string, unknown>;
export type EvidenceView = {
  verifiedAt: string | null;
  evidenceStatus: VerificationStatus;
  evidenceUrl: string | null;
  evidenceScreenshot: string | null;
  evidenceTimestamp: string | null;
  evidenceVersion: string | null;
  evidenceNotes: string | null;
};
type NullableText = string | null;

export function buildCrateViewModels(records: readonly RecordValue[]): Array<EvidenceView & {
  name: NullableText; area: NullableText; requirement: NullableText; cost: NullableText;
  possibleToys: NullableText; event: NullableText; rarity: NullableText;
}>;
export function buildToyViewModels(records: readonly RecordValue[], crates: readonly RecordValue[]): Array<EvidenceView & {
  name: NullableText; rarity: NullableText; sourceCrates: NullableText; cashValue: NullableText;
  interaction: NullableText; event: NullableText; indexNumber: NullableText;
}>;
export function buildRebirthViewModels(records: readonly RecordValue[]): Array<EvidenceView & {
  name: NullableText; requirement: NullableText; resets: NullableText; keeps: NullableText;
  reward: NullableText; unlock: NullableText; version: NullableText;
}>;
export function buildWorkerViewModels(records: readonly RecordValue[]): Array<EvidenceView & {
  source: NullableText; unlock: NullableText; cost: NullableText; slot: NullableText;
  task: NullableText; offlineBehavior: NullableText; knownFix: NullableText;
}>;
export function buildGamepassViewModels(records: readonly RecordValue[]): Array<EvidenceView & {
  name: NullableText; price: NullableText; effect: NullableText; bestFor: NullableText;
  gameStage: NullableText; verdict: NullableText;
}>;
export function buildCollectionFilterRows(input: { crates: readonly RecordValue[]; toys: readonly RecordValue[] }): Array<{
  type: "crate" | "toy"; name: string; crate?: string; rarity?: string; eventLimited: boolean;
}>;
export function buildEvidenceHref(sourceUrl: string | null, videoTimestamp: string | null): string | null;
