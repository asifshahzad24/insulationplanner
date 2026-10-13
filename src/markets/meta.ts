import type { MarketId } from "@/engine/types";

/** Lightweight per-market routing/locale info (no calculation data). */
export interface MarketMeta {
  id: MarketId;
  /** URL prefix, "" for the US root */
  prefix: "" | "/uk" | "/de" | "/fr";
  /** BCP 47 tag for <html lang> and hreflang */
  lang: "en-US" | "en-GB" | "de-DE" | "fr-FR";
  /** short code shown in the country switcher */
  code: string;
  /** country name in its own language */
  name: string;
}

export const MARKETS: Record<MarketId, MarketMeta> = {
  us: { id: "us", prefix: "", lang: "en-US", code: "US", name: "United States" },
  uk: { id: "uk", prefix: "/uk", lang: "en-GB", code: "UK", name: "United Kingdom" },
  de: { id: "de", prefix: "/de", lang: "de-DE", code: "DE", name: "Deutschland" },
  fr: { id: "fr", prefix: "/fr", lang: "fr-FR", code: "FR", name: "France" },
};

export const MARKET_IDS: MarketId[] = ["us", "uk", "de", "fr"];
