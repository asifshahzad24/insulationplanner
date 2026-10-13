// Plain-text shopping list (for "Copy" and the print view).
import type { CalcResult, MarketData, Product } from "@/engine/types";
import type { Dict } from "@/i18n";
import { plural, tpl } from "@/i18n";
import { fmtArea, fmtDepth, fmtMoneyRange, fmtR, type UnitSystem } from "@/lib/format";

export interface ShoppingLine {
  count?: number;
  unit?: string;
  text: string;
  detail?: string;
}

export function shoppingLines(
  result: CalcResult,
  product: Product,
  market: MarketData,
  dict: Dict,
  units: UnitSystem,
): ShoppingLine[] {
  const unitForms = product.packageUnit ? dict.result.packages[product.packageUnit] : undefined;
  if (result.layers.length) {
    // Merge identical layers (e.g. two layers of R-30).
    const merged = new Map<string, { count: number; layers: number; label: string; mm: number }>();
    for (const l of result.layers) {
      const key = `${l.mm}-${l.rSI}`;
      const prev = merged.get(key);
      const label = l.label ?? fmtR(market, l.rSI);
      merged.set(key, { count: (prev?.count ?? 0) + l.packages, layers: (prev?.layers ?? 0) + 1, label, mm: l.mm });
    }
    return [...merged.values()].map((m) => ({
      count: m.count,
      unit: unitForms ? plural(m.count, unitForms) : undefined,
      text: `${product.name} — ${m.label}, ${fmtDepth(market, units, m.mm)}`,
      detail: m.layers > 1 ? `× ${m.layers}` : undefined,
    }));
  }
  if (result.bags != null) {
    return [
      {
        count: result.bags,
        unit: unitForms ? plural(result.bags, unitForms) : undefined,
        text: product.name,
        detail:
          result.settledMm != null && Math.abs(result.depthMm - result.settledMm) > 1
            ? tpl(dict.result.settles, {
                installed: fmtDepth(market, units, result.depthMm),
                settled: fmtDepth(market, units, result.settledMm),
              })
            : fmtDepth(market, units, result.depthMm),
      },
    ];
  }
  return [{ text: product.name, detail: fmtDepth(market, units, result.depthMm) }];
}

export function shoppingText(args: {
  result: CalcResult;
  product: Product;
  market: MarketData;
  dict: Dict;
  units: UnitSystem;
  areaName: string;
  tierLabel: string;
  url: string;
  siteName: string;
}): string {
  const { result, product, market, dict, units, areaName, tierLabel, url, siteName } = args;
  const lines: string[] = [];
  lines.push(`${dict.shopping.title} — ${siteName}`);
  lines.push(tpl(dict.shopping.for, { area: fmtArea(market.locale, units, result.areaM2), areaName }));
  lines.push(`${dict.result.target}: ${fmtR(market, result.targetRSI)} (${tierLabel})`);
  lines.push("");
  for (const l of shoppingLines(result, product, market, dict, units)) {
    const qty = l.count != null ? `${l.count} ${l.unit ?? ""} × `.replace(/\s+×/, " ×") : "";
    lines.push(`• ${qty}${l.text}${l.detail ? ` (${l.detail})` : ""}`);
  }
  lines.push(`${dict.result.estCost}: ${fmtMoneyRange(market.locale, market.currency, result.cost.low, result.cost.high)}`);
  const extras = dict.shopping.extrasList[product.form];
  if (extras?.length) {
    lines.push("");
    lines.push(`${dict.shopping.extras}:`);
    for (const e of extras) lines.push(`• ${e}`);
  }
  lines.push("");
  lines.push(dict.shopping.safety);
  lines.push(tpl(dict.shopping.printedFrom, { site: siteName, url }));
  return lines.join("\n");
}
