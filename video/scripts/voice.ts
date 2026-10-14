// Generates the voiceover with free, offline, open-source speech models (no account needed).
//
//   npm run voice                (all markets)
//   npm run voice -- de          (some markets)
//
// English (US, UK) and French: Kokoro-82M (Apache-2.0) through kokoro-js. French uses the
//   ff_siwis voice (trained on the SIWIS corpus, CC BY 4.0: credit "SIWIS French speech corpus").
//   kokoro-js only phonemises English, so French text is phonemised by Piper's eSpeak NG
//   (any French Piper model works for that; its audio is discarded).
// German: Piper with the Thorsten voice (Thorsten-Voice dataset, CC0). Needs the Windows build in
//   .tools/piper/ and the model in .tools/voices/ (see video/README.md).
//
// Writes public/voice/<market>/<line>.wav (16-bit mono, peak-normalised, silence trimmed) and
// public/voice/<market>/durations.json (seconds per line), which the compositions read.
import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { KokoroTTS } from "kokoro-js";
import { COPY, VOICE_LINES, type Market } from "../src/copy";

const OUT = path.resolve("public", "voice");
const TOOLS = path.resolve(".tools");

type Engine =
  | { kind: "kokoro"; voice: string; speed: number; /** Piper model used only to phonemise non-English text. */ phonemizer?: string }
  | { kind: "piper"; model: string };

const ENGINES: Record<Market, Engine> = {
  us: { kind: "kokoro", voice: "af_heart", speed: 1 },
  uk: { kind: "kokoro", voice: "bf_emma", speed: 1 },
  fr: { kind: "kokoro", voice: "ff_siwis", speed: 1, phonemizer: "fr_FR-siwis-low.onnx" },
  de: { kind: "piper", model: "de_DE-thorsten-high.onnx" },
};

// ── WAV helpers ──────────────────────────────────────────────────────────────

function readWav(file: string): { samples: Float32Array; rate: number } {
  const buf = fs.readFileSync(file);
  let pos = 12;
  let rate = 22050;
  let bits = 16;
  while (pos < buf.length) {
    const id = buf.toString("ascii", pos, pos + 4);
    const size = buf.readUInt32LE(pos + 4);
    if (id === "fmt ") {
      rate = buf.readUInt32LE(pos + 12);
      bits = buf.readUInt16LE(pos + 22);
    } else if (id === "data") {
      const data = buf.subarray(pos + 8, pos + 8 + size);
      const samples =
        bits === 16
          ? Float32Array.from({ length: data.length / 2 }, (_, i) => data.readInt16LE(i * 2) / 32768)
          : new Float32Array(data.buffer.slice(data.byteOffset, data.byteOffset + data.length));
      return { samples, rate };
    }
    pos += 8 + size + (size % 2);
  }
  throw new Error(`${file}: no data chunk`);
}

/** Trims silence (keeping a little air), normalises the peak to -1 dBFS and writes 16-bit PCM. */
function writeWav(file: string, raw: Float32Array, rate: number): number {
  const threshold = 0.01;
  let start = raw.findIndex((s) => Math.abs(s) > threshold);
  let end = raw.length - 1;
  while (end > 0 && Math.abs(raw[end]) <= threshold) end--;
  if (start < 0) start = 0;
  const pad = Math.round(rate * 0.05);
  const samples = raw.subarray(Math.max(0, start - pad), Math.min(raw.length, end + pad));

  const peak = samples.reduce((m, s) => Math.max(m, Math.abs(s)), 0) || 1;
  const gain = 0.891 / peak; // -1 dBFS
  const data = Buffer.alloc(samples.length * 2);
  samples.forEach((s, i) => data.writeInt16LE(Math.max(-32768, Math.min(32767, Math.round(s * gain * 32767))), i * 2));

  const header = Buffer.alloc(44);
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + data.length, 4);
  header.write("WAVEfmt ", 8);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20); // PCM
  header.writeUInt16LE(1, 22); // mono
  header.writeUInt32LE(rate, 24);
  header.writeUInt32LE(rate * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write("data", 36);
  header.writeUInt32LE(data.length, 40);
  fs.writeFileSync(file, Buffer.concat([header, data]));
  return samples.length / rate;
}

// ── Engines ──────────────────────────────────────────────────────────────────

let kokoro: KokoroTTS | null = null;

async function ensureKokoroVoice(voice: string) {
  // kokoro-js ships the English voices; others are fetched once from the model repo.
  const file = path.resolve("node_modules", "kokoro-js", "voices", `${voice}.bin`);
  if (fs.existsSync(file)) return;
  const res = await fetch(`https://huggingface.co/onnx-community/Kokoro-82M-v1.0-ONNX/resolve/main/voices/${voice}.bin`);
  if (!res.ok) throw new Error(`voice ${voice}: HTTP ${res.status}`);
  fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
}

async function speakKokoro(text: string, engine: Extract<Engine, { kind: "kokoro" }>) {
  kokoro ??= await KokoroTTS.from_pretrained("onnx-community/Kokoro-82M-v1.0-ONNX", { dtype: "fp32", device: "cpu" });
  await ensureKokoroVoice(engine.voice);
  if (!engine.phonemizer) return kokoro.generate(text, { voice: engine.voice as "af_heart", speed: engine.speed });
  const phonemes = piperPhonemes(text.normalize("NFKC"), engine.phonemizer);
  const { input_ids } = kokoro.tokenizer(phonemes, { truncation: true });
  return kokoro.generate_from_ids(input_ids, { voice: engine.voice as "af_heart", speed: engine.speed });
}

/** eSpeak NG phonemes for `text`, read from Piper's debug log (one line per sentence). */
function piperPhonemes(text: string, model: string): string {
  const tmp = path.join(OUT, "phonemes.tmp.wav");
  const { stderr } = spawnSync(path.join(TOOLS, "piper", "piper.exe"), ["--model", path.join(TOOLS, "voices", model), "--output_file", tmp, "--debug"], {
    input: text,
    encoding: "utf8",
  });
  fs.rmSync(tmp, { force: true });
  const phonemes = stderr
    .split(/\r?\n/)
    .flatMap((l) => (/Converting \d+ phoneme\(s\) to ids: /.test(l) ? [l.split("to ids: ")[1]] : []))
    .join(" ");
  if (!phonemes) throw new Error(`no phonemes from Piper for: ${text}`);
  return phonemes;
}

function speakPiper(text: string, engine: Extract<Engine, { kind: "piper" }>, tmp: string) {
  execFileSync(path.join(TOOLS, "piper", "piper.exe"), ["--model", path.join(TOOLS, "voices", engine.model), "--output_file", tmp], {
    input: text,
    stdio: ["pipe", "ignore", "ignore"],
  });
  return readWav(tmp);
}

// ── Main ─────────────────────────────────────────────────────────────────────

const wanted = process.argv.slice(2).filter((a): a is Market => a in COPY);
const markets = wanted.length ? wanted : (Object.keys(COPY) as Market[]);

for (const market of markets) {
  const dir = path.join(OUT, market);
  fs.mkdirSync(dir, { recursive: true });
  const engine = ENGINES[market];
  const durations: Record<string, number> = {};
  for (const line of VOICE_LINES) {
    const text = COPY[market].voice[line];
    const file = path.join(dir, `${line}.wav`);
    if (engine.kind === "kokoro") {
      const audio = await speakKokoro(text, engine);
      durations[line] = writeWav(file, audio.audio, audio.sampling_rate);
    } else {
      const tmp = path.join(dir, `${line}.raw.wav`);
      const { samples, rate } = speakPiper(text, engine, tmp);
      fs.rmSync(tmp);
      durations[line] = writeWav(file, samples, rate);
    }
  }
  fs.writeFileSync(path.join(dir, "durations.json"), JSON.stringify(durations, null, 2));
  console.log(market, Object.entries(durations).map(([k, v]) => `${k} ${v.toFixed(1)}s`).join(" · "));
}
