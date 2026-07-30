import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["/", "/gamepasses/", "/updates/", "/codes/", "/about/", "/sources/", "/privacy/", "/terms/"];
  return paths.map((path) => ({ url: new URL(path, SITE_URL).toString(), lastModified: new Date("2026-07-30"), changeFrequency: path === "/updates/" || path === "/codes/" ? "weekly" : "monthly", priority: path === "/" ? 1 : path === "/updates/" || path === "/codes/" ? .8 : .6 }));
}
