// Data tables generated from market data at build time.
import type { AreaType, MarketData } from "@/engine/types";
import { rIP, uFromR } from "@/engine/units";
import type { Dict } from "@/i18n";
import { fmtDepth, fmtNum, fmtR, fmtU } from "@/lib/format";

/** Depth needed for common R targets, one column per insulation type. */
export function ThicknessChart({ market, dict }: { market: MarketData; dict: Dict }) {
  const imperial = market.defaultUnits === "imperial";
  const targets = imperial ? [11, 13, 15, 19, 21, 30, 38, 49, 60].map(rIP) : [1, 2, 3, 4, 5, 6, 7, 8];
  // One column per distinct material/λ (skip duplicates).
  const seen = new Set<string>();
  const cols = market.products.filter((p) => {
    const key = `${p.material}-${p.lambda.toFixed(4)}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  const units = imperial ? "imperial" : "metric";
  return (
    <section className="mt-12" aria-labelledby="thickness-title">
      <h2 id="thickness-title" className="font-display text-[1.6rem] font-bold tracking-tight text-ink">
        {dict.tables.thicknessTitle}
      </h2>
      <p className="mt-2 max-w-2xl text-muted">{dict.tables.thicknessIntro}</p>
      <div className="mt-5 overflow-x-auto rounded-2xl border border-line bg-surface">
        <table className="w-full min-w-[640px] border-collapse text-sm tabular">
          <thead>
            <tr className="bg-canvas text-left">
              <th scope="col" className="sticky left-0 bg-canvas px-4 py-3 font-semibold text-ink">
                R
              </th>
              {cols.map((p) => (
                <th key={p.id} scope="col" className="px-4 py-3 font-semibold text-ink">
                  {market.materialLabels[p.material] ?? p.name}
                  <span className="block text-xs font-normal text-muted">λ {fmtNum(market.locale, p.lambda, 3)}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {targets.map((r) => (
              <tr key={r} className="border-t border-line">
                <th scope="row" className="sticky left-0 bg-surface px-4 py-2.5 text-left font-mono font-semibold text-ink">
                  {fmtR(market, r)}
                  {!imperial ? <span className="block text-xs font-normal text-muted">U ≈ {fmtU(market.locale, uFromR(r))}</span> : null}
                </th>
                {cols.map((p) => (
                  <td key={p.id} className="px-4 py-2.5 font-mono text-ink-2">
                    {fmtDepth(market, units, r * p.lambda * 1000)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/** Target levels: US by climate zone; EU markets by area and tier. */
export function TargetsTable({ market, dict }: { market: MarketData; dict: Dict }) {
  const areaLabel = (a: AreaType) => dict.calc.areas[a];
  const fmt = (basis: "insulationR" | "elementU", v: number | undefined) =>
    v == null ? "—" : basis === "elementU" ? fmtU(market.locale, v) : fmtR(market, v);

  if (market.zoneKind === "usClimate") {
    const tier = market.tiers[0];
    // IECC rows: marine 4C is the only moisture split with its own values.
    const zones = ["1", "2", "3", "4", "4C", "5", "6", "7", "8"];
    const value = (zone: string, area: AreaType) => {
      const row = tier.byZone?.[zone] ?? tier.byZone?.[zone.replace(/\D/g, "")];
      return row?.[area];
    };
    const areas = market.areas.filter((a) => a !== "roof");
    return (
      <section className="mt-12" aria-labelledby="targets-title">
        <h2 id="targets-title" className="font-display text-[1.6rem] font-bold tracking-tight text-ink">
          {dict.tables.targetsTitle}
        </h2>
        <p className="mt-2 text-muted">{tier.label}</p>
        <div className="mt-5 overflow-x-auto rounded-2xl border border-line bg-surface">
          <table className="w-full min-w-[560px] border-collapse text-sm tabular">
            <thead>
              <tr className="bg-canvas text-left">
                <th scope="col" className="px-4 py-3 font-semibold text-ink">
                  {dict.tables.zone}
                </th>
                {areas.map((a) => (
                  <th key={a} scope="col" className="px-4 py-3 font-semibold text-ink">
                    {areaLabel(a)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {zones.map((z) => (
                <tr key={z} className="border-t border-line">
                  <th scope="row" className="px-4 py-2.5 text-left font-semibold text-ink">
                    {z}
                  </th>
                  {areas.map((a) => (
                    <td key={a} className="px-4 py-2.5 font-mono text-ink-2">
                      {fmt(tier.basis, value(z, a))}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-12" aria-labelledby="targets-title">
      <h2 id="targets-title" className="font-display text-[1.6rem] font-bold tracking-tight text-ink">
        {dict.tables.targetsTitle}
      </h2>
      <div className="mt-5 overflow-x-auto rounded-2xl border border-line bg-surface">
        <table className="w-full min-w-[520px] border-collapse text-sm tabular">
          <thead>
            <tr className="bg-canvas text-left">
              <th scope="col" className="px-4 py-3 font-semibold text-ink">
                {dict.tables.area}
              </th>
              {market.tiers.map((t) => (
                <th key={t.id} scope="col" className="px-4 py-3 font-semibold text-ink">
                  {t.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {market.areas.map((a) => (
              <tr key={a} className="border-t border-line">
                <th scope="row" className="px-4 py-2.5 text-left font-semibold text-ink">
                  {areaLabel(a)}
                </th>
                {market.tiers.map((t) => {
                  const v = t.values?.[a] ?? (t.byZone ? Object.values(t.byZone)[0]?.[a] : undefined);
                  return (
                    <td key={t.id} className="px-4 py-2.5 font-mono text-ink-2">
                      {fmt(t.basis, v)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
