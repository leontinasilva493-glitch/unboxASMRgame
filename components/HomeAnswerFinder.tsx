"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowIcon } from "./icons";

const answers = [
  {
    id: "start",
    label: "Starting the game",
    title: "How should a new player start?",
    answer: "Open the official Roblox experience and confirm that ASMR Labs is shown as the creator. Follow the onboarding text in your current server, then complete one visible crate-to-toy loop before spending again. The public listing confirms that the game involves unboxing toys, upgrading a collection, and unlocking better crates, but it does not publish exact button labels, starter prices, earnings, or the best upgrade order.",
    caution: "Use the current game UI as the authority when a prompt differs from an older guide.",
    href: "/beginner-guide/",
    linkLabel: "Open the evidence-aware beginner guide",
  },
  {
    id: "crates",
    label: "Crates and toys",
    title: "Which crates and toys are verified?",
    answer: "The official description confirms the crates-and-toys theme, but the current evidence set does not yet prove a complete crate list, toy list, rarity table, opening odds, cash values, or unlock sequence. Those fields remain intentionally blank instead of being copied from an undated community page. A reliable comparison needs a current-version capture of each crate panel and the resulting toy details.",
    caution: "Do not treat rarity, promotional art, or a copied list as proof of earnings or odds.",
    href: "/roblox-index/",
    linkLabel: "See the crates and toys evidence checklist",
  },
  {
    id: "workers",
    label: "Free workers",
    title: "How do the two free workers work?",
    answer: "The official Roblox listing says players can like the game and join the group for two free workers. That public condition is verified; the exact in-game delivery flow is not. After joining the official ASMR Labs group, return to the experience and inspect the current worker or reward panel. A before-and-after capture is still needed to prove whether delivery is automatic, requires a rejoin, depends on an open slot, or shows another claim step.",
    caution: "The official reward message does not prove worker speed, income, offline behavior, or stacking rules.",
    href: "/rebirths-and-workers/",
    linkLabel: "Check the worker verification status",
  },
  {
    id: "rebirth",
    label: "Rebirth decisions",
    title: "What should I check before rebirthing?",
    answer: "Open the rebirth panel and read the full confirmation screen before accepting. Record the requirement, every item that resets, everything the game says you keep, and each stated reward. This guide does not currently publish a rebirth cost, multiplier, or best timing because no complete current-version confirmation has been verified. If any part of the result is unclear, cancel the action and collect the missing evidence first.",
    caution: "A reset is difficult to reverse, so an incomplete community claim is not enough for a recommendation.",
    href: "/rebirths-and-workers/",
    linkLabel: "Use the rebirth safety checklist",
  },
  {
    id: "codes",
    label: "Active codes",
    title: "Are there active Unbox ASMR codes?",
    answer: "No active code was verified in the August 1, 2026 public-source check. The official experience description mentions updates and special codes, but it does not publish a code string, reward, expiration date, or redemption path. Familiar strings such as RELEASE, THANKS, or SORRY are not listed here unless an official announcement or a successful current-version redemption proves them.",
    caution: "Never enter Roblox credentials into a third-party code generator or reward form.",
    href: "/codes/",
    linkLabel: "Review the full codes status",
  },
  {
    id: "gamepasses",
    label: "Gamepass value",
    title: "Which Unbox ASMR Gamepass is best?",
    answer: "There is not enough in-game evidence to name a best Gamepass. The site has seven dated public price snapshots, but a pass name and Robux amount do not prove its exact effect, stacking behavior, practical value, or ideal player stage. Check the live Roblox purchase panel before spending, then separate the advertised wording from the result actually observed in the current game version.",
    caution: "Price data is useful for budgeting; it is not a value verdict or purchase recommendation.",
    href: "/gamepasses/",
    linkLabel: "Compare the dated price snapshot",
  },
];

export function HomeAnswerFinder() {
  const [selected, setSelected] = useState(answers[0].id);

  function showAnswer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const target = document.getElementById(`answer-${selected}`);
    target?.scrollIntoView({ behavior: "smooth", block: "center" });
    target?.focus({ preventScroll: true });
  }

  return <section className="section answer-finder-section">
    <div className="container">
      <div className="section-head">
        <div>
          <span className="section-kicker">Answer finder</span>
          <h2>Get a quick Unbox ASMR Roblox answer</h2>
        </div>
        <p>Choose the decision in front of you. The answer stays on this page, with the current evidence limit shown beside it.</p>
      </div>

      <form className="answer-finder-control" aria-label="Unbox ASMR Roblox quick answer finder" onSubmit={showAnswer}>
        <label htmlFor="answer-topic">What do you need to check?</label>
        <div className="answer-finder-fields">
          <select id="answer-topic" value={selected} onChange={(event) => setSelected(event.target.value)}>
            {answers.map((answer) => <option key={answer.id} value={answer.id}>{answer.label}</option>)}
          </select>
          <button className="button button-primary" type="submit">Show my answer</button>
        </div>
        <p>All six answers remain visible below, so search engines and players can read the same useful content without a redirect.</p>
      </form>

      <div className="answer-grid">
        {answers.map((answer) => <article
          className="answer-card"
          data-selected={selected === answer.id ? "true" : "false"}
          id={`answer-${answer.id}`}
          key={answer.id}
          tabIndex={-1}
        >
          <span className="answer-number">{String(answers.indexOf(answer) + 1).padStart(2, "0")}</span>
          <h3>{answer.title}</h3>
          <p>{answer.answer}</p>
          <p className="answer-caution"><strong>Evidence limit:</strong> {answer.caution}</p>
          <Link className="text-link" href={answer.href}>{answer.linkLabel} <ArrowIcon /></Link>
        </article>)}
      </div>
    </div>
  </section>;
}
