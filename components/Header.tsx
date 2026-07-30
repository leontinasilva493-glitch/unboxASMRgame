"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems, ROBLOX_URL } from "@/lib/site";
import { BoxIcon, MenuIcon } from "./icons";

export function Header() {
  const pathname = usePathname();
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link className="brand" href="/" aria-label="Unbox ASMR Guide home">
          <span className="brand-mark"><BoxIcon /></span>
          <span>Unbox <strong>ASMR</strong></span>
        </Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navItems.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined}>{item.label}</Link>;
          })}
        </nav>
        <a className="button button-primary header-cta" href={ROBLOX_URL} target="_blank" rel="noopener noreferrer" data-event="play_roblox_click">Play on Roblox</a>
        <details className="mobile-nav">
          <summary><MenuIcon /><span>Menu</span></summary>
          <nav aria-label="Mobile navigation">
            {navItems.map((item) => <Link key={item.href} href={item.href}>{item.mobileLabel}</Link>)}
            <a href={ROBLOX_URL} target="_blank" rel="noopener noreferrer">Play on Roblox ↗</a>
          </nav>
        </details>
      </div>
    </header>
  );
}
