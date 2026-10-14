// Self-hosted walkthroughs on the four home pages (public/video/<market>.mp4).
// Duration is read from the MP4 at build time so JSON-LD and the sitemap stay in step with the file.
import fs from "node:fs";
import path from "node:path";
import { site } from "@/config/site";
import type { MarketId } from "@/engine/types";
import { getDict } from "@/i18n";
import { MARKETS } from "@/markets/meta";

const abs = (p: string) => `${site.url}${p}`;

const durationCache = new Map<string, number>();

/** Rounded length of public/video/<market>.mp4, from the mvhd atom. */
export function videoDurationSec(market: MarketId): number {
  const hit = durationCache.get(market);
  if (hit != null) return hit;
  const file = path.join(process.cwd(), "public", "video", `${market}.mp4`);
  const buf = fs.readFileSync(file);
  const i = buf.indexOf(Buffer.from("mvhd"));
  if (i < 0) throw new Error(`No mvhd atom in ${file}`);
  const version = buf[i + 4];
  const seconds =
    version === 1
      ? Number(buf.readBigUInt64BE(i + 28)) / buf.readUInt32BE(i + 24)
      : buf.readUInt32BE(i + 20) / buf.readUInt32BE(i + 16);
  const rounded = Math.round(seconds);
  if (!Number.isFinite(rounded) || rounded < 1) throw new Error(`Bad duration for ${file}`);
  durationCache.set(market, rounded);
  return rounded;
}

export function isoDuration(seconds: number): string {
  return `PT${seconds}S`;
}

export interface VideoInfo {
  name: string;
  description: string;
  contentUrl: string;
  thumbnailUrl: string;
  captionUrl: string;
  durationSec: number;
  uploadDate: string;
  inLanguage: string;
}

/** Copy and file URLs for one market's home-page walkthrough. */
export function videoInfo(market: MarketId): VideoInfo {
  const page = getDict(market).page;
  return {
    name: page.videoTitle,
    description: page.videoDesc,
    contentUrl: abs(`/video/${market}.mp4`),
    thumbnailUrl: abs(`/video/${market}-poster.jpg`),
    captionUrl: abs(`/video/${market}.vtt`),
    durationSec: videoDurationSec(market),
    uploadDate: `${site.published}T00:00:00Z`,
    inLanguage: MARKETS[market].lang,
  };
}

/** Google video-sitemap fields for a home page. */
export function videoSitemapEntry(market: MarketId) {
  const v = videoInfo(market);
  return {
    title: v.name,
    description: v.description,
    thumbnail_loc: v.thumbnailUrl,
    content_loc: v.contentUrl,
    duration: v.durationSec,
    publication_date: v.uploadDate,
    family_friendly: "yes" as const,
    requires_subscription: "no" as const,
    live: "no" as const,
    // `info` is required. Next omits the attribute by writing the word "undefined" when it is missing.
    uploader: { info: `${site.url}/`, content: site.name },
  };
}
