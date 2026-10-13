// Calculator UI state: what the user typed, in display units. Converted to an
// engine CalcInput by toInput(). Mirrored to the URL so results can be shared.
import { rectangleM2, wallsM2 } from "@/engine/area";
import type { AreaType, CalcInput, MarketData, Product, ProductForm } from "@/engine/types";
import { feet, inches, rFromU, rIP, sqft } from "@/engine/units";
import type { UnitSystem } from "@/lib/format";

export type DimMode = "rect" | "total" | "walls";
export type ExistingKind = "none" | "thickness" | "r" | "u";

export interface UiState {
  area: AreaType;
  units: UnitSystem;
  dimMode: DimMode;
  /** ft or m */
  length: string;
  width: string;
  /** sq ft or m² */
  total: string;
  /** ft or m */
  perimeter: string;
  height: string;
  doors: string;
  windows: string;
  existingKind: ExistingKind;
  /** in (imperial) or mm/cm (metric, per market) */
  existingDepth: string;
  existingMaterial: string;
  /** imperial R (rDisplay "ip") or SI R */
  existingR: string;
  existingU: string;
  zip: string;
  zone: string;
  tier: string;
  product: string;
  /** index into market cavity presets, -1 = not limited */
  cavity: number;
  waste: string;
  price: string;
}

export interface Preset {
  area?: AreaType;
  form?: ProductForm;
  productId?: string;
}

const isWallLike = (a: AreaType) => a === "wall" || a === "basementWall";

export function productsFor(market: MarketData, area: AreaType): Product[] {
  return market.products.filter((p) => p.areas.includes(area));
}

export function defaultProductFor(market: MarketData, area: AreaType, form?: ProductForm): string {
  const list = productsFor(market, area);
  if (form) {
    const match = list.find((p) => p.form === form);
    if (match) return match.id;
  }
  return market.defaultProduct[area] ?? list[0]?.id ?? "";
}

export function defaultCavity(market: MarketData, area: AreaType): number {
  return market.cavities?.[area]?.defaultIndex ?? -1;
}

export function defaultState(market: MarketData, preset: Preset = {}): UiState {
  const area = preset.area && market.areas.includes(preset.area) ? preset.area : market.areas[0];
  const imperial = market.defaultUnits === "imperial";
  const wall = isWallLike(area);
  return {
    area,
    units: market.defaultUnits,
    dimMode: wall ? "walls" : "rect",
    length: imperial ? "40" : "10",
    width: imperial ? "30" : "8",
    total: imperial ? "1200" : "80",
    perimeter: imperial ? "140" : "40",
    height: imperial ? "8" : "2.5",
    doors: "2",
    windows: "8",
    existingKind: "none",
    existingDepth: "",
    existingMaterial: market.existing[0]?.id ?? "",
    existingR: "",
    existingU: "",
    zip: "",
    zone: market.defaultZone ?? "",
    tier: market.defaultTier,
    product: preset.productId ?? defaultProductFor(market, area, preset.form),
    cavity: defaultCavity(market, area),
    waste: String(market.defaultWastePct),
    price: "",
  };
}

/** Parse a user-typed number; accepts "1,5" (comma decimal) and "1,200" (thousands). */
export function num(s: string): number {
  const t = s.trim().replace(/\s/g, "");
  if (!t) return NaN;
  const normalized = /^\d{1,3}(,\d{3})+(\.\d+)?$/.test(t) ? t.replace(/,/g, "") : t.replace(",", ".");
  const n = Number(normalized);
  return Number.isFinite(n) ? n : NaN;
}

const lenToM = (units: UnitSystem, v: number) => (units === "imperial" ? feet(v) : v);

export function areaM2Of(ui: UiState, market: MarketData): number {
  const { units } = ui;
  if (ui.dimMode === "total") {
    const v = num(ui.total);
    return units === "imperial" ? sqft(v) : v;
  }
  if (ui.dimMode === "walls") {
    return wallsM2({
      perimeterM: lenToM(units, num(ui.perimeter)),
      heightM: lenToM(units, num(ui.height)),
      doors: Math.max(0, num(ui.doors) || 0),
      windows: Math.max(0, num(ui.windows) || 0),
      doorM2: market.openings.doorM2,
      windowM2: market.openings.windowM2,
    });
  }
  return rectangleM2(lenToM(units, num(ui.length)), lenToM(units, num(ui.width)));
}

/** Depth typed by the user → mm. */
export function depthToMm(ui: UiState, market: MarketData, v: number): number {
  if (ui.units === "imperial") return inches(v);
  return market.metricDepthUnit === "cm" ? v * 10 : v;
}

export function toInput(ui: UiState, market: MarketData): CalcInput {
  const areaM2 = areaM2Of(ui, market);
  let existing: CalcInput["existing"] = { kind: "none" };
  if (ui.existingKind === "thickness") {
    const d = num(ui.existingDepth);
    if (d > 0) existing = { kind: "thickness", mm: depthToMm(ui, market, d), materialId: ui.existingMaterial };
  } else if (ui.existingKind === "r") {
    const r = num(ui.existingR);
    if (r > 0) existing = { kind: "r", rSI: market.rDisplay === "ip" ? rIP(r) : r };
  } else if (ui.existingKind === "u") {
    const u = num(ui.existingU);
    if (u > 0) existing = { kind: "u", u };
  }
  const cavities = market.cavities?.[ui.area]?.options;
  const product = market.products.find((p) => p.id === ui.product);
  // A cavity only limits products that go inside it.
  const cavityMm = cavities && ui.cavity >= 0 && product?.betweenFraming ? cavities[ui.cavity]?.mm : undefined;
  const price = num(ui.price);
  return {
    area: ui.area,
    areaM2: Number.isFinite(areaM2) ? areaM2 : 0,
    existing,
    tierId: ui.tier,
    zone: ui.zone || market.defaultZone,
    productId: ui.product,
    wastePct: Math.min(50, Math.max(0, num(ui.waste) || 0)),
    cavityMm,
    priceOverride: price > 0 ? price : undefined,
  };
}

/** Existing R typed as U for display conversions. */
export const uToR = rFromU;

// ── URL sync ──────────────────────────────────────────────────────────────
const KEYS: Record<keyof UiState, string> = {
  area: "a",
  units: "un",
  dimMode: "dm",
  length: "l",
  width: "w",
  total: "ar",
  perimeter: "p",
  height: "h",
  doors: "d",
  windows: "wi",
  existingKind: "ek",
  existingDepth: "ed",
  existingMaterial: "em",
  existingR: "er",
  existingU: "eu",
  zip: "zip",
  zone: "z",
  tier: "t",
  product: "pr",
  cavity: "c",
  waste: "ws",
  price: "pp",
};

/** Only the fields that differ from the defaults go into the URL. */
export function encodeState(ui: UiState, defaults: UiState): string {
  const params = new URLSearchParams();
  for (const key of Object.keys(KEYS) as (keyof UiState)[]) {
    if (String(ui[key]) !== String(defaults[key])) params.set(KEYS[key], String(ui[key]));
  }
  const s = params.toString();
  return s ? `?${s}` : "";
}

export function decodeState(search: string, defaults: UiState, market: MarketData): UiState {
  const params = new URLSearchParams(search);
  const next: UiState = { ...defaults };
  const get = (k: keyof UiState) => params.get(KEYS[k]);
  const str = (k: Exclude<keyof UiState, "cavity">) => {
    const v = get(k);
    if (v != null && v.length <= 40) (next[k] as string) = v;
  };
  (Object.keys(KEYS) as (keyof UiState)[]).forEach((k) => {
    if (k === "cavity") {
      const v = Number(get("cavity"));
      if (get("cavity") != null && Number.isInteger(v)) next.cavity = v;
    } else str(k);
  });
  // Validate enums against the market so a hand-edited URL can't break the page.
  if (!market.areas.includes(next.area)) next.area = defaults.area;
  if (next.units !== "imperial" && next.units !== "metric") next.units = defaults.units;
  if (!["rect", "total", "walls"].includes(next.dimMode)) next.dimMode = defaults.dimMode;
  if (!["none", "thickness", "r", "u"].includes(next.existingKind)) next.existingKind = "none";
  if (!market.tiers.some((t) => t.id === next.tier)) next.tier = defaults.tier;
  if (!productsFor(market, next.area).some((p) => p.id === next.product)) next.product = defaultProductFor(market, next.area);
  if (!market.existing.some((m) => m.id === next.existingMaterial)) next.existingMaterial = defaults.existingMaterial;
  const cav = market.cavities?.[next.area]?.options ?? [];
  if (next.cavity < -1 || next.cavity >= cav.length) next.cavity = defaultCavity(market, next.area);
  return next;
}
