import type { ReactNode } from "react";

export function DataTable({ headers, rows, label, className = "" }: { headers: string[]; rows: ReactNode[][]; label: string; className?: string }) {
  return <div className={`table-wrap ${className}`} tabIndex={0} role="region" aria-label={`${label}, horizontally scrollable`}><table><caption className="sr-only">{label}</caption><thead><tr>{headers.map((header) => <th key={header} scope="col">{header}</th>)}</tr></thead><tbody>{rows.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, cellIndex) => cellIndex === 0 ? <th key={cellIndex} scope="row">{cell}</th> : <td key={cellIndex}>{cell}</td>)}</tr>)}</tbody></table></div>;
}
