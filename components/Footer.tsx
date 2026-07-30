import Link from "next/link";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <div className="footer-brand">Unbox ASMR Guide</div>
          <p className="footer-disclaimer">Unbox ASMR Guide is an independent fan-made resource and is not affiliated with Roblox Corporation or ASMR Labs. Roblox and the game’s names and assets belong to their respective owners.</p>
        </div>
        <nav aria-label="Footer navigation">
          <Link href="/about/">About</Link>
          <Link href="/sources/">Sources</Link>
          <Link href="/privacy/">Privacy</Link>
          <Link href="/terms/">Terms</Link>
        </nav>
      </div>
    </footer>
  );
}
