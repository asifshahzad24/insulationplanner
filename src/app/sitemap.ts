import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { absoluteUrl, hreflangs } from "@/lib/seo";
import { pathOf, ROUTES } from "@/routes/registry";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((entry) => {
    const languages = hreflangs(entry);
    delete languages["x-default"];
    return {
      url: absoluteUrl(pathOf(entry)),
      lastModified: site.updated,
      changeFrequency: entry.kind === "article" && entry.priority && entry.priority < 0.5 ? "yearly" : "monthly",
      priority: entry.priority ?? 0.5,
      alternates: { languages },
    };
  });
}
