// Three reasons to try it, ticked off in time with the voiceover.
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { Copy } from "../copy";
import type { Shape } from "../plan";
import { THERMAL, display } from "../theme";
import { fitFont, sceneOpacity } from "../ui";

export function Benefits({ copy, shape, duration, voiceStart, voiceLen }: { copy: Copy; shape: Shape; duration: number; voiceStart: number; voiceLen: number }) {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const wide = shape === "wide";
  const badge = wide ? 76 : 84;
  const size = Math.min(...copy.benefits.map((b) => fitFont(b, width * (wide ? 0.62 : 0.68), wide ? 78 : 70)));

  return (
    <AbsoluteFill style={{ opacity: sceneOpacity(frame, duration), alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: wide ? 40 : 56 }}>
        {copy.benefits.map((text, i) => {
          const s = spring({ frame: frame - voiceStart - Math.round((i * voiceLen) / 3.2), fps, config: { damping: 14 } });
          return (
            <div key={text} style={{ display: "flex", alignItems: "center", gap: wide ? 34 : 30, opacity: s, transform: `translateX(${(1 - s) * -50}px)` }}>
              <div
                style={{
                  width: badge,
                  height: badge,
                  flexShrink: 0,
                  borderRadius: 999,
                  backgroundImage: THERMAL,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transform: `scale(${s})`,
                }}
              >
                <svg viewBox="0 0 24 24" width={badge * 0.56} height={badge * 0.56}>
                  <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div style={{ fontFamily: display, fontWeight: 800, fontSize: size, color: "#fff", letterSpacing: "-0.025em", lineHeight: 1.05 }}>{text}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}
