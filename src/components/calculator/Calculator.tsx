"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { calculate } from "@/engine/calculate";
import type { AreaType, MarketData } from "@/engine/types";
import { plural, tpl, type Dict } from "@/i18n";
import { fmtArea, fmtDepth, fmtMoneyRange } from "@/lib/format";
import { lookupZone, US_ZONES } from "@/lib/zip";
import { ResultPanel } from "./ResultPanel";
import {
  areaM2Of,
  decodeState,
  defaultCavity,
  defaultProductFor,
  defaultState,
  encodeState,
  productsFor,
  toInput,
  type DimMode,
  type ExistingKind,
  type Preset,
  type UiState,
} from "./state";
import { Field, NumInput, Question, Segmented, Select } from "./ui";

interface Props {
  market: MarketData;
  dict: Dict;
  preset?: Preset;
  siteName: string;
}

export function Calculator({ market, dict, preset, siteName }: Props) {
  const defaults = useMemo(() => defaultState(market, preset), [market, preset]);
  const [ui, setUi] = useState<UiState>(defaults);
  const [zipStatus, setZipStatus] = useState<"idle" | "found" | "missing">("idle");
  const hydrated = useRef(false);
  const c = dict.calc;

  // Restore a shared calculation from the URL once, after hydration.
  useEffect(() => {
    if (window.location.search) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time URL hydration after SSR
      setUi(decodeState(window.location.search, defaults, market));
    }
    hydrated.current = true;
  }, [defaults, market]);

  // Mirror the state into the URL (debounced) so the result can be shared.
  useEffect(() => {
    if (!hydrated.current) return;
    const id = window.setTimeout(() => {
      const qs = encodeState(ui, defaults);
      window.history.replaceState(null, "", `${window.location.pathname}${qs}${window.location.hash}`);
    }, 350);
    return () => window.clearTimeout(id);
  }, [ui, defaults]);

  const set = <K extends keyof UiState>(key: K, value: UiState[K]) => setUi((s) => ({ ...s, [key]: value }));

  const changeArea = (area: AreaType) =>
    setUi((s) => {
      const wall = area === "wall" || area === "basementWall";
      const keepProduct = productsFor(market, area).some((p) => p.id === s.product);
      return {
        ...s,
        area,
        dimMode: wall ? "walls" : s.dimMode === "walls" ? "rect" : s.dimMode,
        product: keepProduct ? s.product : defaultProductFor(market, area),
        cavity: defaultCavity(market, area),
      };
    });

  const changeZip = async (zip: string) => {
    set("zip", zip);
    if (!/^\d{5}$/.test(zip.trim())) {
      setZipStatus("idle");
      return;
    }
    const zone = await lookupZone(zip);
    if (zone) {
      setUi((s) => ({ ...s, zone }));
      setZipStatus("found");
    } else setZipStatus("missing");
  };

  const input = toInput(ui, market);
  const inputKey = JSON.stringify(input);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- keyed on the serialized input
  const result = useMemo(() => calculate(input, market), [inputKey, market]);

  const product = market.products.find((p) => p.id === ui.product);
  const tier = market.tiers.find((t) => t.id === ui.tier) ?? market.tiers[0];
  const imperial = ui.units === "imperial";
  const lenUnit = imperial ? "ft" : "m";
  const areaUnit = imperial ? "sq ft" : "m²";
  const depthUnit = imperial ? "in" : market.metricDepthUnit;
  const isWall = ui.area === "wall" || ui.area === "basementWall";
  const hasElementU = market.tiers.some((t) => t.basis === "elementU");
  const cavities = market.cavities?.[ui.area];
  const areaM2 = areaM2Of(ui, market);

  const dimModes: { value: DimMode; label: string }[] = isWall
    ? [
        { value: "walls", label: c.dimModes.walls },
        { value: "total", label: c.dimModes.total },
      ]
    : [
        { value: "rect", label: c.dimModes.rect },
        { value: "total", label: c.dimModes.total },
      ];

  const existingKinds: { value: ExistingKind; label: string }[] = [
    { value: "none", label: c.existingKinds.none },
    { value: "thickness", label: c.existingKinds.thickness },
    hasElementU ? { value: "u", label: c.existingKinds.u } : { value: "r", label: c.existingKinds.r },
  ];

  const productOptions = productsFor(market, ui.area).map((p) => ({
    value: p.id,
    label: p.name,
    group: market.materialLabels[p.material] ?? p.material,
  }));

  const summaryReady = result.status === "ok" && product;
  const unitForms = product?.packageUnit ? dict.result.packages[product.packageUnit] : undefined;

  return (
    <div className="overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface shadow-[0_24px_48px_-28px_rgba(11,14,20,.35)]">
      <div className="grid lg:grid-cols-[1.15fr_1fr]">
        {/* ── Inputs ──────────────────────────────────────────────────── */}
        <form
          className="no-print space-y-7 p-5 sm:p-6 lg:border-r lg:border-line"
          onSubmit={(e) => e.preventDefault()}
          aria-label={c.title}
        >
          <section>
            <div className="mb-2.5 flex items-center justify-between gap-3">
              <Question>{c.areaQ}</Question>
              <div className="w-36 shrink-0">
                <Segmented
                  size="sm"
                  label="Units"
                  value={ui.units}
                  onChange={(v) => set("units", v)}
                  options={[
                    { value: "imperial", label: c.units.imperial },
                    { value: "metric", label: c.units.metric },
                  ]}
                />
              </div>
            </div>
            <Segmented
              label={c.areaQ}
              value={ui.area}
              onChange={changeArea}
              options={market.areas.map((a) => ({ value: a, label: c.areas[a] }))}
            />
          </section>

          <section>
            <Question>{c.sizeQ}</Question>
            <div className="mb-3">
              <Segmented size="sm" label={c.sizeQ} value={ui.dimMode} onChange={(v) => set("dimMode", v)} options={dimModes} />
            </div>
            {ui.dimMode === "rect" ? (
              <div className="grid grid-cols-2 gap-3">
                <Field label={c.length} htmlFor="len">
                  <NumInput id="len" value={ui.length} onChange={(v) => set("length", v)} suffix={lenUnit} />
                </Field>
                <Field label={c.width} htmlFor="wid">
                  <NumInput id="wid" value={ui.width} onChange={(v) => set("width", v)} suffix={lenUnit} />
                </Field>
              </div>
            ) : ui.dimMode === "total" ? (
              <Field label={c.totalArea} htmlFor="tot">
                <NumInput id="tot" value={ui.total} onChange={(v) => set("total", v)} suffix={areaUnit} />
              </Field>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Field label={c.perimeter} htmlFor="per">
                  <NumInput id="per" value={ui.perimeter} onChange={(v) => set("perimeter", v)} suffix={lenUnit} />
                </Field>
                <Field label={c.wallHeight} htmlFor="hei">
                  <NumInput id="hei" value={ui.height} onChange={(v) => set("height", v)} suffix={lenUnit} />
                </Field>
                <Field label={c.doors} htmlFor="doo">
                  <NumInput id="doo" integer value={ui.doors} onChange={(v) => set("doors", v)} />
                </Field>
                <Field label={c.windows} htmlFor="win">
                  <NumInput id="win" integer value={ui.windows} onChange={(v) => set("windows", v)} />
                </Field>
              </div>
            )}
            {ui.dimMode !== "total" && areaM2 > 0 ? (
              <p className="mt-2 font-mono text-xs text-muted">
                {tpl(c.netArea, { area: fmtArea(market.locale, ui.units, areaM2) })}
              </p>
            ) : null}
          </section>

          <section>
            <Question>{c.existingQ}</Question>
            <div className="mb-3">
              <Segmented
                size="sm"
                label={c.existingQ}
                value={ui.existingKind}
                onChange={(v) => set("existingKind", v)}
                options={existingKinds}
              />
            </div>
            {ui.existingKind === "thickness" ? (
              <div className="grid grid-cols-2 gap-3">
                <Field label={c.existingDepth} htmlFor="exd">
                  <NumInput id="exd" value={ui.existingDepth} onChange={(v) => set("existingDepth", v)} suffix={depthUnit} placeholder="0" />
                </Field>
                <Field label={c.existingType} htmlFor="exm">
                  <Select
                    id="exm"
                    value={ui.existingMaterial}
                    onChange={(v) => set("existingMaterial", v)}
                    options={market.existing.map((m) => ({ value: m.id, label: m.label }))}
                  />
                </Field>
              </div>
            ) : ui.existingKind === "r" ? (
              <Field label={c.existingR} htmlFor="exr">
                <NumInput
                  id="exr"
                  value={ui.existingR}
                  onChange={(v) => set("existingR", v)}
                  suffix={market.rDisplay === "ip" ? "R" : "m²K/W"}
                  placeholder="0"
                />
              </Field>
            ) : ui.existingKind === "u" ? (
              <Field label={c.existingU} htmlFor="exu">
                <NumInput id="exu" value={ui.existingU} onChange={(v) => set("existingU", v)} suffix="W/m²K" placeholder="1.0" />
              </Field>
            ) : null}
          </section>

          {market.zoneKind === "usClimate" ? (
            <section>
              <Question>{c.locationQ}</Question>
              <div className="grid grid-cols-2 gap-3">
                <Field
                  label={c.zip}
                  htmlFor="zip"
                  hint={
                    zipStatus === "found"
                      ? tpl(c.zipFound, { zone: ui.zone })
                      : zipStatus === "missing"
                        ? c.zipNotFound
                        : c.zipHelp
                  }
                >
                  <NumInput id="zip" integer value={ui.zip} onChange={changeZip} placeholder="60601" />
                </Field>
                <Field label={c.zone} htmlFor="zone">
                  <Select
                    id="zone"
                    value={ui.zone}
                    onChange={(v) => {
                      set("zone", v);
                      setZipStatus("idle");
                    }}
                    options={US_ZONES.map((z) => ({ value: z, label: tpl(c.zoneOption, { zone: z }) }))}
                  />
                </Field>
              </div>
            </section>
          ) : market.zoneKind === "frZone" && market.regions?.length ? (
            <section>
              <Question>{c.locationQ}</Question>
              <Field label={c.dept} htmlFor="dept">
                <Select
                  id="dept"
                  value={ui.zone}
                  onChange={(v) => set("zone", v)}
                  options={market.regions.map((d) => ({ value: d.code, label: `${d.code} · ${d.name} (${d.zone})` }))}
                />
              </Field>
            </section>
          ) : null}

          <section>
            <Question>{c.targetQ}</Question>
            {market.tiers.length > 1 ? (
              <Segmented
                label={c.targetQ}
                value={ui.tier}
                onChange={(v) => set("tier", v)}
                options={market.tiers.map((t) => ({ value: t.id, label: t.label }))}
              />
            ) : (
              <p className="rounded-xl bg-canvas px-3.5 py-2.5 text-[13.5px] font-medium text-ink">{tier.label}</p>
            )}
            {tier.description ? <p className="mt-2 text-xs leading-snug text-faint">{tier.description}</p> : null}
          </section>

          <section>
            <Question>{c.materialQ}</Question>
            <Select id="prod" ariaLabel={c.product} value={ui.product} onChange={(v) => set("product", v)} options={productOptions} />
          </section>

          <details className="group rounded-xl border border-line px-4 py-3" open={Boolean(cavities && product?.betweenFraming)}>
            <summary className="cursor-pointer select-none text-[13.5px] font-medium text-ink">{c.advanced}</summary>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {cavities && product?.betweenFraming ? (
                <Field label={c.cavity} htmlFor="cav" hint={c.cavityHelp} className="sm:col-span-2">
                  <Select
                    id="cav"
                    value={String(ui.cavity)}
                    onChange={(v) => set("cavity", Number(v))}
                    options={[
                      { value: "-1", label: c.cavityNone },
                      ...cavities.options.map((o, i) => ({ value: String(i), label: o.label })),
                    ]}
                  />
                </Field>
              ) : null}
              <Field label={c.waste} htmlFor="was">
                <NumInput id="was" value={ui.waste} onChange={(v) => set("waste", v)} suffix="%" />
              </Field>
              {product?.form === "loosefill" && unitForms ? (
                <Field label={tpl(c.price, { unit: unitForms[0] })} htmlFor="pri">
                  <NumInput
                    id="pri"
                    value={ui.price}
                    onChange={(v) => set("price", v)}
                    suffix={market.currency}
                    placeholder={product.loosefill ? String(product.loosefill.price.high) : c.pricePlaceholder}
                  />
                </Field>
              ) : null}
            </div>
          </details>

          <button
            type="button"
            onClick={() => {
              setUi(defaults);
              setZipStatus("idle");
            }}
            className="text-[13px] font-medium text-muted underline-offset-4 hover:text-ink hover:underline"
          >
            {c.reset}
          </button>
        </form>

        {/* ── Results ─────────────────────────────────────────────────── */}
        <div className="border-t border-line lg:border-t-0">
          <div className="lg:sticky lg:top-4">
            <ResultPanel
              result={result}
              product={product}
              market={market}
              dict={dict}
              units={ui.units}
              areaName={c.areas[ui.area]}
              tierLabel={tier.label}
              siteName={siteName}
            />
          </div>
        </div>
      </div>

      {/* ── Mobile summary bar ────────────────────────────────────────── */}
      {summaryReady ? (
        <a
          href="#results"
          className="no-print fixed inset-x-3 bottom-3 z-40 flex items-center justify-between gap-3 rounded-2xl bg-night px-4 py-3 text-white shadow-2xl lg:hidden"
          style={{ marginBottom: "env(safe-area-inset-bottom, 0px)" }}
        >
          <span className="truncate font-mono text-[13px] tabular">
            +{fmtDepth(market, ui.units, result.depthMm)}
            {product.form !== "spray" && unitForms ? ` · ${result.packages} ${plural(result.packages, unitForms)}` : ""}
            {` · ${fmtMoneyRange(market.locale, market.currency, result.cost.low, result.cost.high)}`}
          </span>
          <span className="shrink-0 rounded-lg bg-white/10 px-2.5 py-1 text-xs font-semibold">{dict.result.jump}</span>
        </a>
      ) : null}
    </div>
  );
}
