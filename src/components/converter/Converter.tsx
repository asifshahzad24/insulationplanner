"use client";

import { useState } from "react";
import { R_IP_TO_SI } from "@/engine/units";
import type { Dict } from "@/i18n";
import { fmtNum } from "@/lib/format";
import { Field, NumInput } from "@/components/calculator/ui";
import { num } from "@/components/calculator/state";

type Source = "rIP" | "rSI" | "u";

/** R (US) ↔ R (SI) ↔ U converter plus thickness ↔ R for a given λ. */
export function Converter({ dict, locale, imperialFirst }: { dict: Dict; locale: string; imperialFirst: boolean }) {
  const c = dict.converter;
  const [vals, setVals] = useState<Record<Source, string>>(
    imperialFirst ? { rIP: "38", rSI: fmt(locale, 38 * R_IP_TO_SI), u: fmt(locale, 1 / (38 * R_IP_TO_SI)) } : { rIP: fmt(locale, 4 / R_IP_TO_SI), rSI: "4", u: fmt(locale, 0.25) },
  );
  const [lambda, setLambda] = useState(imperialFirst ? "0.040" : "0.035");
  const [thick, setThick] = useState(imperialFirst ? "10" : "200");

  const update = (from: Source, raw: string) => {
    const v = num(raw);
    const next: Record<Source, string> = { rIP: vals.rIP, rSI: vals.rSI, u: vals.u, [from]: raw };
    if (v > 0) {
      const rSI = from === "rIP" ? v * R_IP_TO_SI : from === "rSI" ? v : 1 / v;
      if (from !== "rIP") next.rIP = fmt(locale, rSI / R_IP_TO_SI, 1);
      if (from !== "rSI") next.rSI = fmt(locale, rSI);
      if (from !== "u") next.u = fmt(locale, 1 / rSI, 3);
    }
    setVals(next);
  };

  const l = num(lambda);
  const tMm = imperialFirst ? num(thick) * 25.4 : num(thick);
  const rFromThickness = l > 0 && tMm > 0 ? tMm / 1000 / l : NaN;

  return (
    <div className="grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line shadow-[0_24px_48px_-28px_rgba(11,14,20,.35)] lg:grid-cols-2">
      <div className="bg-surface p-5 sm:p-6">
        <h2 className="mb-4 font-display text-lg font-bold text-ink">{c.title}</h2>
        <div className="space-y-3">
          <Field label={c.rIP} htmlFor="cv-rip">
            <NumInput id="cv-rip" value={vals.rIP} onChange={(v) => update("rIP", v)} suffix="R" />
          </Field>
          <Field label={c.rSI} htmlFor="cv-rsi">
            <NumInput id="cv-rsi" value={vals.rSI} onChange={(v) => update("rSI", v)} suffix="m²K/W" />
          </Field>
          <Field label={c.u} htmlFor="cv-u">
            <NumInput id="cv-u" value={vals.u} onChange={(v) => update("u", v)} suffix="W/m²K" />
          </Field>
        </div>
        <p className="mt-4 text-xs leading-relaxed text-faint">{c.note}</p>
      </div>
      <div className="bg-surface p-5 sm:p-6">
        <h2 className="mb-4 font-display text-lg font-bold text-ink">{c.thicknessTitle}</h2>
        <div className="grid grid-cols-2 gap-3">
          <Field label={c.lambda} htmlFor="cv-l">
            <NumInput id="cv-l" value={lambda} onChange={setLambda} />
          </Field>
          <Field label={c.thickness} htmlFor="cv-t">
            <NumInput id="cv-t" value={thick} onChange={setThick} suffix={imperialFirst ? "in" : "mm"} />
          </Field>
        </div>
        <div className="mt-5 rounded-xl bg-canvas p-4" aria-live="polite">
          <p className="font-display text-3xl font-extrabold tracking-tight text-ink tabular">
            {Number.isFinite(rFromThickness) ? `R ${fmt(locale, rFromThickness)}` : "—"}
            <span className="ml-1 text-sm font-semibold text-muted">m²K/W</span>
          </p>
          {Number.isFinite(rFromThickness) ? (
            <p className="mt-1 font-mono text-sm text-muted">
              = R-{fmt(locale, rFromThickness / R_IP_TO_SI, 1)} (US) · {c.rPerInch} {fmt(locale, 0.0254 / l / R_IP_TO_SI, 2)}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function fmt(locale: string, n: number, digits = 2) {
  return fmtNum(locale, n, digits).replace(/\s/g, "");
}
