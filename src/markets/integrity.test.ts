import { describe, expect, it } from "vitest";
import { calculate } from "@/engine/calculate";
import { resolveTarget } from "@/engine/targets";
import { MARKET_DATA } from "./index";

for (const market of Object.values(MARKET_DATA)) {
  describe(`market data · ${market.id}`, () => {
    const sourceIds = new Set(market.sources.map((s) => s.id));

    it("has unique ids", () => {
      for (const list of [market.tiers, market.products, market.existing, market.sources]) {
        const ids = list.map((x) => x.id);
        expect(new Set(ids).size, ids.join(",")).toBe(ids.length);
      }
    });

    it("cites a known source for every tier, product and existing material", () => {
      for (const x of [...market.tiers, ...market.products]) expect(sourceIds, `${x.id} → ${x.source}`).toContain(x.source);
      for (const x of market.existing) if (x.source) expect(sourceIds, `${x.id} → ${x.source}`).toContain(x.source);
    });

    it("has a default tier and a default product for every area", () => {
      expect(market.tiers.map((t) => t.id)).toContain(market.defaultTier);
      for (const area of market.areas) {
        const id = market.defaultProduct[area];
        const product = market.products.find((p) => p.id === id);
        expect(product, `${area} default`).toBeDefined();
        expect(product!.areas).toContain(area);
      }
    });

    it("offers at least one product per area and a target in at least one tier", () => {
      for (const area of market.areas) {
        expect(market.products.some((p) => p.areas.includes(area)), area).toBe(true);
        const anyTarget = market.tiers.some((tier) =>
          tier.byZone ? Object.values(tier.byZone).some((z) => z[area] != null) : tier.values?.[area] != null,
        );
        expect(anyTarget, area).toBe(true);
      }
    });

    it("has conventions for every area used by an element-U tier", () => {
      for (const tier of market.tiers.filter((t) => t.basis === "elementU")) {
        const areas = Object.keys(tier.values ?? {}) as (keyof typeof market.conventions)[];
        for (const area of areas) expect(market.conventions[area], `${tier.id}/${area}`).toBeDefined();
      }
    });

    it("has sane products: positive prices and coverage, plausible conductivity per thickness", () => {
      for (const p of market.products) {
        expect(p.lambda, p.id).toBeGreaterThan(0.015);
        expect(p.lambda, p.id).toBeLessThan(0.08);
        expect(p.priceDate).toMatch(/^\d{4}-\d{2}$/);
        if (p.thicknesses) {
          expect(p.thicknesses.length, p.id).toBeGreaterThan(0);
          for (const t of p.thicknesses) {
            expect(t.coverageM2, p.id).toBeGreaterThan(0);
            expect(t.price.low, p.id).toBeGreaterThan(0);
            expect(t.price.high, p.id).toBeGreaterThanOrEqual(t.price.low);
          }
          // Denser products can have more R in less depth (US R-21 vs R-19), so check λ = d/R instead of monotonic R.
          for (const t of p.thicknesses) {
            const lambda = t.mm / 1000 / t.rSI;
            expect(lambda, `${p.id} ${t.mm} mm`).toBeGreaterThan(0.015);
            expect(lambda, `${p.id} ${t.mm} mm`).toBeLessThan(0.08);
          }
        }
        if (p.form === "loosefill") {
          expect(p.loosefill, p.id).toBeDefined();
          expect(p.loosefill!.price.low).toBeGreaterThan(0);
          expect(p.loosefill!.bagKg).toBeGreaterThan(0);
        }
        if (p.form === "spray") expect(p.spray?.pricePerM2Mm?.low ?? p.spray?.pricePerM2?.low, p.id).toBeGreaterThan(0);
      }
    });

    it("produces a sensible result for every area with its default product", () => {
      for (const area of market.areas) {
        for (const tier of market.tiers) {
          if (!resolveTarget(market, tier.id, area, market.defaultZone)) continue;
          const r = calculate(
            {
              area,
              areaM2: 50,
              existing: { kind: "none" },
              tierId: tier.id,
              zone: market.defaultZone,
              productId: market.defaultProduct[area]!,
              wastePct: market.defaultWastePct,
            },
            market,
          );
          expect(r.status, `${tier.id}/${area}`).toBe("ok");
          expect(r.depthMm, `${tier.id}/${area}`).toBeGreaterThan(0);
          expect(r.depthMm, `${tier.id}/${area}`).toBeLessThan(800);
          expect(r.cost.low, `${tier.id}/${area}`).toBeGreaterThan(0);
        }
      }
    });
  });
}
