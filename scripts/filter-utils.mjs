export function filterCollectionRows(rows, filters = {}) {
  const query = filters.query?.trim().toLocaleLowerCase() ?? "";
  return rows.filter((row) => {
    if (query && !`${row.name} ${row.crate ?? ""} ${row.rarity ?? ""}`.toLocaleLowerCase().includes(query)) return false;
    if (filters.crate && filters.crate !== "all" && row.crate !== filters.crate) return false;
    if (filters.rarity && filters.rarity !== "all" && row.rarity !== filters.rarity) return false;
    if (filters.event === "limited" && !row.eventLimited) return false;
    if (filters.event === "standard" && row.eventLimited) return false;
    return true;
  });
}
