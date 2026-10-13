import { describe, expect, it } from "vitest";
import { calculate } from "./calculate";
import { rectangleM2, wallsM2 } from "./area";
import { stackR } from "./stack";
import { resolveTarget, zoneKeys } from "./targets";
import { fixtureElementU as EU, fixtureInsulationR as US } from "./test-fixtures";
import type { CalcInput } from "./types";
import { feet, inches, lb, pcf, perBoardFoot, rIP, sqft } from "./units";

const ATTIC_1200 = sqft(1200);
const QTY_1200 = sqft(1200) * 1.1;

const usAttic = (over: Partial<CalcInput> = {}): CalcInput => ({
  area: "attic",
  areaM2: ATTIC_1200,
  existing: { kind: "none" },
  tierId: "code",
  zone: "5A",
  productId: "batt",
  wastePct: 10,
  ...over,
});

describe("zones and targets", () => {
  it("expands zone keys from specific to general", () => {
    expect(zoneKeys("5A")).toEqual(["5A", "5"]);
    expect(zoneKeys("4C")).toEqual(["4C", "4"]);
    expect(zoneKeys("7")).toEqual(["7"]);
    expect(zoneKeys("H1b")).toEqual(["H1b", "H1"]);
  });

  it("resolves zoned targets with fallback and explicit marine key", () => {
    expect(resolveTarget(US, "code", "attic", "5B")?.value).toBeCloseTo(rIP(60), 9);
    expect(resolveTarget(US, "code", "attic", "4A")?.value).toBeCloseTo(rIP(49), 9);
    expect(resolveTarget(US, "code", "attic", "4C")?.value).toBeCloseTo(rIP(60), 9);
    expect(resolveTarget(US, "flat", "attic")?.value).toBeCloseTo(rIP(49), 9);
    expect(resolveTarget(US, "flat", "wall")).toBeNull();
  });
});

describe("area helpers", () => {
  it("computes rectangles and net wall area", () => {
    expect(rectangleM2(feet(40), feet(30))).toBeCloseTo(sqft(1200), 9);
    expect(wallsM2({ perimeterM: 40, heightM: 2.5, doors: 1, windows: 2, doorM2: 2, windowM2: 1.5 })).toBeCloseTo(95, 9);
    expect(wallsM2({ perimeterM: 2, heightM: 1, doors: 1, windows: 0, doorM2: 5, windowM2: 1 })).toBe(0);
  });
});

describe("stackR (parallel-path framing)", () => {
  const framing = { framingMm: 150, timberFraction: 0.1 };
  it("uses the framed conductivity inside the joists and plain conductivity above", () => {
    // 150 mm framed at λ_eff = 0.9·0.035 + 0.1·0.13 = 0.0445, plus 50 mm free at 0.035
    expect(stackR([{ mm: 200, lambda: 0.035 }], framing)).toBeCloseTo(0.15 / 0.0445 + 0.05 / 0.035, 9);
  });
  it("fills framing from the bottom across layers", () => {
    const r = stackR(
      [
        { mm: 100, lambda: 0.045 },
        { mm: 100, lambda: 0.035 },
      ],
      framing,
    );
    expect(r).toBeCloseTo(0.1 / 0.0535 + 0.05 / 0.0445 + 0.05 / 0.035, 9);
  });
  it("is plain d/λ without framing", () => {
    expect(stackR([{ mm: 100, lambda: 0.04 }])).toBeCloseTo(2.5, 12);
  });
});

describe("calculate · insulation-R basis (US style)", () => {
  it("prefers the fewest layers, then the thinnest stack", () => {
    const r = calculate(usAttic(), US);
    expect(r.status).toBe("ok");
    expect(r.layers.map((l) => l.label)).toEqual(["R-30", "R-30"]);
    const perLayer = Math.ceil(QTY_1200 / sqft(58.67));
    expect(perLayer).toBe(23);
    expect(r.layers.every((l) => l.packages === perLayer)).toBe(true);
    expect(r.packages).toBe(46);
    expect(r.cost).toEqual({ low: 46 * 45, high: 46 * 55 });
    expect(r.depthMm).toBeCloseTo(inches(20), 9);
    expect(r.targetRSI).toBeCloseTo(rIP(60), 9);
    expect(r.shortfallRSI).toBe(0);
    expect(r.packageUnit).toBe("bag");
  });

  it("uses an exact loose-fill chart row", () => {
    const r = calculate(usAttic({ productId: "cellulose", existing: { kind: "r", rSI: rIP(11) } }), US);
    expect(r.bags).toBe(Math.ceil(QTY_1200 / sqft(18)));
    expect(r.bags).toBe(74);
    expect(r.depthMm).toBeCloseTo(inches(15.5), 9);
    expect(r.settledMm).toBeCloseTo(inches(13.4), 9);
    expect(r.cost).toEqual({ low: 74 * 15, high: 74 * 18 });
    expect(r.addedRSI).toBeCloseTo(rIP(49), 9);
  });

  it("interpolates between chart rows", () => {
    const r = calculate(usAttic({ productId: "cellulose", existing: { kind: "r", rSI: rIP(16.5) } }), US);
    expect(r.bags).toBe(Math.ceil(QTY_1200 / sqft(20.5)));
    expect(r.depthMm).toBeCloseTo(inches(13.75), 9);
  });

  it("falls back to physics outside the chart range", () => {
    const r = calculate(usAttic({ productId: "cellulose", existing: { kind: "r", rSI: rIP(40) } }), US);
    const settledMm = rIP(20) * 0.039 * 1000;
    const kg = QTY_1200 * (settledMm / 1000) * pcf(1.6);
    expect(r.settledMm).toBeCloseTo(settledMm, 9);
    expect(r.depthMm).toBeCloseTo(settledMm * 1.15, 9);
    expect(r.bags).toBe(Math.ceil(kg / lb(25)));
  });

  it("reports already-met targets without buying anything", () => {
    const r = calculate(usAttic({ existing: { kind: "r", rSI: rIP(60) } }), US);
    expect(r.status).toBe("alreadyMet");
    expect(r.packages).toBe(0);
    expect(r.layers).toEqual([]);
    expect(r.cost).toEqual({ low: 0, high: 0 });
  });

  it("caps in-cavity products at the cavity depth and reports the shortfall", () => {
    const r = calculate(usAttic({ area: "wall", cavityMm: inches(3.5) }), US);
    expect(r.layers.map((l) => l.label)).toEqual(["R-13"]);
    expect(r.warnings).toContain("cavityLimit");
    expect(r.shortfallRSI).toBeCloseTo(rIP(7), 9);
  });

  it("sizes spray foam by depth and prices it per m²·mm", () => {
    const r = calculate(usAttic({ area: "wall", areaM2: 100, productId: "sprayClosed", cavityMm: inches(5.5) }), US);
    const mm = (20 / 6.5) * 25.4;
    expect(r.depthMm).toBeCloseTo(mm, 6);
    expect(r.cost.low).toBeCloseTo(100 * mm * perBoardFoot(1), 6);
    expect(r.cost.high).toBeCloseTo(100 * mm * perBoardFoot(1.5), 6);
    expect(r.warnings).not.toContain("cavityLimit");
  });

  it("flags vermiculite as a possible asbestos risk", () => {
    const r = calculate(usAttic({ existing: { kind: "thickness", mm: inches(4), materialId: "vermiculite" } }), US);
    expect(r.warnings).toContain("asbestosRisk");
    expect(r.existingRSI).toBeCloseTo(rIP(8.52), 6);
  });

  it("applies a price override per package", () => {
    const r = calculate(usAttic({ priceOverride: 50 }), US);
    expect(r.cost).toEqual({ low: 46 * 50, high: 46 * 50 });
  });

  it("rejects invalid input", () => {
    expect(calculate(usAttic({ areaM2: 0 }), US).status).toBe("invalid");
    const noTarget = calculate(usAttic({ area: "wall", tierId: "flat" }), US);
    expect(noTarget.status).toBe("invalid");
    expect(noTarget.warnings).toContain("noTarget");
  });

  it("explains the math step by step", () => {
    const r = calculate(usAttic(), US);
    expect(r.steps.map((s) => s.key)).toEqual(["target", "existing", "add", "quantityArea", "layers", "cost"]);
  });
});

describe("calculate · grant tiers that count new insulation only", () => {
  const market = {
    ...US,
    tiers: [...US.tiers, { id: "newOnly", label: "New only", basis: "insulationR" as const, newOnly: true, values: { attic: rIP(30) }, source: "fixture" }],
  };
  it("ignores existing insulation when sizing the new layer", () => {
    const r = calculate(usAttic({ tierId: "newOnly", existing: { kind: "r", rSI: rIP(19) } }), market);
    expect(r.status).toBe("ok");
    expect(r.addedRSI).toBeGreaterThanOrEqual(rIP(30) - 1e-9);
    expect(r.layers.map((l) => l.label)).toEqual(["R-30"]);
    expect(r.targetRSI).toBeCloseTo(rIP(49), 9);
  });
  it("is never already met by existing insulation alone", () => {
    const r = calculate(usAttic({ tierId: "newOnly", existing: { kind: "r", rSI: rIP(60) } }), market);
    expect(r.status).toBe("ok");
  });
});

describe("calculate · element-U basis (EU style)", () => {
  const euAttic = (over: Partial<CalcInput> = {}): CalcInput => ({
    area: "attic",
    areaM2: 50,
    existing: { kind: "none" },
    tierId: "geg",
    productId: "roll035",
    wastePct: 10,
    ...over,
  });

  it("derives the needed insulation R from the target U and picks one 200 mm layer", () => {
    const r = calculate(euAttic(), EU);
    expect(r.basis).toBe("elementU");
    expect(r.targetRSI).toBeCloseTo(1 / 0.24 - 0.2, 9);
    expect(r.layers.map((l) => l.mm)).toEqual([200]);
    const after = 0.15 / 0.0445 + 0.05 / 0.035;
    expect(r.afterRSI).toBeCloseTo(after, 9);
    expect(r.afterU).toBeCloseTo(1 / (0.2 + after), 9);
    expect(r.currentU).toBeCloseTo(5, 9);
    expect(r.targetU).toBe(0.24);
    expect(r.layers[0].packages).toBe(Math.ceil(55 / 5));
  });

  it("stacks new insulation on top of existing insulation inside the joists", () => {
    const r = calculate(euAttic({ existing: { kind: "thickness", mm: 100, materialId: "oldWool" } }), EU);
    expect(r.existingRSI).toBeCloseTo(0.1 / 0.0535, 9);
    expect(r.layers.map((l) => l.mm)).toEqual([100]);
    expect(r.afterRSI).toBeCloseTo(0.1 / 0.0535 + 0.05 / 0.0445 + 0.05 / 0.035, 9);
    expect(r.currentU).toBeCloseTo(1 / (0.2 + 0.1 / 0.0535), 9);
    expect(r.warnings).toContain("oldMineralWool");
  });

  it("fills the whole cavity with cavity-fill products and prices them per m²", () => {
    const market = {
      ...EU,
      products: [
        ...EU.products,
        {
          id: "cavityFill",
          material: "blownFiberglass" as const,
          form: "spray" as const,
          name: "Cavity fill",
          lambda: 0.04,
          areas: ["wall" as const],
          betweenFraming: true,
          fillsCavity: true,
          spray: { pricePerM2: { low: 20, high: 28 } },
          priceDate: "2026-10",
          source: "fixture",
        },
      ],
      tiers: [...EU.tiers, { id: "cavity", label: "Cavity", basis: "elementU" as const, values: { wall: 0.55 }, source: "fixture" }],
    };
    const r = calculate(euAttic({ area: "wall", areaM2: 80, tierId: "cavity", productId: "cavityFill", cavityMm: 65 }), market);
    expect(r.depthMm).toBe(65);
    expect(r.afterRSI).toBeCloseTo(0.065 / 0.04, 9);
    expect(r.cost).toEqual({ low: 80 * 20, high: 80 * 28 });
    expect(r.warnings).not.toContain("cavityLimit");
    const tooThin = calculate(euAttic({ area: "wall", areaM2: 80, tierId: "geg", productId: "cavityFill", cavityMm: 50 }), market);
    expect(tooThin.depthMm).toBe(50);
    expect(tooThin.warnings).toContain("cavityLimit");
  });

  it("uses a known existing U-value", () => {
    const r = calculate(euAttic({ area: "wall", existing: { kind: "u", u: 1.4 } }), EU);
    expect(r.existingRSI).toBeCloseTo(1 / 1.4 - 0.67, 9);
    expect(r.layers.map((l) => l.mm)).toEqual([140]);
    expect(r.afterU).toBeCloseTo(1 / (0.67 + (1 / 1.4 - 0.67) + 4), 9);
  });
});
