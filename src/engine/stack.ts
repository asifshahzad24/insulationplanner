// Effective thermal resistance of insulation layers stacked inside an element.
// Layers fill from the bottom. The first `framingMm` sit between joists/studs/rafters,
// where heat also flows through the timber. That part uses the parallel-path
// conductivity λ_eff = (1 − f)·λ + f·λ_timber. Everything above the framing is plain d/λ.

/** Softwood timber conductivity, W/m·K (EN ISO 10456 typical value). */
export const LAMBDA_TIMBER = 0.13;

export interface StackLayer {
  mm: number;
  lambda: number;
}

export interface Framing {
  framingMm: number;
  timberFraction: number;
}

export function stackR(layers: StackLayer[], framing?: Framing): number {
  const framedDepth = framing && framing.timberFraction > 0 ? framing.framingMm : 0;
  const f = framing?.timberFraction ?? 0;
  let position = 0;
  let r = 0;
  for (const { mm, lambda } of layers) {
    if (mm <= 0) continue;
    const framed = Math.max(0, Math.min(mm, framedDepth - position));
    const free = mm - framed;
    if (framed > 0) r += framed / 1000 / ((1 - f) * lambda + f * LAMBDA_TIMBER);
    if (free > 0) r += free / 1000 / lambda;
    position += mm;
  }
  return r;
}
