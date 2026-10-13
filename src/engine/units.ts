// All engine maths runs in SI: R in m²·K/W, U in W/m²·K, lengths in mm, areas in m².
// These helpers convert imperial inputs/data into SI and back for display.

/** 1 h·ft²·°F/Btu expressed in m²·K/W. */
export const R_IP_TO_SI = 0.1761101838;
const MM_PER_INCH = 25.4;
const M_PER_FOOT = 0.3048;
const M2_PER_SQFT = M_PER_FOOT * M_PER_FOOT; // 0.09290304

/** Imperial R-value (e.g. R-38) → SI R (m²K/W). */
export const rIP = (r: number): number => r * R_IP_TO_SI;
/** SI R (m²K/W) → imperial R-value. */
export const toRIP = (rSI: number): number => rSI / R_IP_TO_SI;

export const inches = (n: number): number => n * MM_PER_INCH;
export const mmToInches = (mm: number): number => mm / MM_PER_INCH;
export const feet = (n: number): number => n * M_PER_FOOT;
export const metersToFeet = (m: number): number => m / M_PER_FOOT;
export const sqft = (n: number): number => n * M2_PER_SQFT;
export const m2ToSqft = (m2: number): number => m2 / M2_PER_SQFT;

/** lb → kg */
export const lb = (n: number): number => n * 0.45359237;
/** lb/ft³ → kg/m³ */
export const pcf = (n: number): number => n * 16.01846337;

/** Price per board foot (1 ft² × 1 in) → price per m²·mm. */
export const perBoardFoot = (price: number): number => price / (M2_PER_SQFT * MM_PER_INCH);

export const uFromR = (rSI: number): number => (rSI <= 0 ? Infinity : 1 / rSI);
export const rFromU = (u: number): number => (u <= 0 ? Infinity : 1 / u);
