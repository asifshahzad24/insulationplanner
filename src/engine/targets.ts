import type { AreaType, MarketData, TargetTier } from "./types";

/**
 * Zone lookup keys from most to least specific.
 * US IECC: "5A" → ["5A", "5"], marine "4C" → ["4C", "4"]. FR: "H1b" → ["H1b", "H1"].
 */
export function zoneKeys(zone: string): string[] {
  const us = /^(\d)([ABC])$/i.exec(zone);
  if (us) return [zone, us[1]];
  const fr = /^(H\d)([a-d])$/i.exec(zone);
  if (fr) return [zone, fr[1]];
  return [zone];
}

export function resolveTarget(
  market: MarketData,
  tierId: string,
  area: AreaType,
  zone?: string,
): { tier: TargetTier; value: number } | null {
  const tier = market.tiers.find((t) => t.id === tierId);
  if (!tier) return null;
  if (tier.byZone) {
    const z = zone ?? market.defaultZone;
    if (!z) return null;
    for (const key of zoneKeys(z)) {
      const value = tier.byZone[key]?.[area];
      if (value != null) return { tier, value };
    }
    return null;
  }
  const value = tier.values?.[area];
  return value == null ? null : { tier, value };
}
