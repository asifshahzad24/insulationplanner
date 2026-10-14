// Hook question, then the three questions people have before buying insulation.
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { Copy } from "../copy";
import type { Shape } from "../plan";
import { display, gradientText } from "../theme";
import { fitFont, progress, sceneOpacity } from "../ui";

export function Intro({ copy, shape, duration, voiceStart, voiceLen }: { copy: Copy; shape: Shape; duration: number; voiceStart: number; voiceLen: number }) {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const wide = shape === "wide";

  // The voice asks the hook first, then lists the questions; follow it roughly.
  const qStart = Math.round(voiceStart + voiceLen * 0.32);
  const qGap = Math.round(voiceLen * 0.2);
  const lift = progress(frame, qStart - 10, 18);

  const hookSize = Math.min(...copy.hook.map((l) => fitFont(l, width * 0.86, wide ? 156 : 150)));
  const line = (i: number) => spring({ frame: frame - 4 - i * 7, fps, config: { damping: 16, mass: 0.8 } });

  return (
    <AbsoluteFill style={{ opacity: sceneOpacity(frame, duration), alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          textAlign: "center",
          transform: `translateY(${-lift * height * (wide ? 0.2 : 0.17)}px) scale(${1 - lift * 0.3})`,
          fontFamily: display,
          fontWeight: 800,
          fontSize: hookSize,
          lineHeight: 1,
          letterSpacing: "-0.035em",
          color: "#fff",
        }}
      >
        {copy.hook.map((text, i) => (
          <div key={i} style={{ opacity: line(i), transform: `translateY(${(1 - line(i)) * 60}px)`, ...(i === 1 ? gradientText : {}), paddingBottom: 8 }}>
            {text}
          </div>
        ))}
      </div>

      <div
        style={{
          position: "absolute",
          top: height * (wide ? 0.47 : 0.46),
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: wide ? 22 : 28,
        }}
      >
        {copy.questions.map((q, i) => {
          const s = spring({ frame: frame - qStart - i * qGap, fps, config: { damping: 14 } });
          return (
            <div
              key={q}
              style={{
                opacity: s,
                transform: `translateY(${(1 - s) * 30}px) scale(${interpolate(s, [0, 1], [0.92, 1])})`,
                fontFamily: display,
                fontWeight: 700,
                fontSize: wide ? 60 : 64,
                color: "#fff",
                padding: wide ? "14px 40px" : "18px 44px",
                borderRadius: 999,
                background: "rgba(255,255,255,.06)",
                border: "1.5px solid rgba(255,255,255,.14)",
              }}
            >
              {q}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}
