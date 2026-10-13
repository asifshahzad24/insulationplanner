import type { Thickness } from "./types";

export interface Selection {
  picks: Thickness[];
  rSI: number;
  met: boolean;
}

interface Options {
  /** R the stack must reach (effective, as computed by evalR) */
  target: number;
  /** effective R of a candidate stack (existing insulation included) */
  evalR: (picks: Thickness[]) => number;
  quantityAreaM2: number;
  /** max total thickness of the new stack, e.g. remaining cavity depth */
  maxMm?: number;
  maxLayers?: number;
}

const EPS = 1e-9;

/** All multisets of 1..maxLayers options (index non-decreasing), thickest first within a stack. */
function* combos(options: Thickness[], maxLayers: number): Generator<Thickness[]> {
  const sorted = [...options].sort((a, b) => b.mm - a.mm);
  function* rec(start: number, current: Thickness[]): Generator<Thickness[]> {
    if (current.length > 0) yield current;
    if (current.length === maxLayers) return;
    for (let i = start; i < sorted.length; i++) yield* rec(i, [...current, sorted[i]]);
  }
  yield* rec(0, []);
}

const packagesOf = (picks: Thickness[], area: number) =>
  picks.reduce((n, p) => n + Math.ceil(area / p.coverageM2 - EPS), 0);
const costOf = (picks: Thickness[], area: number) =>
  picks.reduce((c, p) => c + Math.ceil(area / p.coverageM2 - EPS) * p.price.low, 0);
const mmOf = (picks: Thickness[]) => picks.reduce((s, p) => s + p.mm, 0);

/**
 * Pick a stack of standard thicknesses that reaches the target.
 * Preference: fewest layers → thinnest → fewest packages → cheapest.
 * If nothing reaches the target (within maxMm), return the highest-R stack that fits.
 */
export function selectLayers(options: Thickness[], { target, evalR, quantityAreaM2, maxMm, maxLayers = 3 }: Options): Selection {
  let best: { picks: Thickness[]; r: number; key: number[] } | null = null;
  let fallback: { picks: Thickness[]; r: number; key: number[] } | null = null;

  const less = (a: number[], b: number[]) => {
    for (let i = 0; i < a.length; i++) {
      if (Math.abs(a[i] - b[i]) > EPS) return a[i] < b[i];
    }
    return false;
  };

  for (const picks of combos(options, maxLayers)) {
    const mm = mmOf(picks);
    if (maxMm != null && mm > maxMm + EPS) continue;
    const r = evalR(picks);
    if (r >= target - EPS) {
      const key = [picks.length, mm, packagesOf(picks, quantityAreaM2), costOf(picks, quantityAreaM2)];
      if (!best || less(key, best.key)) best = { picks, r, key };
    } else {
      const key = [-r, picks.length, mm];
      if (!fallback || less(key, fallback.key)) fallback = { picks, r, key };
    }
  }

  if (best) return { picks: best.picks, rSI: best.r, met: true };
  if (fallback) return { picks: fallback.picks, rSI: fallback.r, met: false };
  return { picks: [], rSI: evalR([]), met: false };
}
