import Link from "next/link";
import { ROBLOX_URL } from "@/lib/site";
import { ArrowIcon, BoxIcon, ShieldIcon, SparkIcon } from "./icons";
import { LastVerified } from "./Verification";

export function Hero() {
  return <section className="hero">
    <div className="hero-copy">
      <span className="eyebrow"><ShieldIcon /> Unofficial fan guide</span>
      <h1>Unbox ASMR — <em>Verified</em> Guide & Data Tracker</h1>
      <p className="hero-lead">Dated sources and evidence-gated data for Unbox ASMR on Roblox. Check crates, toys, workers, rebirths, Gamepasses, codes, and weekly events without made-up values.</p>
      <div className="hero-actions"><Link className="button button-primary" href="/beginner-guide/">Start the Beginner Guide <ArrowIcon /></Link><a className="button button-secondary" href={ROBLOX_URL} target="_blank" rel="noopener noreferrer" data-event="play_roblox_click">Play on Roblox ↗</a></div>
      <LastVerified date="2026-07-30" />
    </div>
    <div className="hero-visual" aria-label="Unbox ASMR Roblox gameplay evidence capture status">
      <div className="visual-toolbar"><span></span><span></span><span></span><b>GAMEPLAY EVIDENCE</b></div>
      <div className="visual-stage">
        <span className="big-box"><BoxIcon /></span>
        <div className="visual-copy"><SparkIcon /><strong>Screenshot capture queued</strong><p>We will only show current-version gameplay—not borrowed or invented art.</p></div>
        <div className="evidence-ticket"><ShieldIcon /><span><b>Evidence first</b><small>Privacy-cropped • dated • sourced</small></span></div>
      </div>
      <p className="visual-caption">16:9 gameplay slot · awaiting first-party capture · July 30, 2026</p>
    </div>
  </section>;
}
