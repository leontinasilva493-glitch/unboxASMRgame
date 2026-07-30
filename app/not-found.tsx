import Link from "next/link";
import { BoxIcon } from "@/components/icons";

export default function NotFound() {
  return <section className="container section"><div className="empty-state"><span className="empty-icon"><BoxIcon /></span><div><span className="eyebrow">404 · Crate not found</span><h1>This page is not in the collection.</h1><p>Try the player dashboard or jump to a verified guide instead.</p><Link className="button button-primary" href="/">Back to the guide</Link></div></div></section>;
}
