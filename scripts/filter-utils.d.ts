export type CollectionFilterRow = {
  type: "crate" | "toy";
  name: string;
  crate?: string;
  rarity?: string;
  eventLimited: boolean;
};

export function filterCollectionRows(
  rows: CollectionFilterRow[],
  filters: { query?: string; crate?: string; rarity?: string; event?: string },
): CollectionFilterRow[];
