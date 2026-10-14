// Mirrors the site's thermal design tokens (src/app/globals.css in the site).
import { loadFont as loadBricolage } from "@remotion/google-fonts/BricolageGrotesque";
import { loadFont as loadGeist } from "@remotion/google-fonts/Geist";
import { loadFont as loadGeistMono } from "@remotion/google-fonts/GeistMono";

export const C = {
  night: "#0b0e14",
  night2: "#151a23",
  nightText: "#a3abb6",
  canvas: "#f5f6f8",
  line: "#e3e6ea",
  ink: "#0e1116",
  accent: "#ea580c",
  warm: "#f97316",
  sun: "#facc15",
};

export const THERMAL = "linear-gradient(90deg, #dc2626, #f97316, #facc15, #22d3ee, #3b82f6, #312e81)";
export const THERMAL_TEXT = "linear-gradient(90deg, #f97316, #facc15)";

export const display = loadBricolage("normal", { weights: ["700", "800"], subsets: ["latin", "latin-ext"] }).fontFamily;
export const sans = loadGeist("normal", { weights: ["400", "500", "600"], subsets: ["latin", "latin-ext"] }).fontFamily;
export const mono = loadGeistMono("normal", { weights: ["500"], subsets: ["latin"] }).fontFamily;

/** Text filled with the warm part of the thermal gradient. */
export const gradientText = {
  backgroundImage: THERMAL_TEXT,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
} as const;
