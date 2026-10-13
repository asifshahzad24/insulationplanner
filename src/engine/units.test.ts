import { describe, expect, it } from "vitest";
import {
  feet,
  inches,
  m2ToSqft,
  mmToInches,
  perBoardFoot,
  rFromU,
  rIP,
  sqft,
  toRIP,
  uFromR,
} from "./units";

describe("units", () => {
  it("converts imperial R (h·ft²·°F/Btu) to SI R (m²K/W)", () => {
    expect(rIP(1)).toBeCloseTo(0.17611, 5);
    expect(rIP(38)).toBeCloseTo(6.692, 3);
  });

  it("round-trips R-values", () => {
    expect(toRIP(rIP(38))).toBeCloseTo(38, 10);
    expect(toRIP(5.28)).toBeCloseTo(29.98, 2);
  });

  it("converts lengths and areas", () => {
    expect(inches(1)).toBe(25.4);
    expect(feet(1)).toBeCloseTo(0.3048, 10);
    expect(mmToInches(254)).toBeCloseTo(10, 10);
    expect(sqft(1)).toBeCloseTo(0.09290304, 10);
    expect(m2ToSqft(sqft(1200))).toBeCloseTo(1200, 8);
  });

  it("converts a price per board foot to a price per m²·mm", () => {
    // one board foot = 1 ft² × 1 in = 0.09290304 m² × 25.4 mm
    expect(perBoardFoot(1)).toBeCloseTo(1 / (0.09290304 * 25.4), 10);
  });

  it("converts between U and R", () => {
    expect(uFromR(4)).toBe(0.25);
    expect(rFromU(0.24)).toBeCloseTo(4.1667, 4);
    expect(uFromR(0)).toBe(Infinity);
  });
});
