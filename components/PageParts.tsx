import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowIcon, ClockIcon } from "./icons";
import { LastVerified } from "./Verification";

export function PageIntro({ eyebrow, title, description, checkedAt = "2026-07-30" }: { eyebrow: string; title: string; description: string; checkedAt?: string }) {
  return <header className="page-intro"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p className="entity-context">Unbox ASMR on Roblox · Independent fan guide</p><p>{description}</p><LastVerified date={checkedAt} prefix="Last checked" /></header>;
}

export function InlineCallout({ title, children, tone = "neutral" }: { title: string; children: ReactNode; tone?: "neutral" | "reported" | "danger" }) {
  return <aside className={`callout callout-${tone}`}><strong>{title}</strong><div>{children}</div></aside>;
}

export function EmptyVerifiedState({ description, href = "/sources/", linkLabel = "How verification works" }: { description: string; href?: string; linkLabel?: string }) {
  return <section className="empty-state"><span className="empty-icon"><ClockIcon /></span><div><span className="eyebrow">Verification in progress</span><h2>We are holding this table until the evidence is ready.</h2><p>{description}</p><Link className="text-link" href={href}>{linkLabel}<ArrowIcon /></Link></div></section>;
}

export function SourceList({ sources }: { sources: { label: string; url: string; note?: string }[] }) {
  return <section className="sources-block"><h2>Sources</h2><ol>{sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer" data-event="source_open">{source.label} ↗</a>{source.note && <span>{source.note}</span>}</li>)}</ol></section>;
}

export function RelatedLinks({ links }: { links: { href: string; label: string }[] }) {
  return <nav className="related-links" aria-label="Related guides"><span>Keep exploring</span>{links.map((link) => <Link key={link.href} href={link.href}>{link.label}<ArrowIcon /></Link>)}</nav>;
}

export function TableOfContents({ items }: { items: { href: string; label: string }[] }) {
  return <nav className="toc" aria-label="On this page"><strong>On this page</strong>{items.map((item, index) => <a key={item.href} href={item.href}><span>{String(index + 1).padStart(2, "0")}</span>{item.label}</a>)}</nav>;
}
