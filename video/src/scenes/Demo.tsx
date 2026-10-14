// The real calculator, step by step: screenshots inside a browser (wide) or phone (tall) frame,
// with a camera that follows the active question, a cursor or finger, and captions.
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import type { Copy } from "../copy";
import type { Shape } from "../plan";
import { C, display, gradientText, mono, sans } from "../theme";
import { latest, type CamKey, type Point, type Timeline } from "../timeline";
import type { Manifest } from "../types";
import { ease, progress, sceneOpacity } from "../ui";

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}
interface Cam {
  cx: number;
  cy: number;
  k: number;
}

const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), Math.max(lo, hi));
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

/** Where the camera should settle for a key: card-space centre and scale. */
function camTarget(key: CamKey, m: Manifest, vp: Rect): Cam {
  const f = m.frames[Math.max(0, key.shot)];
  if (m.layout === "mobile") {
    // Like a phone: full page width, the camera only scrolls.
    const k = vp.w / m.viewportW;
    const pad = (m.viewportW - f.w) / 2;
    const halfH = vp.h / 2 / k;
    const minY = halfH - pad;
    const maxY = f.h + pad - halfH;
    const cy = key.kind === "overview" ? minY : key.kind === "results" ? key.box.y - 12 + halfH : key.box.y + key.box.h / 2;
    return { cx: f.w / 2, cy: clamp(cy, minY, maxY), k };
  }
  const margin = 28;
  const k = (vp.w / (f.w + 2 * margin)) * (key.kind === "overview" ? 1 : key.kind === "step" ? 1.3 : 1.55);
  const halfW = vp.w / 2 / k;
  const halfH = vp.h / 2 / k;
  const minY = halfH - margin;
  if (key.kind === "overview") return { cx: f.w / 2, cy: minY, k };
  return {
    cx: clamp(key.box.x + key.box.w / 2, halfW - margin, f.w + margin - halfW),
    cy: clamp(key.box.y + key.box.h / 2, minY, f.h + margin - halfH),
    k,
  };
}

function camAt(frame: number, keys: CamKey[], m: Manifest, vp: Rect): Cam {
  let cam = camTarget(keys[0], m, vp);
  for (const key of keys.slice(1)) {
    if (frame < key.at) break;
    const target = camTarget(key, m, vp);
    const t = progress(frame, key.at, key.dur);
    cam = { cx: mix(cam.cx, target.cx, t), cy: mix(cam.cy, target.cy, t), k: mix(cam.k, target.k, t) };
  }
  return cam;
}

function cursorAt(frame: number, tl: Timeline, start: Point): { p: Point; opacity: number } {
  let p = start;
  let opacity = progress(frame, 0, 12);
  for (const key of tl.cursor) {
    const from = key.at - key.dur;
    if (frame < from) break;
    const t = ease(Math.min(1, (frame - from) / key.dur));
    if (key.point) p = { x: mix(p.x, key.point.x, t), y: mix(p.y, key.point.y, t) };
    else opacity *= 1 - t;
  }
  return { p, opacity };
}

const STEP_GRADIENTS = ["linear-gradient(90deg,#dc2626,#f97316)", "linear-gradient(90deg,#f97316,#facc15)", "linear-gradient(90deg,#22d3ee,#3b82f6)"];

function Caption({ copy, tl, wide }: { copy: Copy; tl: Timeline; wide: boolean }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cur = latest(tl.captions, frame);
  const idx = cur ? tl.captions.indexOf(cur) : -1;
  const prev = idx > 0 ? tl.captions[idx - 1] : undefined;
  const text = (step: number) => (step === 4 ? copy.result : copy.steps[step - 1]);
  const size = wide ? 66 : 74;

  const line = (step: number, style: React.CSSProperties) => (
    <div style={{ position: "absolute", left: 0, right: 0, ...style }}>
      <div style={{ fontFamily: mono, fontWeight: 500, fontSize: wide ? 26 : 30, color: C.nightText, marginBottom: 18, height: wide ? 32 : 36 }}>
        {step < 4 ? copy.stepOf(step) : ""}
      </div>
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: size, lineHeight: 1.04, letterSpacing: "-0.03em", color: "#fff", ...(step === 4 ? gradientText : {}) }}>
        {text(step)}
      </div>
    </div>
  );

  const enter = cur ? spring({ frame: frame - cur.at, fps, config: { damping: 16 } }) : 0;
  const exit = prev && cur ? progress(frame, cur.at, 8) : 1;

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", textAlign: wide ? "left" : "center" }}>
      <div style={{ display: "flex", gap: 10, marginBottom: wide ? 40 : 34, width: wide ? "100%" : 560, marginInline: wide ? 0 : "auto" }}>
        {[1, 2, 3].map((s) => {
          const at = tl.captions.find((c) => c.step === s)?.at ?? Infinity;
          const fill = progress(frame, at, 14);
          return (
            <div key={s} style={{ flex: 1, height: 8, borderRadius: 8, background: "rgba(255,255,255,.12)", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${fill * 100}%`, backgroundImage: STEP_GRADIENTS[s - 1] }} />
            </div>
          );
        })}
      </div>
      <div style={{ position: "relative" }}>
        {prev && exit < 1 ? line(prev.step, { opacity: 1 - exit, transform: `translateY(${-exit * 30}px)` }) : null}
        {cur ? line(cur.step, { opacity: enter, transform: `translateY(${(1 - enter) * 40}px)` }) : null}
      </div>
    </div>
  );
}

function Screenshot({ manifest, market, tl, vp, wide }: { manifest: Manifest; market: string; tl: Timeline; vp: Rect; wide: boolean }) {
  const frame = useCurrentFrame();
  const cam = camAt(frame, tl.cams, manifest, vp);
  const shown = latest(tl.shots, frame)?.index ?? 0;
  const dir = `capture/${market}-${manifest.layout}`;
  const toScreen = (p: Point) => ({ x: vp.w / 2 + (p.x - cam.cx) * cam.k, y: vp.h / 2 + (p.y - cam.cy) * cam.k });

  const last = manifest.frames.at(-1)!;
  const hlStart = tl.resultsAt + 32;
  const hl = progress(frame, hlStart, 12);
  const pulse = 1 + 0.012 * Math.sin((frame - hlStart) / 5);

  const cursor = cursorAt(frame, tl, { x: manifest.frames[0].w * 0.7, y: 560 });
  const cursorScreen = toScreen(cursor.p);
  const pressed = tl.taps.some((t) => frame >= t.at - 2 && frame <= t.at + 4);

  return (
    <div style={{ position: "absolute", left: vp.x, top: vp.y, width: vp.w, height: vp.h, overflow: "hidden", background: "#eef0f3" }}>
      <div style={{ position: "absolute", left: vp.w / 2 - cam.cx * cam.k, top: vp.h / 2 - cam.cy * cam.k, transform: `scale(${cam.k})`, transformOrigin: "0 0" }}>
        {manifest.frames.map((f, i) => (
          <Img
            key={f.file}
            src={staticFile(`${dir}/${f.file}`)}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: f.w,
              height: f.h,
              borderRadius: 16,
              opacity: i === shown ? 1 : 0,
              boxShadow: "0 24px 48px -28px rgba(11,14,20,.45)",
            }}
          />
        ))}
        {last.buy && hl > 0 ? (
          <div
            style={{
              position: "absolute",
              left: last.buy.x - 8,
              top: last.buy.y - 8,
              width: last.buy.w + 16,
              height: last.buy.h + 16,
              borderRadius: 18,
              border: `${3.5 / cam.k}px solid ${C.warm}`,
              boxShadow: `0 0 ${28 / cam.k}px rgba(249,115,22,.55)`,
              opacity: hl,
              transform: `scale(${pulse})`,
            }}
          />
        ) : null}
      </div>

      {tl.taps.map((t) => {
        const age = frame - t.at;
        if (age < -12 || age > 22) return null;
        const s = toScreen(t.point);
        const ring = progress(frame, t.at, 20);
        const r = wide ? mix(10, 44, ring) : mix(18, 70, ring);
        const finger = wide ? 0 : Math.max(0, Math.min(interpolate(age, [-12, 0], [0, 1]), interpolate(age, [4, 22], [1, 0])));
        return (
          <div key={t.at}>
            {age >= 0 ? (
              <div style={{ position: "absolute", left: s.x - r, top: s.y - r, width: r * 2, height: r * 2, borderRadius: 999, border: `${wide ? 4 : 5}px solid ${C.warm}`, opacity: 1 - ring }} />
            ) : null}
            {finger > 0 ? (
              <div style={{ position: "absolute", left: s.x - 38, top: s.y - 38, width: 76, height: 76, borderRadius: 999, background: "rgba(14,17,22,.22)", border: "3px solid rgba(255,255,255,.85)", opacity: finger, transform: `scale(${mix(1.25, 1, finger)})` }} />
            ) : null}
          </div>
        );
      })}

      {wide && cursor.opacity > 0 ? (
        <svg
          viewBox="0 0 24 24"
          width={40}
          height={40}
          style={{ position: "absolute", left: cursorScreen.x - 5, top: cursorScreen.y - 3, opacity: cursor.opacity, transform: `scale(${pressed ? 0.86 : 1})`, transformOrigin: "5px 3px", filter: "drop-shadow(0 3px 4px rgba(0,0,0,.35))" }}
        >
          <path d="M3 2v18l4.8-4.6 3.4 7.6 3.2-1.4-3.3-7.4H18z" fill="#fff" stroke="#0e1116" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      ) : null}
    </div>
  );
}

function UrlPill({ path, size }: { path: string; size: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: sans, fontWeight: 500, fontSize: size }}>
      <svg viewBox="0 0 24 24" width={size * 0.85} height={size * 0.85}>
        <rect x="5" y="10.5" width="14" height="10" rx="2.2" fill="currentColor" />
        <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" fill="none" stroke="currentColor" strokeWidth="2.2" />
      </svg>
      <span>
        loftinsulationcalc.com<span style={{ opacity: 0.55 }}>{path}</span>
      </span>
    </div>
  );
}

export function Demo({ copy, shape, market, path, manifest, tl, duration }: { copy: Copy; shape: Shape; market: string; path: string; manifest: Manifest; tl: Timeline; duration: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const wide = shape === "wide";
  const pop = spring({ frame, fps, config: { damping: 18 } });
  const frameStyle = { transform: `translateY(${(1 - pop) * 80}px) scale(${mix(0.94, 1, pop)})` };

  if (wide) {
    const win = { x: 80, y: 96, w: 1180, h: 888 };
    const bar = 54;
    return (
      <AbsoluteFill style={{ opacity: sceneOpacity(frame, duration) }}>
        <div style={{ position: "absolute", left: win.x, top: win.y, width: win.w, height: win.h, borderRadius: 22, overflow: "hidden", background: "#1b2130", border: "1.5px solid rgba(255,255,255,.12)", boxShadow: "0 40px 80px -30px rgba(0,0,0,.7)", ...frameStyle }}>
          <div style={{ height: bar, display: "flex", alignItems: "center", padding: "0 22px", gap: 10, position: "relative" }}>
            {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
              <div key={c} style={{ width: 14, height: 14, borderRadius: 99, background: c }} />
            ))}
            <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", padding: "8px 22px", borderRadius: 10, background: "rgba(255,255,255,.08)", color: "rgba(255,255,255,.8)" }}>
              <UrlPill path={path} size={20} />
            </div>
          </div>
          <Screenshot manifest={manifest} market={market} tl={tl} vp={{ x: 0, y: bar, w: win.w, h: win.h - bar }} wide />
        </div>
        <div style={{ position: "absolute", left: 1330, top: 0, width: 520, height: 1080, display: "flex", alignItems: "center" }}>
          <div style={{ width: "100%", height: 420, marginTop: 40 }}>
            <Caption copy={copy} tl={tl} wide />
          </div>
        </div>
      </AbsoluteFill>
    );
  }

  const phone = { x: 100, y: 570, w: 880, h: 1250 };
  const bezel = 14;
  const browserBar = 116;
  const screen = { w: phone.w - bezel * 2, h: phone.h - bezel * 2 };
  return (
    <AbsoluteFill style={{ opacity: sceneOpacity(frame, duration) }}>
      <div style={{ position: "absolute", left: 70, right: 70, top: 220, height: 330 }}>
        <Caption copy={copy} tl={tl} wide={false} />
      </div>
      <div style={{ position: "absolute", left: phone.x, top: phone.y, width: phone.w, height: phone.h, borderRadius: 76, background: "#0f131b", border: "2px solid #2a313b", boxShadow: "0 40px 90px -30px rgba(0,0,0,.8)", ...frameStyle }}>
        <div style={{ position: "absolute", left: bezel, top: bezel, width: screen.w, height: screen.h, borderRadius: 62, overflow: "hidden", background: C.canvas }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: browserBar, background: "#f8f9fa", borderBottom: `1.5px solid ${C.line}` }}>
            <div style={{ position: "absolute", left: "50%", top: 16, width: 150, height: 38, marginLeft: -75, borderRadius: 99, background: "#000" }} />
            <div style={{ position: "absolute", left: 40, right: 40, bottom: 12, height: 46, borderRadius: 14, background: "#eceef1", color: C.ink, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <UrlPill path={path} size={22} />
            </div>
          </div>
          <Screenshot manifest={manifest} market={market} tl={tl} vp={{ x: 0, y: browserBar, w: screen.w, h: screen.h - browserBar }} wide={false} />
        </div>
      </div>
    </AbsoluteFill>
  );
}
