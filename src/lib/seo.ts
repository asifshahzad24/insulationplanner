import type { Metadata } from "next";
import { site } from "@/config/site";
import type { MarketId } from "@/engine/types";
import { MARKETS } from "@/markets/meta";
import { alternatesOf, pathOf, routeByGroup, type RouteEntry } from "@/routes/registry";
import type { PageContent } from "./content";

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

export function buildMetadata(entry: RouteEntry, content: PageContent): Metadata {
  const url = absoluteUrl(pathOf(entry));
  const meta = MARKETS[entry.market];
  return {
    title: { absolute: content.title },
    description: content.description,
    alternates: { canonical: url, languages: hreflangs(entry) },
    openGraph: {
      type: "website",
      url,
      title: content.title,
      description: content.description,
      siteName: site.name,
      locale: meta.lang.replace("-", "_"),
      images: [{ url: ogImageUrl(entry.market), width: 1200, height: 630, alt: site.name }],
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
export function webAppLd(entry: RouteEntry, content: PageContent) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: content.h1,
    url: absoluteUrl(pathOf(entry)),
    description: content.description,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    inLanguage: MARKETS[entry.market].lang,
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: entry.market === "us" ? "USD" : entry.market === "uk" ? "GBP" : "EUR" },
    publisher: { "@type": "Organization", name: site.name, url: site.url },
  };
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

export function faqLd(content: PageContent) {
  if (!content.faqs.length) return null;
  return {
    "@context": "https://schema.org",
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
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.path),
    })),
  };
}
