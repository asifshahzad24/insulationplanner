"use client";

import { useState } from "react";
import type { CalcResult, MarketData, Product } from "@/engine/types";
import { plural, tpl, type Dict } from "@/i18n";
import { fmtArea, fmtDate, fmtDepth, fmtMoneyRange, fmtR, fmtU, type UnitSystem } from "@/lib/format";
import { RMeter } from "./RMeter";
import { shoppingLines, shoppingText } from "./shopping";

interface Props {
  result: CalcResult;
  product: Product | undefined;
  market: MarketData;
  dict: Dict;
  units: UnitSystem;
  areaName: string;
  tierLabel: string;
  siteName: string;
}

export function ResultPanel({ result, product, market, dict, units, areaName, tierLabel, siteName }: Props) {
  const [copied, setCopied] = useState<"list" | "link" | null>(null);
  const t = dict.result;
  const meterLabels = { now: t.now, target: t.target, after: t.after };

  const flash = (what: "list" | "link") => {
    setCopied(what);
    window.setTimeout(() => setCopied(null), 1800);
  };
  const copy = async (text: string, what: "list" | "link") => {
    try {
      await navigator.clipboard.writeText(text);
      flash(what);
    } catch {
      /* clipboard blocked: ignore */
    }
  };

  if (result.status === "invalid" || !product) {
    return (
      <div id="results" aria-live="polite" className="flex min-h-48 items-center justify-center p-6 text-center text-sm text-muted">
        {result.warnings.includes("noTarget") ? t.noTarget : t.invalid}
      </div>
    );
  }

  if (result.status === "alreadyMet") {
    return (
      <div id="results" aria-live="polite" className="p-5 sm:p-6">
        <div className="flex items-center gap-2 text-ok">
          <svg viewBox="0 0 20 20" className="size-5" aria-hidden>
            <path d="M4 10.5l4 4 8-9" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="font-display text-2xl font-bold tracking-tight">{t.alreadyMet}</span>
        </div>
        <p className="mt-2 text-sm text-muted">{t.alreadyMetBody}</p>
        <RMeter market={market} now={result.existingRSI} target={result.targetRSI} after={result.afterRSI} labels={meterLabels} />
        <Warnings codes={result.warnings} dict={dict} />
      </div>
    );
  }

  const lines = shoppingLines(result, product, market, dict, units);
  const unitForms = product.packageUnit ? dict.result.packages[product.packageUnit] : undefined;
  const costText = fmtMoneyRange(market.locale, market.currency, result.cost.low, result.cost.high);
  const isSpray = product.form === "spray";

  return (
    <div id="results" aria-live="polite" className="p-5 sm:p-6">
      <p className="text-[13px] font-medium text-muted">{t.addLabel}</p>
      <p className="font-display text-[3.25rem] font-extrabold leading-none tracking-[-0.035em] text-ink tabular">
        {fmtDepth(market, units, result.depthMm)}
      </p>
      <p className="mt-1.5 text-[13px] text-muted">
        {fmtR(market, result.existingRSI)} → {fmtR(market, result.afterRSI)}
        {result.afterU != null && result.currentU != null && Number.isFinite(result.currentU) ? (
          <>
            {" · U "}
            {fmtU(market.locale, result.currentU)} → {fmtU(market.locale, result.afterU)}
          </>
        ) : null}
      </p>

      <RMeter market={market} now={result.existingRSI} target={result.targetRSI} after={result.afterRSI} labels={meterLabels} />

      <div className="grid grid-cols-2 gap-2.5">
        <div className="rounded-xl bg-canvas px-3.5 py-3">
          <span className="block text-xs text-muted">{t.toBuy}</span>
          <b className="font-mono text-xl font-semibold tabular">
            {isSpray ? fmtArea(market.locale, units, result.areaM2) : `${result.packages}`}
          </b>{" "}
          {!isSpray && unitForms ? <span className="text-sm text-muted">{plural(result.packages, unitForms)}</span> : null}
        </div>
        <div className="rounded-xl bg-canvas px-3.5 py-3">
          <span className="block text-xs text-muted">{t.estCost}</span>
          <b className="block font-mono text-[17px] font-semibold leading-snug tabular">{costText}</b>
        </div>
      </div>

      <ul className="mt-4 space-y-2 text-sm">
        {lines.map((l, i) => (
          <li key={i} className="flex gap-2.5 rounded-lg border border-line px-3 py-2.5">
            {l.count != null ? (
              <span className="min-w-[2.5ch] font-mono font-semibold tabular text-ink">{l.count}</span>
            ) : null}
            <span className="text-ink-2">
              {l.unit ? <span className="text-muted">{l.unit} · </span> : null}
              {l.text}
              {l.detail ? <span className="block text-xs text-muted">{l.detail}</span> : null}
            </span>
          </li>
        ))}
      </ul>

      <Warnings codes={result.warnings} dict={dict} />

      <div className="no-print mt-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() =>
            copy(
              shoppingText({ result, product, market, dict, units, areaName, tierLabel, url: window.location.href, siteName }),
              "list",
            )
          }
          className="rounded-[10px] bg-ink px-3 py-2.5 text-[13px] font-semibold text-white transition hover:bg-ink-2"
        >
          {copied === "list" ? t.copied : t.copy}
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          className="rounded-[10px] border border-line-2 px-3 py-2.5 text-[13px] font-semibold text-ink transition hover:bg-canvas"
        >
          {t.print}
        </button>
        <button
          type="button"
          onClick={() => copy(window.location.href, "link")}
          className="col-span-2 rounded-[10px] px-3 py-1.5 text-[13px] font-medium text-muted underline-offset-4 hover:text-ink hover:underline"
        >
          {copied === "link" ? t.linkCopied : t.share}
        </button>
      </div>

      <details className="group mt-3 rounded-lg border border-line px-3 py-2 text-sm">
        <summary className="cursor-pointer select-none font-medium text-ink">{t.showMath}</summary>
        <MathSteps result={result} market={market} dict={dict} units={units} />
      </details>

      <p className="mt-3 text-xs leading-relaxed text-faint">
        {isSpray ? t.sprayNote : tpl(t.costNote, { date: fmtDate(market.locale, product.priceDate) })} {t.disclaimer}
      </p>
    </div>
  );
}

function Warnings({ codes, dict }: { codes: CalcResult["warnings"]; dict: Dict }) {
  const shown = codes.filter((c) => c !== "noTarget");
  if (!shown.length) return null;
  return (
    <ul className="mt-4 space-y-2">
      {shown.map((c) => (
        <li key={c} role="note" className="rounded-lg border border-warn-line bg-warn-bg px-3 py-2.5 text-[13px] leading-snug text-warn-ink">
          {dict.result.warnings[c]}
        </li>
      ))}
    </ul>
  );
}

function MathSteps({ result, market, dict, units }: { result: CalcResult; market: MarketData; dict: Dict; units: UnitSystem }) {
  const s = dict.result.steps;
  const R = (r: number) => fmtR(market, r);
  const D = (mm: number) => fmtDepth(market, units, mm);
  const items = result.steps.map((step) => {
    const v = step.values;
    switch (step.key) {
      case "target":
        return tpl(s.target, {
          target: R(Number(v.targetRSI)),
          uNote:
            v.targetU != null
              ? tpl(s.targetU, { u: fmtU(market.locale, Number(v.targetU)), rOther: R(Number(v.rOther)) })
              : v.newOnly
                ? s.newOnly
                : "",
        });
      case "existing":
        return tpl(s.existing, { existing: R(result.existingRSI) });
      case "add":
        return tpl(s.add, { add: R(Number(v.addRSI)) });
      case "quantityArea":
        return tpl(s.quantityArea, {
          area: fmtArea(market.locale, units, Number(v.areaM2)),
          waste: Number(v.wastePct),
          qty: fmtArea(market.locale, units, Number(v.quantityAreaM2)),
        });
      case "layers":
        return tpl(s.layers, { count: Number(v.count), depth: D(Number(v.depthMm)), packages: Number(v.packages) });
      case "loosefill":
        return tpl(s.loosefill, {
          settled: D(Number(v.settledMm)),
          installed: D(Number(v.installedMm)),
          bags: Number(v.bags),
          how: v.chart === "chart" ? s.loosefillChart : s.loosefillPhysics,
        });
      case "spray":
        return tpl(s.spray, { depth: D(Number(v.depthMm)) });
      case "cost":
        return tpl(s.cost, {
          low: fmtMoneyRange(market.locale, market.currency, Number(v.low), Number(v.low)),
          high: fmtMoneyRange(market.locale, market.currency, Number(v.high), Number(v.high)),
        });
      default:
        return "";
    }
  });
  return (
    <ol className="mt-2 list-decimal space-y-1 pl-5 text-[13px] text-ink-2">
      {items.filter(Boolean).map((text, i) => (
        <li key={i}>{text}</li>
      ))}
    </ol>
  );
}
