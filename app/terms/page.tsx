import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageIntro, RelatedLinks } from "@/components/PageParts";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({ title: "Terms and Disclaimer", description: "Terms and unofficial fan-guide disclaimer for the Unbox ASMR Guide.", path: "/terms/" });

export default function Terms() {
  return <div className="container page-shell"><Breadcrumbs items={[{ label: "Terms", href: "/terms/" }]}/><PageIntro eyebrow="Independent fan resource" title="Terms and Disclaimer" description="Use this guide as dated gameplay information, not as an official Roblox or ASMR Labs service."/><article className="narrow prose"><h2>No affiliation</h2><p>Unbox ASMR Guide is an independent fan-made resource and is not affiliated with Roblox Corporation or ASMR Labs. Roblox and the game’s names and assets belong to their respective owners.</p><h2>Information changes</h2><p>Game prices, effects, schedules, codes, and systems may change without notice. Check the evidence status and date, then confirm important spending or reset decisions in the current game.</p><h2>No sales or account services</h2><p>This site does not sell Robux, Gamepasses, codes, accounts, or game access. It does not provide exploits, scripts, automation, or bypass mechanisms.</p><h2>External services</h2><p>Links to Roblox and third-party sources are provided for verification. Their availability, content, and transactions are controlled by those services.</p><p className="muted">Last reviewed: July 30, 2026.</p><RelatedLinks links={[{ href: "/about/", label: "About" }, { href: "/sources/", label: "Sources" }, { href: "/privacy/", label: "Privacy" }]}/></article></div>;
}
