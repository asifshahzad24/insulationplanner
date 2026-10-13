import type { MarketData } from "@/engine/types";
import { rIP } from "@/engine/units";
import { fmtR } from "@/lib/format";

/**
 * Thermal R-value meter: hot (little insulation) → cold (well insulated).
 * The bar fills up to "after"; pins mark "now" (below) and "target" (above).
 */
export function RMeter({
  market,
  now,
  target,
  after,
  labels,
}: {
  market: Pick<MarketData, "rDisplay" | "locale">;
  now: number;
  target: number;
  after: number;
  labels: { now: string; target: string; after: string };
}) {
  const floor = market.rDisplay === "ip" ? rIP(70) : 12;
  const max = Math.max(floor, target * 1.15, after * 1.05);
  const pct = (r: number) => `${Math.min(100, Math.max(0, (r / max) * 100))}%`;
  // Keep edge labels inside the bar.
  const align = (r: number) => {
    const p = r / max;
    return p < 0.12 ? "translate-x-0" : p > 0.88 ? "-translate-x-full" : "-translate-x-1/2";
  };

  return (
    <figure className="my-5" aria-label={`${labels.now} ${fmtR(market, now)}, ${labels.target} ${fmtR(market, target)}, ${labels.after} ${fmtR(market, after)}`}>
      <div className="relative h-6 text-[11px] font-medium text-ink">
        <span className={`absolute bottom-0 whitespace-nowrap ${align(target)}`} style={{ left: pct(target) }}>
          {labels.target} {fmtR(market, target, false)}
        </span>
      </div>
      <div className="relative h-3 rounded-full bg-line">
        <div className="thermal-bar absolute inset-y-0 left-0 overflow-hidden rounded-full" style={{ width: "100%", clipPath: `inset(0 ${100 - (after / max) * 100}% 0 0 round 999px)` }} />
        <div
          className="absolute -top-1.5 h-6 w-[3px] -translate-x-1/2 rounded-full bg-ink ring-2 ring-surface"
          style={{ left: pct(target) }}
          aria-hidden
        />
        <div
          className="absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-surface bg-ink-2 shadow"
          style={{ left: pct(now) }}
          aria-hidden
        />
      </div>
      <div className="relative mt-1.5 h-5 font-mono text-[11px] text-muted">
        <span className={`absolute top-0 whitespace-nowrap ${align(now)}`} style={{ left: pct(now) }}>
          {labels.now} {fmtR(market, now, false)}
        </span>
      </div>
    </figure>
  );
}
