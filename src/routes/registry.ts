import type { AreaType, MarketId, ProductForm } from "@/engine/types";
import { MARKETS } from "@/markets/meta";

export type PageKind = "calculator" | "converter" | "article";

/** Extra tables rendered on article/calculator pages. */
export type Widget = "thicknessChart" | "targetsTable" | "zoneLookup";

/** Cross-market equivalence key, used for hreflang alternates. */
export type Group =
  | "home"
  | "attic"
  | "wall"
  | "solidWall"
  | "floor"
  | "roof"
  | "basement"
  | "blown"
  | "thickness"
  | "converter"
  | "targets"
  | "methodology"
  | "faq"
  | "about"
  | "privacy"
  | "terms"
  | "affiliate"
  | "legalNotice";

export interface CalcPreset {
  area?: AreaType;
  form?: ProductForm;
  /** product id to preselect */
  productId?: string;
}

export interface RouteEntry {
  market: MarketId;
  /** "" = market home */
  slug: string;
  kind: PageKind;
  group: Group;
  preset?: CalcPreset;
  widget?: Widget;
  /** shown in the "Calculators" nav/footer list */
  tool?: boolean;
  /** legal/trust page listed in the footer */
  legal?: boolean;
  /** sitemap priority hint */
  priority?: number;
}

const r = (market: MarketId, slug: string, kind: PageKind, group: Group, extra: Partial<RouteEntry> = {}): RouteEntry => ({
  market,
  slug,
  kind,
  group,
  ...extra,
});

const legal = (market: MarketId, slugs: Partial<Record<Group, string>>): RouteEntry[] =>
  (Object.entries(slugs) as [Group, string][]).map(([group, slug]) =>
    r(market, slug, "article", group, {
      legal: ["privacy", "terms", "affiliate", "legalNotice"].includes(group),
      priority: 0.3,
    }),
  );

export const ROUTES: RouteEntry[] = [
  // ── United States ──────────────────────────────────────────────────────
  r("us", "", "calculator", "home", { priority: 1 }),
  r("us", "attic-insulation-calculator", "calculator", "attic", { preset: { area: "attic" }, tool: true, priority: 0.9 }),
  r("us", "blown-in-insulation-calculator", "calculator", "blown", { preset: { area: "attic", form: "loosefill" }, tool: true, priority: 0.9 }),
  r("us", "wall-insulation-calculator", "calculator", "wall", { preset: { area: "wall" }, tool: true, priority: 0.8 }),
  r("us", "floor-insulation-calculator", "calculator", "floor", { preset: { area: "floor" }, tool: true, priority: 0.8 }),
  r("us", "basement-insulation-calculator", "calculator", "basement", { preset: { area: "basementWall" }, tool: true, priority: 0.8 }),
  r("us", "insulation-by-climate-zone", "calculator", "targets", { widget: "targetsTable", preset: { area: "attic" }, tool: true, priority: 0.8 }),
  r("us", "r-value-chart", "article", "thickness", { widget: "thicknessChart", tool: true, priority: 0.8 }),
  r("us", "r-value-to-u-value-converter", "converter", "converter", { tool: true, priority: 0.7 }),
  ...legal("us", {
    methodology: "methodology",
    faq: "faq",
    about: "about",
    privacy: "privacy",
    terms: "terms",
    affiliate: "affiliate-disclosure",
  }),

  // ── United Kingdom ─────────────────────────────────────────────────────
  r("uk", "", "calculator", "home", { priority: 1 }),
  r("uk", "loft-insulation-calculator", "calculator", "attic", { preset: { area: "attic" }, tool: true, priority: 0.9 }),
  r("uk", "blown-loft-insulation-calculator", "calculator", "blown", { preset: { area: "attic", form: "loosefill" }, tool: true, priority: 0.8 }),
  r("uk", "cavity-wall-insulation-calculator", "calculator", "wall", { preset: { area: "wall", form: "loosefill" }, tool: true, priority: 0.8 }),
  r("uk", "solid-wall-insulation-calculator", "calculator", "solidWall", { preset: { area: "wall", form: "board" }, tool: true, priority: 0.8 }),
  r("uk", "floor-insulation-calculator", "calculator", "floor", { preset: { area: "floor" }, tool: true, priority: 0.8 }),
  r("uk", "part-l-u-values", "calculator", "targets", { widget: "targetsTable", preset: { area: "attic" }, tool: true, priority: 0.7 }),
  r("uk", "loft-insulation-thickness", "article", "thickness", { widget: "thicknessChart", tool: true, priority: 0.8 }),
  r("uk", "u-value-calculator", "converter", "converter", { tool: true, priority: 0.7 }),
  ...legal("uk", {
    methodology: "methodology",
    faq: "faq",
    about: "about",
    privacy: "privacy",
    terms: "terms",
    affiliate: "affiliate-disclosure",
  }),

  // ── Deutschland ────────────────────────────────────────────────────────
  r("de", "", "calculator", "home", { priority: 1 }),
  r("de", "oberste-geschossdecke-daemmen", "calculator", "attic", { preset: { area: "attic" }, tool: true, priority: 0.9 }),
  r("de", "einblasdaemmung-rechner", "calculator", "blown", { preset: { area: "attic", form: "loosefill" }, tool: true, priority: 0.8 }),
  r("de", "aussenwand-daemmen", "calculator", "wall", { preset: { area: "wall" }, tool: true, priority: 0.8 }),
  r("de", "kellerdecke-daemmen", "calculator", "floor", { preset: { area: "floor" }, tool: true, priority: 0.8 }),
  r("de", "dach-daemmen", "calculator", "roof", { preset: { area: "roof" }, tool: true, priority: 0.8 }),
  r("de", "geg-beg-anforderungen", "calculator", "targets", { widget: "targetsTable", preset: { area: "attic" }, tool: true, priority: 0.7 }),
  r("de", "daemmstaerke-berechnen", "article", "thickness", { widget: "thicknessChart", tool: true, priority: 0.8 }),
  r("de", "u-wert-rechner", "converter", "converter", { tool: true, priority: 0.7 }),
  ...legal("de", {
    methodology: "methodik",
    faq: "faq",
    about: "ueber-uns",
    privacy: "datenschutz",
    terms: "nutzungsbedingungen",
    affiliate: "affiliate-hinweis",
    legalNotice: "impressum",
  }),

  // ── France ─────────────────────────────────────────────────────────────
  r("fr", "", "calculator", "home", { priority: 1 }),
  r("fr", "isolation-combles-perdus", "calculator", "attic", { preset: { area: "attic" }, tool: true, priority: 0.9 }),
  r("fr", "isolation-soufflee-combles", "calculator", "blown", { preset: { area: "attic", form: "loosefill" }, tool: true, priority: 0.8 }),
  r("fr", "isolation-murs", "calculator", "wall", { preset: { area: "wall" }, tool: true, priority: 0.8 }),
  r("fr", "isolation-plancher-bas", "calculator", "floor", { preset: { area: "floor" }, tool: true, priority: 0.8 }),
  r("fr", "isolation-rampants", "calculator", "roof", { preset: { area: "roof" }, tool: true, priority: 0.8 }),
  r("fr", "exigences-maprimerenov-cee", "calculator", "targets", { widget: "targetsTable", preset: { area: "attic" }, tool: true, priority: 0.7 }),
  r("fr", "epaisseur-isolant", "article", "thickness", { widget: "thicknessChart", tool: true, priority: 0.8 }),
  r("fr", "calcul-resistance-thermique", "converter", "converter", { tool: true, priority: 0.7 }),
  ...legal("fr", {
    methodology: "methodologie",
    faq: "faq",
    about: "a-propos",
    privacy: "confidentialite",
    terms: "conditions-utilisation",
    affiliate: "divulgation-affiliation",
    legalNotice: "mentions-legales",
  }),
];

/** Site-relative path, e.g. "/", "/attic-insulation-calculator", "/de", "/de/u-wert-rechner". */
export function pathOf(entry: Pick<RouteEntry, "market" | "slug">): string {
  const prefix = MARKETS[entry.market].prefix;
  if (!entry.slug) return prefix || "/";
  return `${prefix}/${entry.slug}`;
}

export function routesFor(market: MarketId): RouteEntry[] {
  return ROUTES.filter((e) => e.market === market);
}

export function findRoute(market: MarketId, slug: string): RouteEntry | undefined {
  return ROUTES.find((e) => e.market === market && e.slug === slug);
}

export function routeByGroup(market: MarketId, group: Group): RouteEntry | undefined {
  return ROUTES.find((e) => e.market === market && e.group === group);
}

/** Same-group pages in other markets (for hreflang and the country switcher). */
export function alternatesOf(entry: RouteEntry): RouteEntry[] {
  return ROUTES.filter((e) => e.group === entry.group);
}

/** Content file id for a route: `<market>/<group>`. */
export const contentIdOf = (entry: RouteEntry): string => `${entry.market}/${entry.group}`;
