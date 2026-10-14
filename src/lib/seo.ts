import type { Metadata } from "next";
import { site } from "@/config/site";
import type { MarketId } from "@/engine/types";
import { MARKETS } from "@/markets/meta";
import { alternatesOf, pathOf, routeByGroup, type RouteEntry } from "@/routes/registry";
import type { PageContent } from "./content";
import { isoDuration, type VideoInfo } from "./video";

export const absoluteUrl = (p: string) => `${site.url}${p === "/" ? "" : p}` || site.url;

/** hreflang map for a page: every market with the same group, plus x-default (US, else self). */
export function hreflangs(entry: RouteEntry): Record<string, string> {
  const map: Record<string, string> = {};
  for (const alt of alternatesOf(entry)) map[MARKETS[alt.market].lang] = absoluteUrl(pathOf(alt));
  const us = routeByGroup("us", entry.group);
  map["x-default"] = absoluteUrl(pathOf(us ?? entry));
  return map;
}

/** Per-market share image, generated at build time by src/app/og/<market>.png/route.tsx. */
export const ogImageUrl = (market: MarketId) => absoluteUrl(`/og/${market}.png`);

/** Guides and explainers. Legal pages and the contact form stay ordinary web pages. */
const isGuide = (entry: RouteEntry) =>
  entry.kind === "article" && !entry.legal && entry.group !== "contact" && entry.group !== "about" && entry.group !== "faq";

export function buildMetadata(entry: RouteEntry, content: PageContent): Metadata {
  const url = absoluteUrl(pathOf(entry));
  const meta = MARKETS[entry.market];
  const locale = meta.lang.replace("-", "_");
  const alternateLocale = alternatesOf(entry)
    .filter((alt) => alt.market !== entry.market)
    .map((alt) => MARKETS[alt.market].lang.replace("-", "_"));
  const guide = isGuide(entry);
  return {
    title: { absolute: content.title },
    description: content.description,
    alternates: { canonical: url, languages: hreflangs(entry) },
    // Large image and video previews in Google. Without these, Discover and video results stay small.
    robots: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
    openGraph: {
      type: guide ? "article" : "website",
      url,
      title: content.title,
      description: content.description,
      siteName: site.name,
      locale,
      alternateLocale,
      images: [{ url: ogImageUrl(entry.market), width: 1200, height: 630, alt: site.name }],
      ...(guide ? { publishedTime: site.published, modifiedTime: site.updated } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: content.title,
      description: content.description,
      images: [ogImageUrl(entry.market)],
    },
  };
}

/** Where the country switcher should send you: the same page in that market, else its home. */
export function switcherLinks(entry: RouteEntry | undefined): Record<MarketId, string> {
  const out = {} as Record<MarketId, string>;
  for (const id of Object.keys(MARKETS) as MarketId[]) {
    const alt = entry ? routeByGroup(id, entry.group) : undefined;
    out[id] = alt ? pathOf(alt) : MARKETS[id].prefix || "/";
  }
  return out;
}

// ── JSON-LD ─────────────────────────────────────────────────────────────────
const ORG_ID = `${site.url}/#organization`;
const WEBSITE_ID = `${site.url}/#website`;

/** The image Google should treat as the page's main one (search thumbnails). */
export interface PageImage {
  url: string;
  width: number;
  height: number;
  caption?: string;
}

const pageKind = (entry: RouteEntry): string => {
  if (entry.group === "about") return "AboutPage";
  if (entry.group === "contact") return "ContactPage";
  return "WebPage";
};

/**
 * One connected graph: Organization, WebSite, the page, and (when present) the tool,
 * the guide, the walkthrough video, the FAQ and the breadcrumb.
 * Same Organization/WebSite ids on every page, so Google merges them into one entity.
 */
export function pageGraphLd(
  entry: RouteEntry,
  content: PageContent,
  image: PageImage,
  extras: { isTool: boolean; crumbs: { name: string; path: string }[]; video: VideoInfo | null },
) {
  const url = absoluteUrl(pathOf(entry));
  const pageId = `${url}#webpage`;
  const appId = `${url}#app`;
  const articleId = `${url}#article`;
  const videoId = `${url}#video`;
  const crumbId = `${url}#breadcrumb`;
  const guide = isGuide(entry);
  const lang = MARKETS[entry.market].lang;
  const graph: object[] = [
    {
      "@type": "Organization",
      "@id": ORG_ID,
      name: site.name,
      url: `${site.url}/`,
      email: site.email,
      description: "Free insulation calculators for homeowners in the United States, United Kingdom, Germany and France.",
      logo: { "@type": "ImageObject", url: absoluteUrl("/icon-512.png"), width: 512, height: 512 },
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: site.email,
        availableLanguage: ["English", "German", "French"],
      },
      areaServed: ["US", "GB", "DE", "FR"],
    },
    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      name: site.name,
      alternateName: "LoftInsulationCalc",
      url: `${site.url}/`,
      inLanguage: Object.values(MARKETS).map((m) => m.lang),
      publisher: { "@id": ORG_ID },
    },
    {
      "@type": pageKind(entry),
      "@id": pageId,
      url,
      name: content.title,
      description: content.description,
      inLanguage: lang,
      isPartOf: { "@id": WEBSITE_ID },
      publisher: { "@id": ORG_ID },
      datePublished: site.published,
      dateModified: site.updated,
      primaryImageOfPage: {
        "@type": "ImageObject",
        contentUrl: image.url,
        url: image.url,
        width: image.width,
        height: image.height,
        caption: image.caption,
      },
      ...(extras.crumbs.length ? { breadcrumb: { "@id": crumbId } } : {}),
      ...(extras.isTool ? { mainEntity: { "@id": appId } } : {}),
      ...(guide ? { mainEntity: { "@id": articleId } } : {}),
      ...(extras.video ? { subjectOf: { "@id": videoId } } : {}),
    },
  ];

  if (extras.isTool) {
    graph.push({
      "@type": "WebApplication",
      "@id": appId,
      name: content.h1,
      url,
      description: content.description,
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Any",
      browserRequirements: "Requires a modern web browser",
      inLanguage: lang,
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: entry.market === "us" ? "USD" : entry.market === "uk" ? "GBP" : "EUR" },
      screenshot: ogImageUrl(entry.market),
      publisher: { "@id": ORG_ID },
    });
  }

  if (guide) {
    graph.push({
      "@type": "TechArticle",
      "@id": articleId,
      headline: content.h1,
      name: content.title,
      description: content.description,
      inLanguage: lang,
      datePublished: site.published,
      dateModified: site.updated,
      image: image.url,
      author: { "@id": ORG_ID },
      publisher: { "@id": ORG_ID },
      mainEntityOfPage: { "@id": pageId },
    });
  }

  if (extras.video) {
    const v = extras.video;
    graph.push({
      "@type": "VideoObject",
      "@id": videoId,
      name: v.name,
      description: v.description,
      thumbnailUrl: v.thumbnailUrl,
      contentUrl: v.contentUrl,
      uploadDate: v.uploadDate,
      duration: isoDuration(v.durationSec),
      inLanguage: v.inLanguage,
      caption: { "@type": "MediaObject", contentUrl: v.captionUrl, encodingFormat: "text/vtt", inLanguage: v.inLanguage },
      publisher: { "@id": ORG_ID },
      isPartOf: { "@id": pageId },
    });
  }

  const faq = faqNode(content);
  if (faq) graph.push(faq);
  if (extras.crumbs.length) graph.push({ ...breadcrumbLd(extras.crumbs), "@id": crumbId });

  return { "@context": "https://schema.org", "@graph": graph };
}

/** Rendered HTML → plain text for JSON-LD (no Markdown syntax or tags). */
const plainText = (html: string) =>
  html
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();

function faqNode(content: PageContent) {
  if (!content.faqs.length) return null;
  return {
    "@type": "FAQPage",
    mainEntity: content.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: plainText(f.html) },
    })),
  };
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.path),
    })),
  };
}
