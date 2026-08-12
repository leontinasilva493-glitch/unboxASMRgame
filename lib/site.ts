import type { Metadata } from "next";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://unboxasmrguide.site";
export const ROBLOX_URL =
  process.env.NEXT_PUBLIC_ROBLOX_GAME_URL ||
  "https://www.roblox.com/games/112233638491976/Unbox-ASMR";
export const LAST_CHECKED = "2026-08-11";

export const wikiNavItems = [
  { href: "/wiki/", label: "Wiki Home", mobileLabel: "Wiki Home", description: "Verified facts and every player guide" },
  { href: "/beginner-guide/", label: "Beginner Guide", mobileLabel: "Beginner Guide", description: "A cautious route through the first session" },
  { href: "/roblox-index/", label: "Roblox Index", mobileLabel: "Roblox Index", description: "Evidence-gated crate and toy collection data" },
  { href: "/rebirths-and-workers/", label: "Rebirths & Workers", mobileLabel: "Rebirths & Workers", description: "Reset questions and worker evidence" },
  { href: "/sources/", label: "Sources & Verification", mobileLabel: "Sources & Verification", description: "How claims earn a verification status" },
] as const;

export const navItems = [
  { href: "/gamepasses/", label: "Gamepasses", mobileLabel: "Gamepasses" },
  { href: "/updates/", label: "Updates", mobileLabel: "Updates" },
  { href: "/codes/", label: "Codes", mobileLabel: "Codes" },
] as const;

export function formatDate(date: string, style: "short" | "long" = "long") {
  return new Intl.DateTimeFormat("en-US", {
    month: style === "short" ? "short" : "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(date));
}

export function pageMetadata({
  title,
  description,
  path,
  noindex = false,
  absoluteTitle = false,
}: {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
  absoluteTitle?: boolean;
}): Metadata {
  const canonical = new URL(path, SITE_URL).toString();
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical },
    robots: noindex ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: {
      type: "website",
      title,
      description,
      url: canonical,
      siteName: "Unbox ASMR Guide",
      locale: "en_US",
    },
  };
}
