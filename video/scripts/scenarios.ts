// What the capture script does on each market's home calculator.
// Selectors are the calculator's own ids (src/components/calculator/Calculator.tsx).

export type Market = "us" | "uk" | "de" | "fr";

export type Action =
  /** Empty an input before the first frame (no screenshot). */
  | { kind: "clear"; sel: string }
  /** Click the input, then type one character per screenshot. */
  | { kind: "type"; sel: string; text: string }
  /** Click a segmented-control option by its value. */
  | { kind: "radio"; value: string }
  /** Choose an option in a native select. */
  | { kind: "select"; sel: string; value: string };

export interface Scenario {
  path: string;
  setup: Action[];
  /** Three steps, each matching a caption in src/copy.ts. Each one visibly changes the result. */
  steps: [Action[], Action[], Action[]];
}

const clearSize: Action[] = [
  { kind: "clear", sel: "#len" },
  { kind: "clear", sel: "#wid" },
];

export const SCENARIOS: Record<Market, Scenario> = {
  us: {
    path: "/",
    setup: clearSize,
    steps: [
      [
        { kind: "type", sel: "#len", text: "40" },
        { kind: "type", sel: "#wid", text: "30" },
      ],
      // Atlanta: zone 3A, so the target drops from the default 5A's R-60 to R-49.
      [{ kind: "type", sel: "#zip", text: "30303" }],
      // The default is cellulose; switching shows the bag count change.
      [{ kind: "select", sel: "#prod", value: "blownFiberglass" }],
    ],
  },
  uk: {
    path: "/uk",
    setup: clearSize,
    steps: [
      [
        { kind: "type", sel: "#len", text: "10" },
        { kind: "type", sel: "#wid", text: "8" },
      ],
      [
        { kind: "radio", value: "thickness" },
        { kind: "type", sel: "#exd", text: "100" },
      ],
      // Target: Building Regs → new-build standard.
      [{ kind: "radio", value: "best" }],
    ],
  },
  de: {
    path: "/de",
    setup: clearSize,
    steps: [
      [
        { kind: "type", sel: "#len", text: "10" },
        { kind: "type", sel: "#wid", text: "8" },
      ],
      [
        { kind: "radio", value: "thickness" },
        { kind: "type", sel: "#exd", text: "8" },
        { kind: "select", sel: "#exm", value: "mw040" },
      ],
      // Target: legal minimum (GEG) → subsidy level (BEG).
      [{ kind: "radio", value: "beg" }],
    ],
  },
  fr: {
    path: "/fr",
    setup: clearSize,
    steps: [
      [
        { kind: "type", sel: "#len", text: "10" },
        { kind: "type", sel: "#wid", text: "8" },
      ],
      [{ kind: "select", sel: "#dept", value: "69" }],
      [{ kind: "select", sel: "#prod", value: "ouate" }],
    ],
  },
};
