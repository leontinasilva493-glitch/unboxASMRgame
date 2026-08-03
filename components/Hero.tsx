import Link from "next/link";
import { ROBLOX_URL } from "@/lib/site";
import { ArrowIcon, ShieldIcon } from "./icons";
import { LastVerified } from "./Verification";
import { HeroCarousel } from "./HeroCarousel";

export function Hero() {
  return <section className="hero">
    <div className="hero-copy">
      <span className="eyebrow"><ShieldIcon /> Unofficial fan guide</span>
      <h1>Unbox ASMR Roblox Guide & <em>Verified</em> Data Tracker</h1>
      <p className="hero-lead">Use this independent guide to check Unbox ASMR on Roblox before you spend Robux, rebirth, follow a code list, or trust an undated value. Crates, toys, workers, Gamepasses, codes, and events are separated into verified facts, dated reports, and evidence still needed.</p>
      <div className="hero-actions"><Link className="button button-primary" href="/beginner-guide/">Start the Beginner Guide <ArrowIcon /></Link><a className="button button-secondary" href={ROBLOX_URL} target="_blank" rel="noopener noreferrer" data-event="play_roblox_click">Play on Roblox ↗</a></div>
      <LastVerified date="2026-08-01" />
    </div>
    <HeroCarousel />
  </section>;
}
