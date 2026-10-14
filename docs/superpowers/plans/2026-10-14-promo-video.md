# Promo Video Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce 8 promo MP4s (4 markets × 16:9 and 9:16) from real screenshots of the live calculator, and embed the 16:9 version on each home page.

**Architecture:** `video/` is a standalone npm package. Playwright (system Edge) captures the calculator step by step into PNGs plus a JSON manifest. Remotion 4 composes the captured frames with captions, a camera, a cursor and branded intro and outro scenes. A render script writes the MP4s and the web copies. The site gets a `PromoVideo` component on home pages.

**Tech Stack:** Remotion 4.0.530 (pinned, more than 2 weeks old), playwright-core (Edge channel, no browser download), @remotion/google-fonts (Bricolage Grotesque, Geist), tsx.

Spec: [docs/superpowers/specs/2026-10-14-promo-video-design.md](../specs/2026-10-14-promo-video-design.md)

---

### Task 1: Scaffold `video/` and keep it out of the site's tooling

**Files:** create `video/package.json`, `video/tsconfig.json`, `video/remotion.config.ts`, `video/.gitignore`. Modify root `tsconfig.json` (exclude `video`) and `eslint.config.mjs` (ignore `video/**`).

- [ ] `video/package.json`: pinned `remotion`, `@remotion/cli`, `@remotion/renderer`, `@remotion/bundler`, `@remotion/google-fonts` at 4.0.530, `react`/`react-dom` 19, `playwright-core`, `tsx`, `typescript`.
- [ ] `video/.gitignore`: `node_modules/`, `out/`, `public/capture/`
- [ ] `npm install` in `video/`
- [ ] Root `npm run check` still passes; `video/` must not be linted or typechecked by the site.

### Task 2: Capture script

**Files:** create `video/scripts/capture.ts` and `video/scripts/scenarios.ts`.

- [ ] One scenario per market: an ordered list of actions (`click` a segmented option or button, `fill` an input key by key, `select` an option), each tagged with its caption step (1–3) and the element to point at.
- [ ] Two layouts:
  - desktop: viewport 1280×900, deviceScaleFactor 2
  - mobile: viewport 400×860, deviceScaleFactor 3
- [ ] Hide the fixed mobile summary bar and the cookie-free analytics beacon through injected CSS.
- [ ] After every action, wait for the result panel to settle, then screenshot the calculator card. Record the target's box relative to the card, and record the results panel's box.
- [ ] Write `video/public/capture/<market>-<layout>/NN.png` and `manifest.json` (card size, frames[], resultsBox).
- [ ] Run against `https://loftinsulationcalc.com` (override with `BASE_URL`).
- [ ] Verify: the frame counts look right, and spot-check a first, a middle and a last PNG per market by viewing them.

### Task 3: Remotion compositions

**Files:** create `video/src/index.ts`, `Root.tsx`, `copy.ts`, `theme.ts`, `fonts.ts`, `scenes/Intro.tsx`, `scenes/Demo.tsx`, `scenes/Benefits.tsx`, `scenes/Outro.tsx`, `Promo.tsx`.

- [ ] `copy.ts`: per-market strings (hook, questions[3], steps[3], result, benefits[3], tagline).
- [ ] `Promo.tsx`: `<Series>` of Intro (6 s), Demo (15 s), Benefits (4 s), Outro (5 s). Total 900 frames at 30 fps.
- [ ] Demo:
  - Play the frame sequence with time split evenly per step.
  - The camera (scale and translate) eases toward the active target box and ends on the results box.
  - A cursor glides to each target with a click pulse.
  - The caption chip shows "1 · …".
  - Wide layout: card in a browser-chrome frame on the left two-thirds, caption on the right. Tall layout: phone frame in the centre, caption on top.
- [ ] Register `us-wide`, `us-tall`, … (8 compositions) and a `--props`-free default.
- [ ] Verify: render stills at frames 45, 300, 600 and 840 for `us-wide` and `de-tall`, and view them.

### Task 4: Render all versions

**Files:** create `video/scripts/render.ts`.

- [ ] Bundle once, then `renderMedia` the 8 compositions to `video/out/<market>-<shape>.mp4` (h264, crf 18).
- [ ] Web copies: `<market>-wide` at scale 2/3 (1280×720), crf 28, to `public/video/<market>.mp4`, plus `renderStill` frame 600 as `public/video/<market>-poster.jpg`.
- [ ] Verify: 8 + 4 files exist, the web MP4s are under 8 MB, and each duration is 30 s (ffprobe from the Remotion bundle).

### Task 5: Embed on home pages

**Files:** create `src/components/site/PromoVideo.tsx`. Modify `src/components/site/PageView.tsx` and the i18n dictionaries (`video.title`, `video.desc` in en-US, en-GB, de, fr).

- [ ] Section under the calculator on `entry.group === "home"`:
  - h2 heading
  - `<video controls preload="none" playsInline poster width height>` with an MP4 source
  - a one-line description
- [ ] `npm run check`, `npm run build`, `npm run verify`; check in the browser that the poster shows and the video plays on `/`.
- [ ] Commit, push and check the live site.
