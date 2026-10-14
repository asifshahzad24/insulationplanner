// Renders the promo videos.
//
//   npm run render                    all 8 videos to out/, plus the website copies
//   npm run render -- us-wide de-tall some videos
//   npm run render -- --stills        review frames to out/stills/ (half size)
//
// Website copies (wide versions only) go to the site's public/video/:
//   <market>.mp4 (1280×720), <market>-poster.jpg and <market>.vtt (captions of the voiceover).
import fs from "node:fs";
import path from "node:path";
import { bundle } from "@remotion/bundler";
import { renderMedia, renderStill, selectComposition } from "@remotion/renderer";
import { COPY, VOICE_LINES, type Market } from "../src/copy";
import { FPS, makePlan, type PromoProps, type Shape } from "../src/plan";

const OUT = path.resolve("out");
const SITE_VIDEO = path.resolve("..", "public", "video");
const ALL = (Object.keys(COPY) as Market[]).flatMap((m) => (["wide", "tall"] as Shape[]).map((s) => `${m}-${s}`));

const args = process.argv.slice(2);
const stills = args.includes("--stills");
const ids = args.filter((a) => ALL.includes(a));
const targets = ids.length ? ids : ALL;

const serveUrl = await bundle({ entryPoint: path.resolve("src", "index.ts"), publicDir: path.resolve("public") });
fs.mkdirSync(OUT, { recursive: true });

const vttTime = (frame: number) => {
  const ms = Math.round((frame / FPS) * 1000);
  const h = String(Math.floor(ms / 3_600_000)).padStart(2, "0");
  const m = String(Math.floor(ms / 60_000) % 60).padStart(2, "0");
  const s = String(Math.floor(ms / 1000) % 60).padStart(2, "0");
  return `${h}:${m}:${s}.${String(ms % 1000).padStart(3, "0")}`;
};

for (const id of targets) {
  const composition = await selectComposition({ serveUrl, id, inputProps: {} });
  const props = composition.props as PromoProps;
  const plan = makePlan(props.manifest!, props.voice!);
  const [market, shape] = id.split("-") as [Market, Shape];

  if (stills) {
    const dir = path.join(OUT, "stills");
    fs.mkdirSync(dir, { recursive: true });
    const tl = plan.timeline;
    const frames = {
      hook: 40,
      questions: plan.voiceAt.intro + Math.round(plan.vf.intro * 0.95),
      step1: plan.at.demo + tl.captions[0].at + 70,
      step2: plan.at.demo + tl.captions[1].at + 60,
      result: plan.at.demo + tl.resultsAt + 80,
      benefits: plan.at.benefits + Math.round(plan.benefits * 0.85),
      outro: plan.at.outro + 100,
    };
    for (const [name, frame] of Object.entries(frames)) {
      await renderStill({ composition, serveUrl, frame, output: path.join(dir, `${id}-${name}.jpg`), imageFormat: "jpeg", jpegQuality: 85, scale: 0.5 });
    }
    console.log(`${id}: stills at ${JSON.stringify(frames)}`);
    continue;
  }

  const output = path.join(OUT, `${id}.mp4`);
  await renderMedia({ composition, serveUrl, codec: "h264", crf: 18, imageFormat: "jpeg", jpegQuality: 92, outputLocation: output });
  console.log(`${id}: ${output} (${(fs.statSync(output).size / 1e6).toFixed(1)} MB, ${(plan.total / FPS).toFixed(1)} s)`);

  if (shape === "wide") {
    fs.mkdirSync(SITE_VIDEO, { recursive: true });
    const web = path.join(SITE_VIDEO, `${market}.mp4`);
    await renderMedia({ composition, serveUrl, codec: "h264", crf: 27, scale: 2 / 3, imageFormat: "jpeg", jpegQuality: 85, outputLocation: web });
    await renderStill({
      composition,
      serveUrl,
      frame: plan.at.demo + plan.timeline.resultsAt + 80,
      output: path.join(SITE_VIDEO, `${market}-poster.jpg`),
      imageFormat: "jpeg",
      jpegQuality: 80,
      scale: 2 / 3,
    });
    const cues = VOICE_LINES.map((line) => {
      const start = plan.voiceAt[line];
      const text = COPY[market].voice[line].replace("Loft Insulation Calc dot com", "loftinsulationcalc.com");
      return `${vttTime(start)} --> ${vttTime(start + plan.vf[line])}\n${text}`;
    });
    fs.writeFileSync(path.join(SITE_VIDEO, `${market}.vtt`), `WEBVTT\n\n${cues.join("\n\n")}\n`);
    console.log(`${id}: website copy ${(fs.statSync(web).size / 1e6).toFixed(1)} MB, poster and captions`);
  }
}
