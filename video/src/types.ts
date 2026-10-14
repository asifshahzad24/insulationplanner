export type Layout = "desktop" | "mobile";

/** A rectangle in CSS pixels, relative to the calculator card's top-left corner. */
export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface CaptureFrame {
  file: string;
  /** Card size in CSS pixels for this screenshot (it grows when fields appear). */
  w: number;
  h: number;
  /** 0 = untouched, 1–3 = caption steps, 4 = finished. */
  step: number;
  action: "start" | "key" | "click" | "end";
  /** Element the cursor points at. */
  point: Box | null;
  /** Question section the camera frames. */
  focus: Box | null;
  results: Box | null;
  /** The "to buy" and cost tiles inside the results. */
  buy: Box | null;
}

export interface Manifest {
  market: string;
  layout: Layout;
  dpr: number;
  viewportW: number;
  frames: CaptureFrame[];
}
