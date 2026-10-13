// Locale-aware formatting for results. Safe for client and server.
import type { MarketData } from "@/engine/types";
import { m2ToSqft, mmToInches, toRIP } from "@/engine/units";

export type UnitSystem = "imperial" | "metric";

const nf = (locale: string, digits: number) =>
  new Intl.NumberFormat(locale, { minimumFractionDigits: digits, maximumFractionDigits: digits });

export const fmtNum = (locale: string, n: number, digits = 0): string => nf(locale, digits).format(n);

export function fmtMoney(locale: string, currency: string, n: number): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: n >= 100 ? 0 : 2,
    minimumFractionDigits: n >= 100 ? 0 : 2,
  }).format(n);
}

export function fmtMoneyRange(locale: string, currency: string, low: number, high: number): string {
  if (Math.abs(high - low) < 0.5) return fmtMoney(locale, currency, low);
  return `${fmtMoney(locale, currency, low)} – ${fmtMoney(locale, currency, high)}`;
}

/** R-value in the market's convention: "R-38" (US) or "R 6,7 m²K/W" (SI). */
export function fmtR(market: Pick<MarketData, "rDisplay" | "locale">, rSI: number, withUnit = true): string {
  if (market.rDisplay === "ip") return `R-${fmtNum(market.locale, Math.round(toRIP(rSI)))}`;
  const v = fmtNum(market.locale, rSI, rSI < 10 ? 2 : 1);
  return withUnit ? `R ${v} m²K/W` : `R ${v}`;
}

export const fmtU = (locale: string, u: number): string => `${fmtNum(locale, u, 2)} W/m²K`;

/** Insulation depth: inches (imperial) or mm/cm (metric, per market). */
export function fmtDepth(market: Pick<MarketData, "locale" | "metricDepthUnit">, units: UnitSystem, mm: number): string {
  if (units === "imperial") {
    const inch = mmToInches(mm);
    return `${fmtNum(market.locale, inch, inch < 10 ? 2 : 1).replace(/[.,]?0+$/, "")} in`;
  }
  if (market.metricDepthUnit === "cm") {
    const cm = Math.round(mm) / 10;
    return `${fmtNum(market.locale, cm, mm < 100 && !Number.isInteger(cm) ? 1 : 0)} cm`;
  }
  return `${fmtNum(market.locale, Math.round(mm))} mm`;
}

export function fmtArea(locale: string, units: UnitSystem, m2: number): string {
  if (units === "imperial") return `${fmtNum(locale, Math.round(m2ToSqft(m2)))} sq ft`;
  return `${fmtNum(locale, m2, m2 < 100 ? 1 : 0)} m²`;
}

export function fmtDate(locale: string, isoDate: string): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  return new Intl.DateTimeFormat(locale, { year: "numeric", month: "long", ...(d ? { day: "numeric" } : {}) }).format(
    new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1, 12)),
  );
}
