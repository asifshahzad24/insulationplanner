// Core domain types. Everything is SI: R in m²K/W, U in W/m²K, mm, m², kg.

export type MarketId = "us" | "uk" | "de" | "fr";

/** attic = attic floor / loft / oberste Geschossdecke / combles perdus. roof = sloped roof between rafters. */
export type AreaType = "attic" | "roof" | "wall" | "floor" | "basementWall";

export type ProductForm = "batt" | "roll" | "board" | "loosefill" | "spray";

export type MaterialId =
  | "fiberglass"
  | "mineralWool"
  | "blownFiberglass"
  | "blownCellulose"
  | "eps"
  | "xps"
  | "polyiso"
  | "woodFibre"
  | "sprayOpen"
  | "sprayClosed";

export type Confidence = "high" | "medium" | "low";

export interface Sourced {
  /** id of an entry in MarketData.sources */
  source: string;
  confidence?: Confidence;
  note?: string;
}

export interface Source {
  id: string;
  title: string;
  url: string;
  accessed: string;
}

export interface PriceRange {
  low: number;
  high: number;
}

/** One purchasable thickness of a batt/roll/board product. */
export interface Thickness {
  mm: number;
  /** declared R of this thickness */
  rSI: number;
  /** area covered by one package */
  coverageM2: number;
  /** price per package, local currency */
  price: PriceRange;
  /** optional market label, e.g. "R-30" */
  label?: string;
}

/** A row from a manufacturer loose-fill coverage chart. */
export interface LoosefillChartRow {
  rSI: number;
  m2PerBag: number;
  settledMm: number;
  installedMm: number;
}

export type PackageUnit = "bag" | "roll" | "pack" | "board" | "sheet";

export interface Product extends Sourced {
  id: string;
  material: MaterialId;
  form: ProductForm;
  /** generic display name in the market language */
  name: string;
  /** thermal conductivity, W/m·K */
  lambda: number;
  packageUnit?: PackageUnit;
  areas: AreaType[];
  /** typically installed between joists/studs/rafters */
  betweenFraming: boolean;
  thicknesses?: Thickness[];
  loosefill?: {
    bagKg: number;
    /** settled density, kg/m³ */
    settledDensity: number;
    /** installed thickness above settled thickness, % */
    settlingPct: number;
    price: PriceRange;
    chart?: LoosefillChartRow[];
  };
  spray?: {
    /** installed price per m² per mm of thickness */
    pricePerM2Mm: PriceRange;
  };
  /** YYYY-MM of the price check */
  priceDate: string;
}

export interface TargetTier extends Sourced {
  id: string;
  /** short label in the market language, e.g. "Code minimum" */
  label: string;
  /** one-line explanation shown under the selector */
  description?: string;
  /** insulationR: values are R of the insulation (m²K/W). elementU: values are max U of the whole element (W/m²K). */
  basis: "insulationR" | "elementU";
  values?: Partial<Record<AreaType, number>>;
  byZone?: Record<string, Partial<Record<AreaType, number>>>;
}

export interface AreaConvention {
  /** internal surface resistance */
  rsi: number;
  /** external surface resistance */
  rse: number;
  /** resistance of the rest of the existing build-up (plaster, masonry, boards, loft space) */
  rStructure: number;
  /** depth of joists/studs/rafters the first insulation sits between (0 = no framing) */
  framingMm: number;
  /** share of the framed layer that is timber (0–1) */
  timberFraction: number;
}

export type WarningCode =
  | "asbestosRisk"
  | "oldMineralWool"
  | "cavityLimit"
  | "targetNotReached"
  | "noTarget";

export interface ExistingMaterial extends Partial<Sourced> {
  id: string;
  label: string;
  lambda: number;
  warning?: WarningCode;
}

export type ZoneKind = "none" | "usClimate" | "frZone";

export interface MarketData {
  id: MarketId;
  locale: string;
  currency: string;
  defaultUnits: "imperial" | "metric";
  /** how R is shown: "ip" → R-38, "si" → R 6.7 m²K/W */
  rDisplay: "ip" | "si";
  /** enabled areas in display order */
  areas: AreaType[];
  zoneKind: ZoneKind;
  defaultZone?: string;
  tiers: TargetTier[];
  defaultTier: string;
  products: Product[];
  defaultProduct: Partial<Record<AreaType, string>>;
  existing: ExistingMaterial[];
  /** material group names in the market language */
  materialLabels: Partial<Record<MaterialId, string>>;
  /** display length unit for metric depths */
  metricDepthUnit: "mm" | "cm";
  /** default waste allowance, % */
  defaultWastePct: number;
  /** typical opening sizes for the walls area helper, m² */
  openings: { doorM2: number; windowM2: number };
  /** cavity depth presets for areas where insulation sits in a closed cavity; defaultIndex null = not limited */
  cavities?: Partial<Record<AreaType, { options: { label: string; mm: number }[]; defaultIndex: number | null }>>;
  /** required for every area used by an elementU tier */
  conventions: Partial<Record<AreaType, AreaConvention>>;
  sources: Source[];
}

export type ExistingInput =
  | { kind: "none" }
  | { kind: "thickness"; mm: number; materialId: string }
  | { kind: "r"; rSI: number }
  | { kind: "u"; u: number };

export interface CalcInput {
  area: AreaType;
  areaM2: number;
  existing: ExistingInput;
  tierId: string;
  zone?: string;
  productId: string;
  wastePct: number;
  /** closed cavity depth (walls / sloped roofs). New + existing insulation must fit. */
  cavityMm?: number;
  /** price per package (or per m²·mm for spray), overrides the data range */
  priceOverride?: number;
}

export interface Layer {
  mm: number;
  rSI: number;
  label?: string;
  packages: number;
  coverageM2: number;
  cost: PriceRange;
}

export interface MathStep {
  key: string;
  values: Record<string, number | string>;
}

export interface CalcResult {
  status: "ok" | "alreadyMet" | "invalid";
  basis: "insulationR" | "elementU";
  areaM2: number;
  /** area including waste allowance, used for quantities */
  quantityAreaM2: number;
  /** effective insulation R the target requires */
  targetRSI: number;
  /** effective insulation R already in place */
  existingRSI: number;
  /** effective insulation R after adding the selection */
  afterRSI: number;
  /** declared R of what you add */
  addedRSI: number;
  /** effective R still missing after the selection (0 when target met) */
  shortfallRSI: number;
  targetU?: number;
  currentU?: number;
  afterU?: number;
  /** thickness added (installed thickness for loose-fill) */
  depthMm: number;
  settledMm?: number;
  layers: Layer[];
  bags?: number;
  /** total packages (layers + bags) */
  packages: number;
  packageUnit?: PackageUnit;
  cost: PriceRange;
  warnings: WarningCode[];
  steps: MathStep[];
}
