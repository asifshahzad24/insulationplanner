import type { LoosefillChartRow } from "./types";

/**
 * Linear interpolation on a manufacturer coverage chart, by R.
 * Returns null outside the chart's R range (caller falls back to physics).
 */
export function chartLookup(chart: LoosefillChartRow[] | undefined, rSI: number): LoosefillChartRow | null {
  if (!chart || chart.length === 0) return null;
  const rows = [...chart].sort((a, b) => a.rSI - b.rSI);
  const eps = 1e-9;
  if (rSI < rows[0].rSI - eps || rSI > rows[rows.length - 1].rSI + eps) return null;
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (Math.abs(row.rSI - rSI) <= eps) return row;
    const next = rows[i + 1];
    if (next && rSI > row.rSI && rSI < next.rSI) {
      const t = (rSI - row.rSI) / (next.rSI - row.rSI);
      const lerp = (a: number, b: number) => a + (b - a) * t;
      return {
        rSI,
        m2PerBag: lerp(row.m2PerBag, next.m2PerBag),
        settledMm: lerp(row.settledMm, next.settledMm),
        installedMm: lerp(row.installedMm, next.installedMm),
      };
    }
  }
  return null;
}

/** Bags from physics: area × settled thickness × settled density ÷ bag mass. */
export function loosefillBags(quantityAreaM2: number, settledMm: number, settledDensity: number, bagKg: number): number {
  const kg = quantityAreaM2 * (settledMm / 1000) * settledDensity;
  return Math.ceil(kg / bagKg - 1e-9);
}
