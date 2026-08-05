"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MouseEvent } from "react";
import { navItems, ROBLOX_URL, wikiNavItems } from "@/lib/site";
import { BoxIcon, MenuIcon } from "./icons";

export function Header() {
  const pathname = usePathname();
  const wikiActive = wikiNavItems.some((item) => pathname.startsWith(item.href));
  const openWikiMenu = (event: MouseEvent<HTMLDetailsElement>) => {
    event.currentTarget.open = true;
  };
  const closeWikiMenuAfterHover = (event: MouseEvent<HTMLDetailsElement>) => {
    if (!event.currentTarget.contains(document.activeElement)) event.currentTarget.open = false;
  };
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link className="brand" href="/" aria-label="Unbox ASMR Guide home">
          <span className="brand-mark"><BoxIcon /></span>
          <span>Unbox <strong>ASMR</strong></span>
        </Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          <details className="desktop-wiki-menu" onMouseEnter={openWikiMenu} onMouseLeave={closeWikiMenuAfterHover}>
            <summary aria-current={wikiActive ? "page" : undefined}>Wiki</summary>
            <div className="wiki-dropdown" aria-label="Wiki guides">
              {wikiNavItems.map((item) => {
                const active = pathname.startsWith(item.href);
                return <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined}><strong>{item.label}</strong><span>{item.description}</span></Link>;
              })}
            </div>
          </details>
          {navItems.map((item) => {
            const active = pathname.startsWith(item.href);
            return <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined}>{item.label}</Link>;
          })}
        </nav>
        <a className="button button-primary header-cta" href={ROBLOX_URL} target="_blank" rel="noopener noreferrer" data-event="play_roblox_click">Play on Roblox</a>
        <details className="mobile-nav">
          <summary><MenuIcon /><span>Menu</span></summary>
          <nav aria-label="Mobile navigation">
            <div className="mobile-nav-group">
              <span>Wiki &amp; Guides</span>
              {wikiNavItems.map((item) => <Link key={item.href} href={item.href}>{item.mobileLabel}</Link>)}
            </div>
            <div className="mobile-nav-group">
              <span>Current Checks</span>
              {navItems.map((item) => <Link key={item.href} href={item.href}>{item.mobileLabel}</Link>)}
            </div>
            <a href={ROBLOX_URL} target="_blank" rel="noopener noreferrer">Play on Roblox ↗</a>
          </nav>
        </details>
      </div>
    </header>
  );
}
