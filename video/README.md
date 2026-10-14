# Promo videos

These are 30–35 second promo videos for each market (US, UK, DE, FR), in two shapes:

- **wide:** 1920×1080, for YouTube and the website
- **tall:** 1080×1920, for TikTok, Reels and Shorts

Each video shows real screenshots of the live calculator, animated with [Remotion](https://www.remotion.dev). The voiceover comes from free, offline, open-source speech models.

This folder is its own npm package. The website's install, lint, typecheck and build ignore it.

## One-time setup (Windows)

```bash
cd video
npm install
```

The German voice and the French phonemes come from [Piper](https://github.com/rhasspy/piper). Put the Windows build in `.tools/piper/`:

- the contents of `piper_windows_amd64.zip` from release 2023.11.14-2

Put these models in `.tools/voices/` (from [rhasspy/piper-voices](https://huggingface.co/rhasspy/piper-voices)):

- `de_DE-thorsten-high.onnx` and `.onnx.json`
- `fr_FR-siwis-low.onnx` and `.onnx.json` (used only to phonemise French text)

The first `npm run voice` downloads the Kokoro model (about 330 MB). The first render downloads a headless Chrome.

## Making the videos

```bash
npm run capture   # screenshots of the live site → public/capture/ (uses Microsoft Edge)
npm run voice     # voiceover → public/voice/
npm run render    # 8 videos → out/, plus website copies → ../public/video/
```

| Command | What it does |
|---|---|
| `npm run render -- --stills` | Renders review frames to `out/stills/` |
| `npm run render -- us-wide de-tall` | Renders only the videos you name |
| `npm run studio` | Opens the Remotion preview in the browser |
| `BASE_URL=http://localhost:3000 npm run capture` | Captures a local build |

After the site changes (prices, layout, wording), rerun `capture` and `render`.

## What to edit

| To change | Edit |
|---|---|
| Captions and voiceover text | `src/copy.ts` (then run `voice`) |
| What the demo types and clicks | `scripts/scenarios.ts` (then run `capture`) |
| Look and timing | `src/scenes/*`, `src/timeline.ts`, `src/plan.ts` |

## Voices and licences

| Market | Engine | Voice | Licence |
|---|---|---|---|
| US | Kokoro-82M | `af_heart` | Apache-2.0 |
| UK | Kokoro-82M | `bf_emma` | Apache-2.0 |
| FR | Kokoro-82M | `ff_siwis` | Apache-2.0; voice trained on the SIWIS corpus (CC BY 4.0) |
| DE | Piper | Thorsten (high) | Thorsten-Voice dataset (CC0) |

When you post the French video, add this credit to the description: *"Voice: Kokoro ff_siwis, trained on the SIWIS French speech corpus (CC BY 4.0)."*

Piper's German Thorsten model was fine-tuned from an English base voice whose dataset is licensed for research. If that matters for your use, switch German to the `de_DE-mls-medium` voice in `scripts/voice.ts`: it was trained from scratch on CC BY 4.0 data.

Remotion is free for individuals and companies with up to 3 employees (see remotion.dev/license).
