// Shared logic for the per-market route files in src/app.
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageView } from "@/components/site/PageView";
import type { MarketId } from "@/engine/types";
import { getContent } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { findRoute, routesFor } from "./registry";

/** generateStaticParams for app/<market>/[slug] */
export const slugParams = (market: MarketId) =>
  routesFor(market)
    .filter((e) => e.slug !== "")
    .map((e) => ({ slug: e.slug }));

export function pageMetadata(market: MarketId, slug: string): Metadata {
  const entry = findRoute(market, slug);
  if (!entry) return {};
  return buildMetadata(entry, getContent(entry));
}

export function MarketPage({ market, slug }: { market: MarketId; slug: string }) {
  const entry = findRoute(market, slug);
  if (!entry) notFound();
  return <PageView entry={entry} />;
}
