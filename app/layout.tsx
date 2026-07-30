import type { Metadata } from "next";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/plus-jakarta-sans/800.css";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AnalyticsEvents } from "@/components/AnalyticsEvents";
import { ROBLOX_URL, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Unbox ASMR Roblox Guide", template: "%s | Unbox ASMR Guide" },
  description: "Evidence-gated guides, event times, codes, and data for Unbox ASMR on Roblox.",
  applicationName: "Unbox ASMR Guide",
  category: "games",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "WebSite", name: "Unbox ASMR Guide", url: SITE_URL, description: "An independent, evidence-gated player guide for Unbox ASMR on Roblox." },
    { "@type": "Organization", name: "Unbox ASMR Guide", url: SITE_URL, description: "Independent fan-made guide; not affiliated with Roblox Corporation or ASMR Labs." },
    { "@type": "VideoGame", name: "Unbox ASMR", url: ROBLOX_URL, publisher: { "@type": "Organization", name: "ASMR Labs" }, gamePlatform: "Roblox" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><a className="skip-link" href="#main">Skip to content</a><Header /><main id="main">{children}</main><Footer /><AnalyticsEvents /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /></body></html>;
}
