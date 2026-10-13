// Area helpers (metres in, m² out).

export const rectangleM2 = (lengthM: number, widthM: number): number =>
  Math.max(0, lengthM) * Math.max(0, widthM);

export interface WallsInput {
  perimeterM: number;
  heightM: number;
  doors: number;
  windows: number;
  doorM2: number;
  windowM2: number;
}

/** Net exterior wall area: perimeter × height minus doors and windows (never negative). */
export const wallsM2 = ({ perimeterM, heightM, doors, windows, doorM2, windowM2 }: WallsInput): number =>
  Math.max(0, perimeterM * heightM - doors * doorM2 - windows * windowM2);
