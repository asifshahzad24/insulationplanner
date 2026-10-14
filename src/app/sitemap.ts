import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { ATTIC_DIAGRAM_GROUPS, atticDiagramPath } from "@/lib/diagrams";
import { absoluteUrl, hreflangs } from "@/lib/seo";
import { videoSitemapEntry } from "@/lib/video";
import { pathOf, ROUTES } from "@/routes/registry";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((entry) => {
    return {
      url: absoluteUrl(pathOf(entry)),
      lastModified: site.updated,
      changeFrequency: entry.kind === "article" && entry.priority && entry.priority < 0.5 ? "yearly" : "monthly",
      priority: entry.priority ?? 0.5,
      alternates: { languages: hreflangs(entry) },
      ...(ATTIC_DIAGRAM_GROUPS.includes(entry.group) ? { images: [absoluteUrl(atticDiagramPath(entry.market))] } : {}),
      ...(entry.group === "home" ? { videos: [videoSitemapEntry(entry.market)] } : {}),
    };
  });
}
