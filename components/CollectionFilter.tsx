"use client";

import { useMemo, useState } from "react";
import { filterCollectionRows } from "@/scripts/filter-utils.mjs";
import { SearchIcon } from "./icons";

type CollectionFilterRow = {
  type: "crate" | "toy";
  name: string;
  crate?: string;
  rarity?: string;
  eventLimited: boolean;
};

export function CollectionFilter({ rows }: { rows: CollectionFilterRow[] }) {
  const [query, setQuery] = useState("");
  const [crate, setCrate] = useState("all");
  const [rarity, setRarity] = useState("all");
  const [event, setEvent] = useState("all");
  const crates = useMemo(() => [...new Set(rows.map((row) => row.crate).filter(Boolean))] as string[], [rows]);
  const rarities = useMemo(() => [...new Set(rows.map((row) => row.rarity).filter(Boolean))] as string[], [rows]);
  const filtered = useMemo(() => filterCollectionRows(rows, { query, crate, rarity, event }) as CollectionFilterRow[], [rows, query, crate, rarity, event]);
  const track = () => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "table_filter_use" });
  };
  return <div>
    <div className="filter-bar" aria-label="Crate and toy filters">
      <label className="filter-control"><span className="sr-only">Search crates and toys</span><SearchIcon/><input type="search" placeholder="Search names..." value={query} onChange={(e) => { setQuery(e.target.value); track(); }}/></label>
      <select value={crate} onChange={(e) => { setCrate(e.target.value); track(); }} aria-label="Filter by crate"><option value="all">All crates</option>{crates.map((item) => <option key={item}>{item}</option>)}</select>
      <select value={rarity} onChange={(e) => { setRarity(e.target.value); track(); }} aria-label="Filter by rarity"><option value="all">All rarities</option>{rarities.map((item) => <option key={item}>{item}</option>)}</select>
      <select value={event} onChange={(e) => { setEvent(e.target.value); track(); }} aria-label="Filter by event"><option value="all">All event states</option><option value="limited">Event limited</option><option value="standard">Standard</option></select>
    </div>
    <p className="muted" aria-live="polite">{rows.length ? `${filtered.length} of ${rows.length} evidence records shown.` : "0 evidence records. Filters are ready for the first evidence-backed entries."}</p>
    {filtered.length > 0 && <div className="filter-results">{filtered.map((row) => <article className="info-card" key={`${row.type}-${row.name}`}><span className="eyebrow">{row.type}</span><h3>{row.name}</h3><p>{row.crate || "No source crate recorded"}{row.rarity ? ` · ${row.rarity}` : ""}</p></article>)}</div>}
  </div>;
}
