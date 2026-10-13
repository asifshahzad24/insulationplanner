// Worked-example CLI for content writers, so article numbers always match the calculator.
//
//   npm run calc -- --market us --area attic --size 1200 --zone 5A --product cellulose
//   npm run calc -- --market de --area attic --size 80 --product <id> --existing-depth 8 --existing-mat <id>
//   npm run calc -- --market us --list        (show tiers, products, existing materials)
//
// --size is sq ft for US markets, m² otherwise. Depths are inches (US) or the market's mm/cm.
import { calculate } from "../src/engine/calculate";
import type { AreaType, CalcInput, MarketId } from "../src/engine/types";
import { inches, rIP, sqft, toRIP } from "../src/engine/units";
import { fmtArea, fmtDepth, fmtMoneyRange, fmtR, fmtU } from "../src/lib/format";
import type { MarketData } from "../src/engine/types";

const args = process.argv.slice(2);
const flag = (name: string) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
};

async function main() {
const id = (flag("market") ?? "us") as MarketId;
// Load one market directly so the CLI works even while other markets are being edited.
const market: MarketData = (await import(`../src/markets/${id}/index.ts`))[id];
const imperial = market.defaultUnits === "imperial";
const units = imperial ? "imperial" : "metric";

if (args.includes("--list")) {
  console.log(`Market ${market.id} (${market.locale}, ${market.currency})`);
  console.log(`Areas: ${market.areas.join(", ")}`);
  console.log(`Tiers: ${market.tiers.map((t) => `${t.id} (${t.label})`).join(", ")}`);
  for (const p of market.products) console.log(`Product ${p.id}: ${p.name} [${p.areas.join(", ")}]`);
  for (const e of market.existing) console.log(`Existing ${e.id}: ${e.label}`);
  return;
}

const area = (flag("area") ?? market.areas[0]) as AreaType;
const size = Number(flag("size") ?? (imperial ? 1000 : 100));
const depthToMm = (v: number) => (imperial ? inches(v) : market.metricDepthUnit === "cm" ? v * 10 : v);

let existing: CalcInput["existing"] = { kind: "none" };
if (flag("existing-depth")) {
  existing = { kind: "thickness", mm: depthToMm(Number(flag("existing-depth"))), materialId: flag("existing-mat") ?? market.existing[0].id };
} else if (flag("existing-r")) {
  const r = Number(flag("existing-r"));
  existing = { kind: "r", rSI: market.rDisplay === "ip" ? rIP(r) : r };
} else if (flag("existing-u")) {
  existing = { kind: "u", u: Number(flag("existing-u")) };
}

const input: CalcInput = {
  area,
  areaM2: imperial ? sqft(size) : size,
  existing,
  tierId: flag("tier") ?? market.defaultTier,
  zone: flag("zone") ?? market.defaultZone,
  productId: flag("product") ?? market.defaultProduct[area]!,
  wastePct: Number(flag("waste") ?? market.defaultWastePct),
  cavityMm: flag("cavity") ? depthToMm(Number(flag("cavity"))) : undefined,
};

const r = calculate(input, market);
const product = market.products.find((p) => p.id === input.productId)!;
const D = (mm: number) => fmtDepth(market, units, mm);

console.log(`Input: ${JSON.stringify({ ...input, areaM2: Number(input.areaM2.toFixed(2)) })}`);
console.log(`Status: ${r.status}${r.warnings.length ? `  warnings: ${r.warnings.join(", ")}` : ""}`);
console.log(`Area ${fmtArea(market.locale, units, r.areaM2)} (+waste → ${fmtArea(market.locale, units, r.quantityAreaM2)})`);
console.log(`Target ${fmtR(market, r.targetRSI)}${r.targetU != null ? ` (U ≤ ${fmtU(market.locale, r.targetU)})` : ""}`);
console.log(`Existing ${fmtR(market, r.existingRSI)}${r.currentU != null ? `, U now ${fmtU(market.locale, r.currentU)}` : ""}`);
if (r.status === "ok") {
  console.log(`Add depth ${D(r.depthMm)}${r.settledMm != null && Math.abs(r.settledMm - r.depthMm) > 1 ? ` (settles to ${D(r.settledMm)})` : ""}`);
  console.log(`After ${fmtR(market, r.afterRSI)}${r.afterU != null ? `, U after ${fmtU(market.locale, r.afterU)}` : ""}`);
  for (const l of r.layers) console.log(`  Layer ${l.label ?? fmtR(market, l.rSI)} ${D(l.mm)}: ${l.packages} × ${product.packageUnit}`);
  if (r.bags != null) console.log(`  ${r.bags} bags of ${product.name}`);
  console.log(`Cost ${fmtMoneyRange(market.locale, market.currency, r.cost.low, r.cost.high)} (${product.name})`);
  if (imperial) console.log(`(R added ≈ R-${toRIP(r.addedRSI).toFixed(1)})`);
}
}

main();
