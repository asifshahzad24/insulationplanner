// Logo, the address and the tagline.
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { Copy } from "../copy";
import type { Shape } from "../plan";
import { C, THERMAL, display, gradientText, sans } from "../theme";
import { LogoMark, progress } from "../ui";

export function Outro({ copy, shape }: { copy: Copy; shape: Shape }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const wide = shape === "wide";
  const logo = spring({ frame: frame - 2, fps, config: { damping: 12, mass: 0.9 } });
  const word = spring({ frame: frame - 10, fps, config: { damping: 16 } });
  const url = spring({ frame: frame - 22, fps, config: { damping: 16 } });
  const bar = progress(frame, 30, 26);
  const tag = spring({ frame: frame - 40, fps, config: { damping: 18 } });

  const wordSize = wide ? 104 : 92;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", textAlign: "center" }}>
      <div style={{ transform: `scale(${logo}) rotate(${interpolate(logo, [0, 1], [-12, 0])}deg)`, marginBottom: wide ? 34 : 44 }}>
        <LogoMark size={wide ? 150 : 170} />
      </div>
      <div
        style={{
          opacity: word,
          transform: `translateY(${(1 - word) * 30}px)`,
          fontFamily: display,
          fontWeight: 800,
          fontSize: wordSize,
          letterSpacing: "-0.03em",
          color: "#fff",
          lineHeight: 1,
        }}
      >
        LoftInsulation<span style={gradientText}>Calc</span>
      </div>

      <div style={{ opacity: url, transform: `translateY(${(1 - url) * 24}px)`, marginTop: wide ? 56 : 76 }}>
        <div style={{ fontFamily: sans, fontWeight: 500, fontSize: wide ? 36 : 40, color: C.nightText }}>{copy.cta}</div>
        <div style={{ display: "inline-block", marginTop: 14 }}>
          <div style={{ fontFamily: display, fontWeight: 700, fontSize: wide ? 72 : 66, color: "#fff", letterSpacing: "-0.02em" }}>loftinsulationcalc.com</div>
          <div style={{ height: 8, borderRadius: 8, marginTop: 10, backgroundImage: THERMAL, transform: `scaleX(${bar})`, transformOrigin: "left" }} />
        </div>
      </div>

      <div style={{ opacity: tag, marginTop: wide ? 44 : 60, fontFamily: sans, fontWeight: 500, fontSize: wide ? 34 : 38, color: "rgba(255,255,255,.75)" }}>
        {copy.tagline}
      </div>
    </AbsoluteFill>
  );
}
