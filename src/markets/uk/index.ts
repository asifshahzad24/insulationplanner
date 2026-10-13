// United Kingdom (England): targets are limiting U-values from Approved Document L 2021, Volume 1.
// Research with all sources: docs/research/uk.json
import type { MarketData, Thickness } from "@/engine/types";

const PRICE_DATE = "2026-10";

/** Board/roll row: thickness mm, λ, m² per pack, price per pack. */
const t = (mm: number, lambda: number, m2: number, low: number, high = low): Thickness => ({
  mm,
  rSI: Math.round((mm / 1000 / lambda) * 1000) / 1000,
  coverageM2: m2,
  price: { low, high },
});

/** Price per pack from a £/m² range. */
const perM2 = (m2: number, low: number, high: number) => [Math.round(m2 * low * 100) / 100, Math.round(m2 * high * 100) / 100] as const;

const CAVITIES = [50, 65, 75, 85, 100].map((mm) => ({ label: `${mm} mm cavity`, mm }));

export const uk: MarketData = {
  id: "uk",
  locale: "en-GB",
  currency: "GBP",
  defaultUnits: "metric",
  rDisplay: "si",
  areas: ["attic", "wall", "solidWall", "floor", "roof"],
  zoneKind: "none",
  metricDepthUnit: "mm",
  defaultWastePct: 10,
  openings: { doorM2: 1.9, windowM2: 1.5 },

  tiers: [
    {
      id: "regs",
      label: "Building Regs (Part L)",
      description:
        "Improved U-values for upgrading existing elements (Approved Document L 2021, Table 4.3). Loft 0.16, cavity fill 0.55, solid walls 0.30, floors 0.25.",
      basis: "elementU",
      values: { attic: 0.16, roof: 0.16, wall: 0.55, solidWall: 0.3, floor: 0.25 },
      source: "adl2021",
      confidence: "high",
      note: "The 2026 edition (in force 24 March 2027) keeps the same existing-dwelling values. Wales and Scotland differ.",
    },
    {
      id: "best",
      label: "New-build standard",
      description:
        "U-values for new elements in existing homes (Approved Document L 2021, Table 4.2): roof 0.15, walls 0.18, floors 0.18. A cavity wall can only be filled, so it has no separate value here.",
      basis: "elementU",
      values: { attic: 0.15, roof: 0.15, solidWall: 0.18, floor: 0.18 },
      source: "adl2021",
      confidence: "high",
    },
  ],
  defaultTier: "regs",

  products: [
    {
      id: "loftRoll44",
      material: "fiberglass",
      form: "roll",
      name: "Glass mineral wool loft roll (λ 0.044)",
      lambda: 0.044,
      packageUnit: "roll",
      areas: ["attic", "floor"],
      betweenFraming: true,
      thicknesses: [
        t(100, 0.044, 13.89, ...perM2(13.89, 2.44, 5.9)),
        t(150, 0.044, 9.18, ...perM2(9.18, 9.52, 10.9)),
        t(170, 0.044, 8.01, ...perM2(8.01, 4.17, 12.36)),
        t(200, 0.044, 6.84, ...perM2(6.84, 4.81, 7.2)),
      ],
      priceDate: PRICE_DATE,
      source: "knauf_lr44",
      confidence: "medium",
      note: "Roll sizes: Knauf Loft Roll 44 Combi-cut. Prices per m² from Wickes, Toolstation and Travis Perkins (14 Oct 2026), converted per roll; multibuy offers make the low end. B&Q was unavailable.",
    },
    {
      id: "pir",
      material: "polyiso",
      form: "board",
      name: "PIR insulation board 2400 × 1200 mm (λ 0.022)",
      lambda: 0.022,
      packageUnit: "board",
      areas: ["roof", "solidWall", "floor", "attic"],
      betweenFraming: true,
      thicknesses: [
        t(25, 0.022, 2.88, 26.99, 33.46),
        t(50, 0.022, 2.88, 37.99, 45.55),
        t(75, 0.022, 2.88, 45.99, 64.32),
        t(100, 0.022, 2.88, 52.98, 55),
        t(120, 0.022, 2.88, 59.99),
      ],
      priceDate: PRICE_DATE,
      source: "soprema_ga4000",
      confidence: "medium",
      note: "SOPRATHERM (Celotex) GA4000 / Kingspan TP10. Prices Wickes, Toolstation, Travis Perkins.",
    },
    {
      id: "eps70",
      material: "eps",
      form: "board",
      name: "EPS 70 floor board 2400 × 1200 mm (λ 0.038)",
      lambda: 0.038,
      packageUnit: "board",
      areas: ["floor", "solidWall"],
      betweenFraming: false,
      thicknesses: [t(25, 0.038, 2.88, 8.5), t(50, 0.038, 2.88, 19), t(75, 0.038, 2.88, 28)],
      priceDate: PRICE_DATE,
      source: "wickes_boards",
      confidence: "medium",
      note: "Jablite Jabfloor 70. Prices Wickes (promotional).",
    },
    {
      id: "cavityFill",
      material: "blownFiberglass",
      form: "spray",
      name: "Blown mineral wool cavity fill (installer)",
      lambda: 0.04,
      areas: ["wall"],
      betweenFraming: true,
      fillsCavity: true,
      spray: { pricePerM2: { low: 20, high: 27.5 } },
      priceDate: PRICE_DATE,
      source: "knauf_supafil40",
      confidence: "low",
      note: "Knauf Supafil 40. Energy Saving Trust puts cavity wall insulation at about £2,200 for a typical home; assuming 80–110 m² of external wall gives £20–27.50 per m² (estimate).",
    },
    {
      id: "blownLoft",
      material: "blownFiberglass",
      form: "spray",
      name: "Blown mineral wool loft insulation (installer)",
      lambda: 0.045,
      areas: ["attic"],
      betweenFraming: false,
      spray: { pricePerM2Mm: { low: 750 / 55 / 270, high: 750 / 40 / 270 } },
      priceDate: PRICE_DATE,
      source: "supafil_loft",
      confidence: "low",
      note: "λ 0.045: Knauf Supafil Loft 045. Energy Saving Trust: about £750 to insulate a typical loft from 0 to 270 mm; assuming a 40–55 m² loft gives £13.60–£18.75 per m² at 270 mm (estimate).",
    },
  ],
  defaultProduct: { attic: "loftRoll44", roof: "pir", wall: "cavityFill", solidWall: "pir", floor: "loftRoll44" },

  existing: [
    { id: "mineralWool", label: "Mineral wool (loft roll, batts)", lambda: 0.04, source: "rdsap10", confidence: "medium" },
    { id: "eps", label: "Polystyrene (EPS)", lambda: 0.04, source: "rdsap10", confidence: "medium" },
    {
      id: "vermiculite",
      label: "Vermiculite (pebbly loose fill)",
      lambda: 0.0254 / (2.7 * 0.1761101838),
      warning: "asbestosRisk",
      source: "hse_asbestos",
      confidence: "medium",
    },
  ],
  materialLabels: {
    fiberglass: "Mineral wool",
    polyiso: "PIR board",
    eps: "EPS board",
    blownFiberglass: "Blown (installer)",
  },
  cavities: {
    wall: { options: CAVITIES, defaultIndex: 1 },
  },
  conventions: {
    // Rsi/Rse per BS EN ISO 6946 (BR 443). Structure values are calibrated so reference
    // build-ups match published results: 100 + 170 mm loft roll (12.8 % timber) = U 0.16
    // (Knauf/RdSAP); filled 65 mm cavity ≈ 0.43 (Knauf table); 150 mm between floor joists
    // ≈ 0.25 (EST); solid 225 mm brick as built = 1.7 (RdSAP).
    attic: { rsi: 0.1, rse: 0.04, rStructure: 0.43, framingMm: 100, timberFraction: 0.128 },
    roof: { rsi: 0.1, rse: 0.1, rStructure: 0.06, framingMm: 100, timberFraction: 0.088 },
    wall: { rsi: 0.13, rse: 0.04, rStructure: 0.51, framingMm: 0, timberFraction: 0 },
    solidWall: { rsi: 0.13, rse: 0.04, rStructure: 0.42, framingMm: 0, timberFraction: 0 },
    floor: { rsi: 0.17, rse: 0.04, rStructure: 1.04, framingMm: 150, timberFraction: 0.108 },
  },

  sources: [
    { id: "adl2021", title: "Approved Document L, Volume 1: Dwellings (2021 edition incorporating 2023 amendments)", url: "https://assets.publishing.service.gov.uk/media/662a2e3e55e1582b6ca7e592/Approved_Document_L__Conservation_of_fuel_and_power__Volume_1_Dwellings__2021_edition_incorporating_2023_amendments.pdf", accessed: "2026-10-14" },
    { id: "adl2026", title: "GOV.UK: Approved Document L (2026 edition) — takes effect 24 March 2027", url: "https://www.gov.uk/government/publications/approved-document-l-2026", accessed: "2026-10-14" },
    { id: "br443", title: "BRE BR 443: Conventions for U-value calculations (2019)", url: "https://www.cibse.org/media/wzrjrf3l/conventions-for-u-value-calculations.pdf", accessed: "2026-10-14" },
    { id: "rdsap10", title: "RdSAP10 Specification (BRE, February 2024)", url: "https://bregroup.com/documents/d/bre-group/rdsap10-dt13-02-2024-1-pdf", accessed: "2026-10-14" },
    { id: "est_loft", title: "Energy Saving Trust: Roof and loft insulation", url: "https://energysavingtrust.org.uk/advice/roof-and-loft-insulation/", accessed: "2026-10-14" },
    { id: "est_cavity", title: "Energy Saving Trust: Cavity wall insulation", url: "https://energysavingtrust.org.uk/advice/cavity-wall-insulation/", accessed: "2026-10-14" },
    { id: "est_floor", title: "Energy Saving Trust: Floor insulation", url: "https://energysavingtrust.org.uk/advice/floor-insulation/", accessed: "2026-10-14" },
    { id: "est_solidwall", title: "Energy Saving Trust: Solid wall insulation", url: "https://energysavingtrust.org.uk/advice/solid-wall-insulation/", accessed: "2026-10-14" },
    { id: "knauf_lr44", title: "Knauf Insulation: Loft Roll 44 (Combi-cut)", url: "https://knauf.com/en-GB/p/product/loft-roll-44-combi-cut-26333_4206", accessed: "2026-10-14" },
    { id: "knauf_loft_guide", title: "Knauf Insulation: Loft Roll installation guide (2025)", url: "https://knauf.com/api/download-center/v1/assets/8bedb4b5-e85d-43ac-8ecb-3a2fb1fa09bc?download=true&country=gb", accessed: "2026-10-14" },
    { id: "knauf_solutions", title: "Knauf Insulation: UK & Ireland Insulation Solutions Guide (June 2026)", url: "https://knauf.com/api/download-center/v1/assets/ebadf176-5e33-4515-9ad0-fb5e6c674c8d?download=true&country=gb", accessed: "2026-10-14" },
    { id: "knauf_supafil40", title: "Knauf: Supafil 40 cavity wall insulation", url: "https://knauf.com/en-GB/p/product/supafil-r-40-26377_4206", accessed: "2026-10-14" },
    { id: "supafil_loft", title: "ACERMI certificate 04/D/016/378 — Knauf Supafil Loft 045", url: "https://acermi.com/en/certified-insulation-products/certificate/04-d-016-378-27/", accessed: "2026-10-14" },
    { id: "soprema_ga4000", title: "SOPREMA UK: SOPRATHERM GA4000 (previously Celotex GA4000)", url: "https://www.soprema.co.uk/products/sopratherm-ga4000", accessed: "2026-10-14" },
    { id: "wickes_boards", title: "Wickes: insulation boards (prices)", url: "https://www.wickes.co.uk/Products/Building-Materials/Insulation/Insulation-Boards/c/1000272", accessed: "2026-10-14" },
    { id: "wickes_loft", title: "Wickes: loft insulation (prices)", url: "https://www.wickes.co.uk/Products/Building-Materials/Insulation/Loft-Insulation+Accessories/Loft-Insulation/c/1000270", accessed: "2026-10-14" },
    { id: "toolstation", title: "Toolstation: insulation (prices)", url: "https://www.toolstation.com/construction-insulation/insulation/c754", accessed: "2026-10-14" },
    { id: "hse_asbestos", title: "HSE: Asbestos — location of materials (loose-fill)", url: "https://www.hse.gov.uk/asbestos/location-materials.htm", accessed: "2026-10-14" },
  ],
};
