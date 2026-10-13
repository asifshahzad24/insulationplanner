import { ImageResponse } from "next/og";
import { site } from "@/config/site";

export const ogSize = { width: 1200, height: 630 };

const COPY = {
  us: { headline: "How much insulation do you need?", sub: "Attic, walls & floors · depth, bags and cost · R-values by climate zone", now: "R-13", target: "R-60" },
  uk: { headline: "How much loft insulation do you need?", sub: "Lofts, walls & floors · thickness, rolls and cost · Part L U-values", now: "100 mm", target: "270 mm" },
  de: { headline: "Wie viel Dämmung brauchen Sie?", sub: "Dachboden, Wand & Kellerdecke · Dämmstärke, Menge und Kosten · GEG & BEG", now: "U 1,0", target: "U 0,14" },
  fr: { headline: "Quelle épaisseur d'isolant ?", sub: "Combles, murs & planchers · épaisseur, sacs et coût · exigences CEE", now: "R 2", target: "R 7" },
} as const;

/** Shared Open Graph card for a market (generated at build time). */
export function ogImage(market: keyof typeof COPY) {
  const c = COPY[market];
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "#0b0e14",
          backgroundImage:
            "radial-gradient(circle at 88% 8%, rgba(250,204,21,.55), rgba(249,115,22,.4) 18%, rgba(220,38,38,.25) 32%, rgba(59,130,246,.12) 46%, rgba(11,14,20,0) 60%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "linear-gradient(135deg,#dc2626,#f97316,#facc15,#22d3ee,#3b82f6,#312e81)",
            }}
          />
          <div style={{ fontSize: 34, fontWeight: 800 }}>{site.name}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 70, fontWeight: 800, lineHeight: 1.02, letterSpacing: -2, maxWidth: 980 }}>{c.headline}</div>
          <div style={{ fontSize: 28, color: "#a3abb6" }}>{c.sub}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, color: "#a3abb6" }}>
            <span>{c.now}</span>
            <span style={{ color: "white", fontWeight: 700 }}>{c.target}</span>
          </div>
          <div
            style={{
              height: 18,
              borderRadius: 999,
              background: "linear-gradient(90deg,#dc2626,#f97316,#facc15,#22d3ee,#3b82f6,#312e81)",
            }}
          />
        </div>
      </div>
    ),
    ogSize,
  );
}
