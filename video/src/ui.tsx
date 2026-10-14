// Shared visual pieces: background, thermal bar, logo, easing and text fitting.
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C, THERMAL } from "./theme";

export const ease = Easing.bezier(0.65, 0, 0.35, 1);
export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);

/** 0 → 1 over `dur` frames starting at `start`, eased. */
export function progress(frame: number, start: number, dur: number, easing = ease): number {
  return interpolate(frame, [start, start + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });
}

/** Font size that keeps a single line of `text` within `maxWidth` (Bricolage averages ~0.56em per glyph). */
export function fitFont(text: string, maxWidth: number, base: number, perChar = 0.56): number {
  return Math.min(base, Math.floor(maxWidth / (text.length * perChar)));
}

/** Fade a whole scene in and out. */
export function sceneOpacity(frame: number, duration: number, fadeIn = 10, fadeOut = 12): number {
  return Math.min(progress(frame, 0, fadeIn, easeOut), 1 - progress(frame, duration - fadeOut, fadeOut));
}

/** Night background with the site's slowly drifting thermal glow. */
export function Backdrop() {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const drift = Math.sin(frame / 90) * 40;
  const size = Math.max(width, height) * 0.75;
  return (
    <AbsoluteFill style={{ backgroundColor: C.night, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          width: size,
          height: size * 0.7,
          right: -size * 0.28 + drift,
          top: -size * 0.22 - drift / 2,
          background:
            "radial-gradient(closest-side, rgba(250,204,21,.55), rgba(249,115,22,.45) 35%, rgba(220,38,38,.32) 58%, rgba(59,130,246,.22) 80%, transparent)",
          filter: "blur(40px)",
          opacity: 0.55,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: size * 0.7,
          height: size * 0.5,
          left: -size * 0.25 - drift,
          bottom: -size * 0.2,
          background: "radial-gradient(closest-side, rgba(59,130,246,.35), rgba(49,46,129,.25) 60%, transparent)",
          filter: "blur(50px)",
          opacity: 0.5,
        }}
      />
    </AbsoluteFill>
  );
}

export function ThermalBar() {
  return <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 8, backgroundImage: THERMAL }} />;
}

/** The site's thermal house mark (src/components/site/Logo.tsx in the site). */
export function LogoMark({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size}>
      <defs>
        <linearGradient id="lm-thermal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#dc2626" />
          <stop offset=".3" stopColor="#f97316" />
          <stop offset=".5" stopColor="#facc15" />
          <stop offset=".7" stopColor="#22d3ee" />
          <stop offset=".85" stopColor="#3b82f6" />
          <stop offset="1" stopColor="#312e81" />
        </linearGradient>
      </defs>
      <rect width="24" height="24" rx="6.5" fill="url(#lm-thermal)" />
      <path d="M5.5 12.2 12 6.5l6.5 5.7V18a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5z" fill="none" stroke="#fff" strokeWidth="1.9" strokeLinejoin="round" />
      <path d="M8 14.2h8" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  );
}
