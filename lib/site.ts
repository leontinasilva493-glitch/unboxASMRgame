import type { Metadata } from "next";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://unboxasmr.guide";
export const ROBLOX_URL =
  process.env.NEXT_PUBLIC_ROBLOX_GAME_URL ||
  "https://www.roblox.com/games/112233638491976/Unbox-ASMR";
export const LAST_CHECKED = "2026-07-30";

export const navItems = [
  { href: "/", label: "Home", mobileLabel: "Home" },
  { href: "/beginner-guide/", label: "Beginner Guide", mobileLabel: "Beginner" },
  { href: "/crates-and-toys/", label: "Crates & Toys", mobileLabel: "Crates & Toys" },
  { href: "/rebirths-and-workers/", label: "Rebirths & Workers", mobileLabel: "Rebirths" },
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
}: {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
}): Metadata {
  const canonical = new URL(path, SITE_URL).toString();
  return {
    title,
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
