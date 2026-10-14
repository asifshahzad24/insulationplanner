// Turns a capture manifest into a schedule for the demo scene: which screenshot shows when,
// where the cursor travels, where taps happen, where the camera looks and which caption is up.
// Each step lasts at least as long as its voiceover line.
import type { Box, Manifest } from "./types";

export interface Point {
  x: number;
  y: number;
}

/** Screenshot `index` shows from frame `at`. */
export interface Shot {
  index: number;
  at: number;
}

/** The cursor arrives at `point` at frame `at`, after travelling for `dur` frames (null = hidden). */
export interface CursorKey {
  at: number;
  dur: number;
  point: Point | null;
}

/** The camera starts moving at `at` and settles on `box` after `dur` frames. */
export interface CamKey {
  at: number;
  dur: number;
  kind: "overview" | "step" | "results";
  box: Box;
  /** Screenshot whose card size applies (cards grow as fields and results appear). */
  shot: number;
}

export interface Timeline {
  shots: Shot[];
  cursor: CursorKey[];
  taps: { at: number; point: Point }[];
  cams: CamKey[];
  /** Caption changes: steps 1–3, then 4 for the result. */
  captions: { at: number; step: number }[];
  resultsAt: number;
  /** Length of the demo scene in frames. */
  total: number;
}

/** Voiceover length in frames for the demo's lines. */
export interface DemoVoice {
  step1: number;
  step2: number;
  step3: number;
  result: number;
}

const T = { lead: 16, move: 24, travel: 14, focusClick: 7, key: 8, click: 16, hold: 30, voiceTail: 10, minResults: 120 };

const center = (b: Box): Point => ({ x: b.x + b.w / 2, y: b.y + b.h / 2 });
const sameBox = (a: Box | null, b: Box | null) => !!a && !!b && Math.abs(a.x - b.x) < 1 && Math.abs(a.y - b.y) < 1;

export function buildTimeline(manifest: Manifest, voice: DemoVoice): Timeline {
  const { frames } = manifest;
  const tl: Timeline = { shots: [{ index: 0, at: 0 }], cursor: [], taps: [], cams: [], captions: [], resultsAt: 0, total: 0 };
  tl.cams.push({ at: 0, dur: 0, kind: "overview", box: { x: 0, y: 0, w: frames[0].w, h: 1 }, shot: 0 });

  let t = T.lead;
  for (const step of [1, 2, 3] as const) {
    const indices = frames.flatMap((f, i) => (f.step === step ? [i] : []));
    if (!indices.length) continue;
    const stepStart = t;
    tl.captions.push({ at: t, step });
    tl.cams.push({ at: t, dur: T.move, kind: "step", box: frames[indices[0]].focus!, shot: indices[0] - 1 });

    let prevPoint: Box | null = null;
    for (const [n, i] of indices.entries()) {
      const f = frames[i];
      if (!sameBox(prevPoint, f.point)) {
        // Travel to a new element: alongside the camera at a step start, on its own between fields.
        const dur = n === 0 ? T.move : T.travel;
        t += dur;
        tl.cursor.push({ at: t, dur, point: center(f.point!) });
        if (f.action === "key") {
          tl.taps.push({ at: t, point: center(f.point!) });
          t += T.focusClick;
        }
        prevPoint = f.point;
      }
      if (f.action === "click") {
        tl.taps.push({ at: t, point: center(f.point!) });
        tl.shots.push({ index: i, at: t + 3 });
        t += T.click;
      } else {
        tl.shots.push({ index: i, at: t });
        t += T.key;
      }
    }
    t = Math.max(t + T.hold, stepStart + voice[`step${step}`] + T.voiceTail);
  }

  const last = frames.length - 1;
  const end = frames[last];
  tl.resultsAt = t;
  tl.captions.push({ at: t, step: 4 });
  tl.shots.push({ index: last, at: t });
  tl.cursor.push({ at: t + 10, dur: 10, point: null });
  // Frame the top of the results, down to the "to buy" tiles.
  const r = end.results!;
  const bottom = end.buy ? end.buy.y + end.buy.h + 24 : r.y + Math.min(r.h, 520);
  tl.cams.push({ at: t, dur: T.move + 6, kind: "results", box: { x: r.x, y: r.y, w: r.w, h: bottom - r.y }, shot: last });
  tl.total = t + Math.max(T.minResults, voice.result + 60);
  return tl;
}

/** Last entry with `at <= frame`. */
export function latest<T extends { at: number }>(list: T[], frame: number): T | undefined {
  let found: T | undefined;
  for (const item of list) if (item.at <= frame) found = item;
  return found;
}
