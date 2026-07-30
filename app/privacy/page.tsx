import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageIntro, RelatedLinks } from "@/components/PageParts";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({ title: "Privacy", description: "Privacy approach for the Unbox ASMR Guide: no accounts, profiles, comments, or personal gameplay data collection in the MVP.", path: "/privacy/" });

export default function Privacy() {
  return <div className="container page-shell"><Breadcrumbs items={[{ label: "Privacy", href: "/privacy/" }]}/><PageIntro eyebrow="Plain-language policy" title="Privacy" description="This MVP is designed to answer game questions without creating accounts or collecting player identities."/><article className="narrow prose"><h2>What the site does not collect</h2><ul><li>No Roblox username or account credentials.</li><li>No age, minor-status, profile, comments, or saved cloud progress.</li><li>No search-box text or unnecessary device fingerprinting.</li></ul><h2>Basic usage events</h2><p>The interface includes privacy-safe hooks for broad events such as opening a guide, using a table filter, or following the official Roblox link. No analytics provider is enabled in this build. If one is added later, this page must be updated before collection begins.</p><h2>External links</h2><p>Roblox and source websites have their own privacy practices. External links open directly to those providers and are clearly labeled.</p><h2>Gameplay evidence</h2><p>Any future screenshots must crop usernames, chat, and unrelated personal information before being stored in the project.</p><p className="muted">Last reviewed: July 30, 2026.</p><RelatedLinks links={[{ href: "/about/", label: "About" }, { href: "/terms/", label: "Terms" }]}/></article></div>;
}
