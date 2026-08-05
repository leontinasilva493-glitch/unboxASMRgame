import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    { path: "/", lastModified: "2026-08-05", changeFrequency: "weekly" as const, priority: 1 },
    { path: "/wiki/", lastModified: "2026-08-05", changeFrequency: "weekly" as const, priority: .9 },
    { path: "/codes/", lastModified: "2026-08-05", changeFrequency: "weekly" as const, priority: .8 },
    { path: "/updates/", lastModified: "2026-08-03", changeFrequency: "weekly" as const, priority: .8 },
    { path: "/gamepasses/", lastModified: "2026-08-01", changeFrequency: "monthly" as const, priority: .7 },
    { path: "/about/", lastModified: "2026-07-30", changeFrequency: "monthly" as const, priority: .6 },
    { path: "/sources/", lastModified: "2026-08-05", changeFrequency: "monthly" as const, priority: .6 },
    { path: "/privacy/", lastModified: "2026-07-30", changeFrequency: "yearly" as const, priority: .3 },
    { path: "/terms/", lastModified: "2026-07-30", changeFrequency: "yearly" as const, priority: .3 },
  ];

  return pages.map(({ path, lastModified, changeFrequency, priority }) => ({
    url: new URL(path, SITE_URL).toString(),
    lastModified: new Date(lastModified),
    changeFrequency,
    priority,
  }));
}
