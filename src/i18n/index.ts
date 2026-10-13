import type { MarketId } from "@/engine/types";
import de from "./de";
import enGB from "./en-GB";
import enUS, { type Dict } from "./en-US";
import fr from "./fr";

export type { Dict };

const DICTS: Record<MarketId, Dict> = { us: enUS, uk: enGB, de, fr };

export const getDict = (market: MarketId): Dict => DICTS[market];

/** Fill {placeholders} in a template string. */
export function tpl(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (m, key: string) => (key in vars ? String(vars[key]) : m));
}

/** Pick singular/plural from a [one, other] pair. */
export const plural = (n: number, forms: readonly string[]): string => (n === 1 ? forms[0] : forms[1]);
