import { describe, expect, it } from "vitest";
import { MARKET_IDS } from "@/markets/meta";
import { alternatesOf, findRoute, pathOf, ROUTES, routesFor } from "./registry";

describe("route registry", () => {
  it("has unique paths", () => {
    const paths = ROUTES.map(pathOf);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it("builds paths with market prefixes", () => {
    expect(pathOf({ market: "us", slug: "" })).toBe("/");
    expect(pathOf({ market: "us", slug: "r-value-chart" })).toBe("/r-value-chart");
    expect(pathOf({ market: "de", slug: "" })).toBe("/de");
    expect(pathOf({ market: "fr", slug: "isolation-murs" })).toBe("/fr/isolation-murs");
  });

  it("uses lowercase kebab-case ASCII slugs", () => {
    for (const e of ROUTES) expect(e.slug).toMatch(/^([a-z0-9]+(-[a-z0-9]+)*)?$/);
  });

  it("has one page per group per market and a home for every market", () => {
    for (const m of MARKET_IDS) {
      const groups = routesFor(m).map((e) => e.group);
      expect(new Set(groups).size).toBe(groups.length);
      expect(findRoute(m, "")?.group).toBe("home");
    }
  });

  it("covers the launch page set in every market", () => {
    const required = ["home", "attic", "wall", "floor", "blown", "thickness", "converter", "targets", "methodology", "faq", "about", "privacy", "terms", "affiliate"];
    for (const m of MARKET_IDS) {
      const groups = new Set(routesFor(m).map((e) => e.group));
      for (const g of required) expect(groups, `${m} is missing ${g}`).toContain(g);
    }
    expect(routesFor("de").some((e) => e.group === "legalNotice")).toBe(true);
    expect(routesFor("fr").some((e) => e.group === "legalNotice")).toBe(true);
  });

  it("gives calculator presets only to calculator pages", () => {
    for (const e of ROUTES) if (e.preset) expect(e.kind).toBe("calculator");
  });

  it("has symmetric alternates (each alternate lists the original back)", () => {
    for (const e of ROUTES) {
      for (const alt of alternatesOf(e)) expect(alternatesOf(alt)).toContain(e);
    }
  });
});
