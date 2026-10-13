// United States market data. Authored in US units, converted to SI by the helpers.
// Research notes and full source list: docs/research/us.json
import type { AreaType, MarketData, Thickness } from "@/engine/types";
import { inches, lb, pcf, perBoardFoot, rIP, sqft } from "@/engine/units";

const PRICE_DATE = "2026-10";

/** Batt/board thickness row in US units. */
const t = (inch: number, r: number, sqftPerPack: number, low: number, high = low): Thickness => ({
  mm: inches(inch),
  rSI: rIP(r),
  coverageM2: sqft(sqftPerPack),
  price: { low, high },
  label: `R-${r}`,
});

/** Loose-fill chart row: R, sq ft per bag, settled in, installed in. */
const row = (r: number, sqftPerBag: number, settledIn: number, installedIn: number) => ({
  rSI: rIP(r),
  m2PerBag: sqft(sqftPerBag),
  settledMm: inches(settledIn),
  installedMm: inches(installedIn),
});

/** λ (W/m·K) from an R-per-inch value. */
const lambdaFromRpi = (rpi: number) => 0.0254 / rIP(rpi);

/** Targets by IECC zone key for one area (zone 0 shares zone 1's row). */
type ZoneRow = Partial<Record<AreaType, number>>;
const zones = (rows: Record<string, Partial<Record<AreaType, number>>>) => {
  const out: Record<string, ZoneRow> = {};
  for (const [zone, values] of Object.entries(rows)) {
    out[zone] = Object.fromEntries(Object.entries(values).map(([a, r]) => [a, rIP(r as number)])) as ZoneRow;
  }
  return out;
};

export const us: MarketData = {
  id: "us",
  locale: "en-US",
  currency: "USD",
  defaultUnits: "imperial",
  rDisplay: "ip",
  areas: ["attic", "wall", "floor", "basementWall", "roof"],
  zoneKind: "usClimate",
  defaultZone: "5A",
  metricDepthUnit: "cm",
  defaultWastePct: 10,
  openings: { doorM2: sqft(21), windowM2: sqft(12) },

  tiers: [
    {
      id: "recommended",
      label: "DOE / ENERGY STAR recommended",
      description: "The 2021 IECC levels that ENERGY STAR recommends for existing homes.",
      basis: "insulationR",
      source: "estar_rvalues",
      confidence: "high",
      note:
        "ENERGY STAR's retrofit table is based on 2021 IECC Table R402.1.3. Walls and basement walls use the code's cavity-only option. Zone 0 shares zone 1.",
      byZone: zones({
        "0": { attic: 30, roof: 30, wall: 13, floor: 13 },
        "1": { attic: 30, roof: 30, wall: 13, floor: 13 },
        "2": { attic: 49, roof: 49, wall: 13, floor: 13 },
        "3": { attic: 49, roof: 49, wall: 20, floor: 19, basementWall: 13 },
        "4": { attic: 60, roof: 60, wall: 30, floor: 19, basementWall: 13 },
        "4C": { attic: 60, roof: 60, wall: 30, floor: 30, basementWall: 19 },
        "5": { attic: 60, roof: 60, wall: 30, floor: 30, basementWall: 19 },
        "6": { attic: 60, roof: 60, wall: 30, floor: 30, basementWall: 19 },
        "7": { attic: 60, roof: 60, wall: 30, floor: 38, basementWall: 19 },
        "8": { attic: 60, roof: 60, wall: 30, floor: 38, basementWall: 19 },
      }),
    },
  ],
  defaultTier: "recommended",

  products: [
    {
      id: "fgWall",
      material: "fiberglass",
      form: "batt",
      name: "Fiberglass batts, 15 in wide (16 in o.c. walls)",
      lambda: lambdaFromRpi(3.7),
      packageUnit: "bag",
      areas: ["wall", "basementWall"],
      betweenFraming: true,
      thicknesses: [
        t(3.5, 13, 125.94, 60.98, 90.45),
        t(3.5, 15, 67.81, 46.67, 68.47),
        t(5.5, 21, 67.81, 86.57, 97.33),
        t(6.25, 19, 77.5, 72.34, 80.37),
      ],
      priceDate: PRICE_DATE,
      source: "oc_pink_fs",
      confidence: "medium",
      note: "Coverage from Owens Corning fact sheet (kraft-faced 15 × 93 in). Prices: Home Depot, Lowe's, Menards listings.",
    },
    {
      id: "fgAttic",
      material: "fiberglass",
      form: "batt",
      name: "Fiberglass batts, 24 in wide (attics & floors)",
      lambda: lambdaFromRpi(3.2),
      packageUnit: "bag",
      areas: ["attic", "floor", "roof"],
      betweenFraming: true,
      thicknesses: [
        t(6.25, 19, 118.83, 119),
        t(9.5, 30, 88, 129.98),
        t(12, 38, 64, 117, 129),
        t(14, 49, 48, 107),
      ],
      priceDate: PRICE_DATE,
      source: "oc_pink_fs",
      confidence: "medium",
      note: "Owens Corning 23–24 in kraft-faced attic batts. Unfaced batts are the right choice when laying a second layer over existing insulation.",
    },
    {
      id: "mwBatt",
      material: "mineralWool",
      form: "batt",
      name: "Mineral wool batts, 15¼ in wide",
      lambda: lambdaFromRpi(4.2),
      packageUnit: "bag",
      areas: ["wall", "basementWall", "attic", "floor", "roof"],
      betweenFraming: true,
      thicknesses: [t(3.5, 15, 59.7, 84.98), t(5.5, 23, 39.8, 89.98), t(7.25, 30, 29.9, 96.97)],
      priceDate: PRICE_DATE,
      source: "rw_comfortbatt_fs",
      confidence: "medium",
    },
    {
      id: "cellulose",
      material: "blownCellulose",
      form: "loosefill",
      name: "Blown-in cellulose (25 lb bag)",
      lambda: lambdaFromRpi(3.65),
      packageUnit: "bag",
      areas: ["attic"],
      betweenFraming: false,
      loosefill: {
        bagKg: lb(25),
        settledDensity: pcf(1.52),
        settlingPct: 8,
        price: { low: 15.99, high: 17.97 },
        chart: [
          row(13, 65.8, 3.6, 3.9),
          row(19, 44.2, 5.3, 5.7),
          row(22, 38, 6.1, 6.6),
          row(30, 25.9, 8.3, 8.9),
          row(38, 19, 10.4, 11.2),
          row(44, 15.7, 12, 12.9),
          row(49, 14.1, 13.3, 14.3),
          row(60, 11.6, 16.1, 17.3),
        ],
      },
      priceDate: PRICE_DATE,
      source: "gf_sanctuary",
      confidence: "high",
      note: "Coverage chart: GreenFiber SANCTUARY attic card Rev K (05/26). Price: Menards 25 lb blow-in cellulose, before/after rebate.",
    },
    {
      id: "blownFiberglass",
      material: "blownFiberglass",
      form: "loosefill",
      name: "Blown-in fiberglass (28.6 lb bag)",
      lambda: lambdaFromRpi(2.92),
      packageUnit: "bag",
      areas: ["attic"],
      betweenFraming: false,
      loosefill: {
        bagKg: lb(28.6),
        settledDensity: pcf(0.525),
        settlingPct: 0,
        price: { low: 43.29, high: 48.64 },
        chart: [
          row(11, 188.4, 4, 4),
          row(13, 156.6, 4.75, 4.75),
          row(19, 106.6, 6.75, 6.75),
          row(22, 91.4, 7.75, 7.75),
          row(26, 75.9, 9.125, 9.125),
          row(30, 65.5, 10.375, 10.375),
          row(38, 50.2, 13, 13),
          row(44, 42.7, 14.875, 14.875),
          row(49, 38, 16.375, 16.375),
          row(60, 30.1, 19.75, 19.75),
        ],
      },
      priceDate: PRICE_DATE,
      source: "knauf_ecofill_ds",
      confidence: "high",
      note: "Coverage chart: Knauf EcoFill Wx data sheet (04/25). Price: Menards, before/after rebate.",
    },
    {
      id: "polyiso",
      material: "polyiso",
      form: "board",
      name: "Polyiso foam board, foil-faced, 4×8 ft",
      lambda: lambdaFromRpi(6),
      packageUnit: "sheet",
      areas: ["basementWall", "wall", "roof", "floor"],
      betweenFraming: false,
      thicknesses: [t(1, 6, 32, 33.48), t(1.65, 10, 32, 37.48), t(2, 13, 32, 55.78)],
      priceDate: PRICE_DATE,
      source: "jm_ap_foil_page",
      confidence: "medium",
      note: "R per thickness from Johns Manville AP Foil-Faced listings; prices Menards.",
    },
    {
      id: "xps",
      material: "xps",
      form: "board",
      name: "XPS foam board, 4×8 ft",
      lambda: lambdaFromRpi(5),
      packageUnit: "sheet",
      areas: ["basementWall", "wall", "floor"],
      betweenFraming: false,
      thicknesses: [t(0.5, 3, 32, 22.97), t(1, 5, 32, 29.97), t(1.5, 7.5, 32, 46.22), t(2, 10, 32, 54.27, 58.67)],
      priceDate: PRICE_DATE,
      source: "oc_foamular_ngx_sheet",
      confidence: "high",
      note: "Owens Corning FOAMULAR NGX R-values (180-day aged, 75 °F); prices Menards.",
    },
    {
      id: "eps",
      material: "eps",
      form: "board",
      name: "EPS foam board, 4×8 ft",
      lambda: lambdaFromRpi(3.9),
      packageUnit: "sheet",
      areas: ["basementWall", "wall"],
      betweenFraming: false,
      thicknesses: [t(1, 4, 32, 12.98, 14.68), t(3, 11.7, 32, 34.99)],
      priceDate: PRICE_DATE,
      source: "menards_foam",
      confidence: "medium",
      note: "Retail-labelled R-values and prices (Menards foam board category).",
    },
    {
      id: "sprayOpen",
      material: "sprayOpen",
      form: "spray",
      name: "Open-cell spray foam (installed)",
      lambda: lambdaFromRpi(3.7),
      areas: ["wall", "roof"],
      betweenFraming: true,
      spray: { pricePerM2Mm: { low: perBoardFoot(0.43), high: perBoardFoot(1.0) } },
      priceDate: PRICE_DATE,
      source: "homeguide_spray",
      confidence: "low",
      note: "Installed $1.50–$3.50 per sq ft (HomeGuide 2026) spread over a typical 3.5 in fill = $0.43–$1.00 per board foot. Minimum job fees of $1,000–$2,000 are common.",
    },
    {
      id: "sprayClosed",
      material: "sprayClosed",
      form: "spray",
      name: "Closed-cell spray foam (installed)",
      lambda: lambdaFromRpi(6.5),
      areas: ["wall", "roof", "basementWall", "floor"],
      betweenFraming: true,
      spray: { pricePerM2Mm: { low: perBoardFoot(1.5), high: perBoardFoot(2.5) } },
      priceDate: PRICE_DATE,
      source: "homeguide_spray",
      confidence: "low",
      note: "Installed $3–$5 per sq ft (HomeGuide 2026) spread over a typical 2 in layer = $1.50–$2.50 per board foot. R-6.5/in per DOE.",
    },
  ],
  defaultProduct: {
    attic: "cellulose",
    wall: "fgWall",
    floor: "fgAttic",
    basementWall: "fgWall",
    roof: "fgAttic",
  },

  existing: [
    { id: "fgBatts", label: "Fiberglass batts", lambda: lambdaFromRpi(3.2), source: "estar_diy", confidence: "high" },
    { id: "looseFiberglass", label: "Loose fiberglass", lambda: lambdaFromRpi(2.5), source: "estar_diy", confidence: "high" },
    { id: "cellulose", label: "Cellulose", lambda: lambdaFromRpi(3.7), source: "estar_diy", confidence: "high" },
    { id: "rockWool", label: "Rock wool (loose)", lambda: lambdaFromRpi(2.8), source: "estar_diy", confidence: "high" },
    {
      id: "vermiculite",
      label: "Vermiculite (pebbly granules)",
      lambda: lambdaFromRpi(2.7),
      warning: "asbestosRisk",
      source: "epa_vermiculite",
      confidence: "high",
    },
  ],
  materialLabels: {
    blownCellulose: "Blown cellulose",
    blownFiberglass: "Blown fiberglass",
    fiberglass: "Fiberglass batts",
    mineralWool: "Mineral wool batts",
    polyiso: "Polyiso board",
    xps: "XPS board",
    eps: "EPS board",
    sprayOpen: "Open-cell spray foam",
    sprayClosed: "Closed-cell spray foam",
  },
  cavities: {
    wall: { options: US_CAVITY_OPTIONS(), defaultIndex: 0 },
    basementWall: { options: US_CAVITY_OPTIONS(), defaultIndex: 0 },
    roof: { options: US_CAVITY_OPTIONS(), defaultIndex: 3 },
  },
  conventions: {},

  sources: [
    { id: "estar_rvalues", title: "ENERGY STAR: Recommended Home Insulation R-Values", url: "https://www.energystar.gov/saveathome/seal_insulate/identify-problems-you-want-fix/diy-checks-inspections/insulation-r-values", accessed: "2026-10-14" },
    { id: "pnnl_iecc_compare", title: "PNNL Building America Solution Center: 2009–2021 IECC minimum insulation requirements", url: "https://basc.pnnl.gov/information/2009-2021-iecc-and-irc-minimum-insulation-requirements-new-homes", accessed: "2026-10-14" },
    { id: "doe_hic_2021iecc", title: "U.S. DOE: Insulation and air-sealing essentials (2021 IECC minimum R-values)", url: "https://www.energy.gov/cmei/buildings/articles/energy-efficient-home-improvement-credit-insulation-and-air-sealing", accessed: "2026-10-14" },
    { id: "pnnl_33270", title: "PNNL-33270: Guide to Determining Climate Zone by County (IECC 2021)", url: "https://www.pnnl.gov/main/publications/external/technical_reports/PNNL-33270.pdf", accessed: "2026-10-14" },
    { id: "census_zcta", title: "US Census Bureau: 2020 ZCTA to County Relationship File", url: "https://www2.census.gov/geo/docs/maps-data/data/rel2020/zcta520/tab20_zcta520_county20_natl.txt", accessed: "2026-10-14" },
    { id: "estar_diy", title: "ENERGY STAR: DIY checks and inspections (depth multipliers)", url: "https://www.energystar.gov/saveathome/seal_insulate/identify-problems-you-want-fix/diy-checks-inspections", accessed: "2026-10-14" },
    { id: "epa_vermiculite", title: "U.S. EPA: Asbestos-contaminated vermiculite insulation", url: "https://www.epa.gov/asbestos/protect-your-family-asbestos-contaminated-vermiculite-insulation", accessed: "2026-10-14" },
    { id: "doe_guide_2009", title: "U.S. DOE: Guide to Home Insulation", url: "https://www.energy.gov/sites/prod/files/guide_to_home_insulation.pdf", accessed: "2026-10-14" },
    { id: "oc_pink_fs", title: "Owens Corning PINK Next Gen Fiberglas fact sheet (Pub. 10025109-B)", url: "https://www.owenscorning.com/dms/10025109", accessed: "2026-10-14" },
    { id: "rw_comfortbatt_fs", title: "ROCKWOOL Comfortbatt R-value fact sheet", url: "https://editserver.rockwool.com/siteassets/o2-rockwool/documentation/brochures/residential/comfortbatt-r-value-expansion-fact-sheet_en.pdf", accessed: "2026-10-14" },
    { id: "gf_sanctuary", title: "GreenFiber SANCTUARY attic coverage chart (Rev K)", url: "https://www.greenfiber.com/uploads/documents/SANCTUARY-Attic-Card_Rev-K.pdf", accessed: "2026-10-14" },
    { id: "knauf_ecofill_ds", title: "Knauf EcoFill Wx blowing insulation product data", url: "https://www.buildsite.com/pdf/knauf/Perfomance-EcoFill-Blowing-Insulation-Product-Data-2968935.pdf", accessed: "2026-10-14" },
    { id: "oc_foamular_ngx_sheet", title: "Owens Corning FOAMULAR NGX product sheet", url: "https://www.owenscorning.com/dms/10017466", accessed: "2026-10-14" },
    { id: "jm_ap_foil_page", title: "Johns Manville AP Foil-Faced polyiso", url: "https://www.jm.com/content/jm/global/en/index/insulation-systems/building-insulation/ap-foil-faced-foam-continuous-insulation/", accessed: "2026-10-14" },
    { id: "menards_foam", title: "Menards: foam board insulation (retail prices)", url: "https://www.menards.com/main/building-materials/insulation/foam-board-insulation/c-5779.htm", accessed: "2026-10-14" },
    { id: "homeguide_spray", title: "HomeGuide: Spray foam insulation cost (2026)", url: "https://homeguide.com/costs/spray-foam-insulation-cost", accessed: "2026-10-14" },
    { id: "bm_paint_calc", title: "Benjamin Moore paint calculator (door 21 sq ft, window 12 sq ft deductions)", url: "https://www.benjaminmoore.com/en-us/paint-calculator", accessed: "2026-10-14" },
  ],
};

/** Wall/rafter cavity presets (nominal lumber → actual depth). */
function US_CAVITY_OPTIONS() {
  return [
    { label: "2×4 (3½ in)", mm: inches(3.5) },
    { label: "2×6 (5½ in)", mm: inches(5.5) },
    { label: "2×8 (7¼ in)", mm: inches(7.25) },
    { label: "2×10 (9¼ in)", mm: inches(9.25) },
    { label: "2×12 (11¼ in)", mm: inches(11.25) },
  ];
}
