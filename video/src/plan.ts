// Scene lengths for one promo, derived from the capture manifest and the voiceover durations.
import type { Market, VoiceLine } from "./copy";
import { buildTimeline, type Timeline } from "./timeline";
import type { Manifest } from "./types";

export const FPS = 30;
export type Shape = "wide" | "tall";
export type Durations = Record<VoiceLine, number>;

export interface PromoProps {
  market: Market;
  shape: Shape;
  /** Filled in by calculateMetadata from public/capture and public/voice. */
  manifest: Manifest | null;
  voice: Durations | null;
  [key: string]: unknown;
}

/** Frame offsets at which each voice line starts, relative to its scene. */
export const VOICE_DELAY = { intro: 12, step: 4, result: 8, benefits: 8, outro: 14 };

export interface Plan {
  intro: number;
  demo: number;
  benefits: number;
  outro: number;
  total: number;
  /** Voice length in frames per line. */
  vf: Record<VoiceLine, number>;
  /** Absolute frame at which each voice line starts. */
  voiceAt: Record<VoiceLine, number>;
  /** Absolute start frame of each scene after the intro. */
  at: { demo: number; benefits: number; outro: number };
  timeline: Timeline;
}

export function makePlan(manifest: Manifest, voice: Durations): Plan {
  const vf = Object.fromEntries(Object.entries(voice).map(([k, s]) => [k, Math.ceil(s * FPS)])) as Record<VoiceLine, number>;
  const timeline = buildTimeline(manifest, vf);
  const intro = Math.max(180, VOICE_DELAY.intro + vf.intro + 24);
  const demo = timeline.total;
  const benefits = Math.max(120, VOICE_DELAY.benefits + vf.benefits + 20);
  const outro = Math.max(150, VOICE_DELAY.outro + vf.outro + 66);
  const at = { demo: intro, benefits: intro + demo, outro: intro + demo + benefits };
  const stepAt = (s: number) => at.demo + (timeline.captions.find((c) => c.step === s)?.at ?? 0) + VOICE_DELAY.step;
  const voiceAt: Record<VoiceLine, number> = {
    intro: VOICE_DELAY.intro,
    step1: stepAt(1),
    step2: stepAt(2),
    step3: stepAt(3),
    result: at.demo + timeline.resultsAt + VOICE_DELAY.result,
    benefits: at.benefits + VOICE_DELAY.benefits,
    outro: at.outro + VOICE_DELAY.outro,
  };
  return { intro, demo, benefits, outro, total: intro + demo + benefits + outro, vf, voiceAt, at, timeline };
}
