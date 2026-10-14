// One promo video: intro → demo → benefits → outro, with the voiceover placed on each beat.
import { AbsoluteFill, Html5Audio, Sequence, staticFile } from "remotion";
import { COPY, type VoiceLine } from "./copy";
import { VOICE_DELAY, makePlan, type PromoProps } from "./plan";
import { Benefits } from "./scenes/Benefits";
import { Demo } from "./scenes/Demo";
import { Intro } from "./scenes/Intro";
import { Outro } from "./scenes/Outro";
import { sans } from "./theme";
import { Backdrop, ThermalBar } from "./ui";

const PATHS = { us: "", uk: "/uk", de: "/de", fr: "/fr" } as const;

export function Promo({ market, shape, manifest, voice }: PromoProps) {
  if (!manifest || !voice) return <AbsoluteFill style={{ background: "#0b0e14" }} />;
  const copy = COPY[market];
  const plan = makePlan(manifest, voice);
  const tl = plan.timeline;
  const { at, voiceAt } = plan;

  return (
    <AbsoluteFill style={{ fontFamily: sans }}>
      <Backdrop />
      <Sequence durationInFrames={plan.intro}>
        <Intro copy={copy} shape={shape} duration={plan.intro} voiceStart={VOICE_DELAY.intro} voiceLen={plan.vf.intro} />
      </Sequence>
      <Sequence from={at.demo} durationInFrames={plan.demo}>
        <Demo copy={copy} shape={shape} market={market} path={PATHS[market]} manifest={manifest} tl={tl} duration={plan.demo} />
      </Sequence>
      <Sequence from={at.benefits} durationInFrames={plan.benefits}>
        <Benefits copy={copy} shape={shape} duration={plan.benefits} voiceStart={VOICE_DELAY.benefits} voiceLen={plan.vf.benefits} />
      </Sequence>
      <Sequence from={at.outro} durationInFrames={plan.outro}>
        <Outro copy={copy} shape={shape} />
      </Sequence>
      <ThermalBar />
      {(Object.keys(voiceAt) as VoiceLine[]).map((line) => (
        <Sequence key={line} from={voiceAt[line]} durationInFrames={plan.vf[line] + 15}>
          <Html5Audio src={staticFile(`voice/${market}/${line}.wav`)} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
}
