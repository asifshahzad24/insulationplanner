import { describe, expect, it } from "vitest";
import { sqft } from "@/engine/units";
import { us } from "@/markets/us";
import { areaM2Of, decodeState, defaultState, encodeState, num, toInput } from "./state";

describe("calculator state", () => {
  it("parses numbers typed in either locale", () => {
    expect(num("1200")).toBe(1200);
    expect(num("1,200")).toBe(1200);
    expect(num("2,5")).toBe(2.5);
    expect(num("2.5")).toBe(2.5);
    expect(num(" ")).toBeNaN();
    expect(num("abc")).toBeNaN();
  });

  it("computes area from dimensions in display units", () => {
    const ui = defaultState(us, { area: "attic" });
    expect(areaM2Of(ui, us)).toBeCloseTo(sqft(1200), 9);
    const walls = { ...defaultState(us, { area: "wall" }), perimeter: "100", height: "8", doors: "1", windows: "2" };
    expect(areaM2Of(walls, us)).toBeCloseTo(sqft(800 - 21 - 24), 9);
  });

  it("only applies the cavity limit to in-cavity products", () => {
    const ui = defaultState(us, { area: "wall" });
    expect(toInput(ui, us).cavityMm).toBeCloseTo(88.9, 6);
    expect(toInput({ ...ui, product: "xps" }, us).cavityMm).toBeUndefined();
  });

  it("round-trips through the URL and ignores junk", () => {
    const defaults = defaultState(us, { area: "attic" });
    const ui = { ...defaults, area: "floor" as const, product: "fgAttic", zone: "6A", length: "50" };
    const qs = encodeState(ui, defaults);
    expect(qs).toContain("a=floor");
    expect(decodeState(qs, defaults, us)).toEqual(ui);
    const junk = decodeState("?a=garage&pr=nope&t=x&c=99", defaults, us);
    expect(junk.area).toBe("attic");
    expect(junk.product).toBe(defaults.product);
    expect(junk.tier).toBe(defaults.tier);
    expect(junk.cavity).toBe(-1);
  });
});
