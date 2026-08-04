import Script from "next/script";
import { buildClarityBootstrap, CLARITY_PROJECT_ID } from "@/lib/clarity.mjs";

export function MicrosoftClarity() {
  return <Script id="microsoft-clarity" strategy="afterInteractive">{buildClarityBootstrap(CLARITY_PROJECT_ID)}</Script>;
}
