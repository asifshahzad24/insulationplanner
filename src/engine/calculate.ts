import { chartLookup, loosefillBags } from "./loosefill";
import { selectLayers } from "./select";
import { stackR, type Framing, type StackLayer } from "./stack";
import { resolveTarget } from "./targets";
import type { CalcInput, CalcResult, Layer, MarketData, MathStep, PriceRange, Thickness, WarningCode } from "./types";

const EPS = 1e-9;

const layerOf = (t: Thickness): StackLayer => ({ mm: t.mm, lambda: t.mm / 1000 / t.rSI });

/** Smallest thickness (mm) for which evalR reaches target. evalR must increase with mm. */
function solveMm(evalR: (mm: number) => number, target: number): number {
  let lo = 0;
  let hi = 100;
  while (evalR(hi) < target && hi < 1e6) hi *= 2;
  for (let i = 0; i < 80; i++) {
    const mid = (lo + hi) / 2;
    if (evalR(mid) >= target) hi = mid;
    else lo = mid;
  }
  return hi;
}

export function calculate(input: CalcInput, market: MarketData): CalcResult {
  const warnings: WarningCode[] = [];
  const quantityAreaM2 = input.areaM2 * (1 + Math.max(0, input.wastePct) / 100);
  const product = market.products.find((p) => p.id === input.productId);
  const target = resolveTarget(market, input.tierId, input.area, input.zone);
  const basis = target?.tier.basis ?? "insulationR";
  const conv = market.conventions[input.area];

  const blank = (status: CalcResult["status"]): CalcResult => ({
    status,
    basis,
    areaM2: input.areaM2,
    quantityAreaM2,
    targetRSI: 0,
    existingRSI: 0,
    afterRSI: 0,
    addedRSI: 0,
    shortfallRSI: 0,
    depthMm: 0,
    layers: [],
    packages: 0,
    packageUnit: product?.packageUnit,
    cost: { low: 0, high: 0 },
    warnings,
    steps: [],
  });

  if (!(input.areaM2 > 0) || !product) return blank("invalid");
  if (!target || (basis === "elementU" && !conv)) {
    warnings.push("noTarget");
    return blank("invalid");
  }

  // ── Target as effective insulation R ────────────────────────────────────────
  const rOther = basis === "elementU" && conv ? conv.rsi + conv.rse + conv.rStructure : 0;
  const targetRSI = basis === "elementU" ? 1 / target.value - rOther : target.value;
  const framing: Framing | undefined =
    basis === "elementU" && conv
      ? { framingMm: input.cavityMm ?? conv.framingMm, timberFraction: conv.timberFraction }
      : undefined;

  // ── Existing insulation ────────────────────────────────────────────────────
  let existingLayers: StackLayer[] = [];
  let existingFixedR = 0;
  let existingMm = 0;
  const ex = input.existing;
  if (ex.kind === "thickness" && ex.mm > 0) {
    const mat = market.existing.find((m) => m.id === ex.materialId);
    if (mat) {
      existingLayers = [{ mm: ex.mm, lambda: mat.lambda }];
      existingMm = ex.mm;
      if (mat.warning) warnings.push(mat.warning);
    }
  } else if (ex.kind === "r") {
    existingFixedR = Math.max(0, ex.rSI);
  } else if (ex.kind === "u" && ex.u > 0) {
    existingFixedR = Math.max(0, 1 / ex.u - rOther);
  }
  const existingStackR = stackR(existingLayers, framing);
  const existingRSI = existingFixedR + existingStackR;
  // Grant rules like the French CEE count only the new layer: it must reach the target on its own.
  const newOnly = Boolean(target.tier.newOnly) && basis === "insulationR";
  const goalRSI = newOnly ? targetRSI + existingRSI : targetRSI;

  /** Effective insulation R once `added` is installed on top of what is there. */
  const rWith = (added: StackLayer[]): number => {
    if (basis === "insulationR") return existingRSI + stackR(added);
    if (product.betweenFraming) return existingFixedR + stackR([...existingLayers, ...added], framing);
    return existingRSI + stackR(added);
  };

  const uOf = (r: number) => (basis === "elementU" ? 1 / (rOther + r) : undefined);
  const priced = (unitPrice: PriceRange, count: number): PriceRange =>
    input.priceOverride != null
      ? { low: input.priceOverride * count, high: input.priceOverride * count }
      : { low: unitPrice.low * count, high: unitPrice.high * count };

  const steps: MathStep[] = [
    {
      key: "target",
      values: { basis, targetRSI, newOnly: newOnly ? 1 : 0, ...(basis === "elementU" ? { targetU: target.value, rOther } : {}) },
    },
    { key: "existing", values: { existingRSI } },
    { key: "add", values: { addRSI: Math.max(0, goalRSI - existingRSI) } },
  ];

  const base = {
    basis,
    areaM2: input.areaM2,
    quantityAreaM2,
    targetRSI: goalRSI,
    existingRSI,
    targetU: basis === "elementU" ? target.value : undefined,
    currentU: uOf(existingRSI),
    packageUnit: product.packageUnit,
    warnings,
  };

  if (existingRSI >= goalRSI - EPS) {
    return {
      ...blank("alreadyMet"),
      ...base,
      afterRSI: existingRSI,
      afterU: uOf(existingRSI),
      steps,
    };
  }

  steps.push({ key: "quantityArea", values: { areaM2: input.areaM2, wastePct: input.wastePct, quantityAreaM2 } });
  const maxNewMm = input.cavityMm != null ? Math.max(0, input.cavityMm - existingMm) : undefined;

  // ── Layered products: batts, rolls, boards ─────────────────────────────────
  if ((product.form === "batt" || product.form === "roll" || product.form === "board") && product.thicknesses) {
    const sel = selectLayers(product.thicknesses, {
      target: goalRSI,
      evalR: (picks) => rWith(picks.map(layerOf)),
      quantityAreaM2,
      maxMm: maxNewMm,
    });
    const layers: Layer[] = sel.picks.map((t) => {
      const packages = Math.ceil(quantityAreaM2 / t.coverageM2 - EPS);
      return { mm: t.mm, rSI: t.rSI, label: t.label, packages, coverageM2: t.coverageM2, cost: priced(t.price, packages) };
    });
    const afterRSI = rWith(sel.picks.map(layerOf));
    if (!sel.met) warnings.push(maxNewMm != null ? "cavityLimit" : "targetNotReached");
    const cost = layers.reduce<PriceRange>((c, l) => ({ low: c.low + l.cost.low, high: c.high + l.cost.high }), { low: 0, high: 0 });
    const packages = layers.reduce((n, l) => n + l.packages, 0);
    steps.push({ key: "layers", values: { count: layers.length, packages, depthMm: layers.reduce((s, l) => s + l.mm, 0) } });
    steps.push({ key: "cost", values: { ...cost, currency: market.currency } });
    return {
      ...base,
      status: "ok",
      afterRSI,
      afterU: uOf(afterRSI),
      addedRSI: sel.picks.reduce((s, t) => s + t.rSI, 0),
      shortfallRSI: Math.max(0, goalRSI - afterRSI),
      depthMm: layers.reduce((s, l) => s + l.mm, 0),
      layers,
      packages,
      cost,
      steps,
    };
  }

  // ── Continuous products: loose-fill and spray ──────────────────────────────
  const lambda = product.lambda;
  const neededR = goalRSI - existingRSI;
  let settledMm =
    basis === "insulationR" ? neededR * lambda * 1000 : solveMm((mm) => rWith([{ mm, lambda }]), goalRSI);
  let capped = false;
  if (maxNewMm != null && settledMm > maxNewMm + EPS) {
    settledMm = maxNewMm;
    capped = true;
    warnings.push("cavityLimit");
  }

  if (product.form === "loosefill" && product.loosefill) {
    const lf = product.loosefill;
    const row = !capped && basis === "insulationR" ? chartLookup(lf.chart, neededR) : null;
    const bags = row
      ? Math.ceil(quantityAreaM2 / row.m2PerBag - EPS)
      : loosefillBags(quantityAreaM2, settledMm, lf.settledDensity, lf.bagKg);
    if (row) settledMm = row.settledMm;
    // Dense-packed cavities don't settle; open blows are installed higher than their settled depth.
    const installedMm = row ? row.installedMm : capped ? settledMm : settledMm * (1 + lf.settlingPct / 100);
    const afterRSI = row ? existingRSI + neededR : rWith([{ mm: settledMm, lambda }]);
    const cost = priced(lf.price, bags);
    steps.push({ key: "loosefill", values: { settledMm, installedMm, bags, chart: row ? "chart" : "physics" } });
    steps.push({ key: "cost", values: { ...cost, currency: market.currency } });
    return {
      ...base,
      status: "ok",
      afterRSI,
      afterU: uOf(afterRSI),
      addedRSI: row ? neededR : settledMm / 1000 / lambda,
      shortfallRSI: Math.max(0, goalRSI - afterRSI),
      depthMm: installedMm,
      settledMm,
      layers: [],
      bags,
      packages: bags,
      cost,
      steps,
    };
  }

  if (product.form === "spray" && product.spray) {
    const afterRSI = rWith([{ mm: settledMm, lambda }]);
    const cost = priced(product.spray.pricePerM2Mm, input.areaM2 * settledMm);
    steps.push({ key: "spray", values: { depthMm: settledMm } });
    steps.push({ key: "cost", values: { ...cost, currency: market.currency } });
    return {
      ...base,
      status: "ok",
      afterRSI,
      afterU: uOf(afterRSI),
      addedRSI: settledMm / 1000 / lambda,
      shortfallRSI: Math.max(0, goalRSI - afterRSI),
      depthMm: settledMm,
      layers: [],
      packages: 0,
      cost,
      steps,
    };
  }

  return blank("invalid");
}
