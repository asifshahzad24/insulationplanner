// Screenshots the live calculator step by step for the promo video.
//
//   npm run capture                  (all markets, both layouts)
//   npm run capture -- us de         (some markets)
//   BASE_URL=http://localhost:3000 npm run capture
//
// Writes public/capture/<market>-<layout>/NN.png plus manifest.json (see src/types.ts).
// Uses the system's Microsoft Edge, so no browser download is needed.
import fs from "node:fs";
import path from "node:path";
import { chromium, type Page } from "playwright-core";
import type { Box, CaptureFrame, Layout, Manifest } from "../src/types";
import { SCENARIOS, type Action, type Market } from "./scenarios";

const BASE_URL = (process.env.BASE_URL ?? "https://loftinsulationcalc.com").replace(/\/$/, "");
const OUT = path.resolve("public", "capture"); // run from video/ (npm run capture)

const LAYOUTS: Record<Layout, { viewport: { width: number; height: number }; dpr: number }> = {
  desktop: { viewport: { width: 1280, height: 900 }, dpr: 2 },
  mobile: { viewport: { width: 400, height: 860 }, dpr: 3 },
};

// The fixed mobile summary bar would float over the card in element screenshots,
// and a blinking caret would flicker between frames.
const CAPTURE_CSS = `
  a[href="#results"].fixed { display: none !important; }
  input, select { caret-color: transparent !important; }
`;

/** Box of an element relative to the calculator card, in CSS pixels. */
async function relBox(page: Page, selector: string): Promise<Box | null> {
  return page.evaluate((sel) => {
    const card = document.querySelector("[data-capture=card]");
    const el = document.querySelector(sel);
    if (!card || !el) return null;
    const c = card.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    return { x: r.x - c.x, y: r.y - c.y, w: r.width, h: r.height };
  }, selector);
}

/** The element an action points at, and the question section around it (the camera's focus). */
function targetOf(action: Action): { point: string; focus: string } {
  if (action.kind === "radio") {
    const input = `input[type=radio][value="${action.value}"]`;
    return { point: `label:has(> ${input})`, focus: `section:has(${input})` };
  }
  return { point: action.sel, focus: `section:has(${action.sel})` };
}

async function captureOne(market: Market, layout: Layout) {
  const scenario = SCENARIOS[market];
  const { viewport, dpr } = LAYOUTS[layout];
  const dir = path.join(OUT, `${market}-${layout}`);
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });

  const browser = await chromium.launch({ channel: "msedge" });
  const context = await browser.newContext({ viewport, deviceScaleFactor: dpr, reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto(`${BASE_URL}${scenario.path}`, { waitUntil: "networkidle" });
  await page.addStyleTag({ content: CAPTURE_CSS });
  await page.evaluate(() => document.fonts.ready);

  const card = page.locator("form[aria-label]").first().locator("xpath=../..");
  await card.evaluate((el) => el.setAttribute("data-capture", "card"));

  const frames: CaptureFrame[] = [];
  const shoot = async (step: number, action: CaptureFrame["action"], target: { point: string; focus: string } | null) => {
    await page.waitForTimeout(120);
    const file = `${String(frames.length).padStart(2, "0")}.png`;
    await card.screenshot({ path: path.join(dir, file), animations: "disabled" });
    const size = (await relBox(page, "[data-capture=card]"))!;
    frames.push({
      file,
      w: size.w,
      h: size.h,
      step,
      action,
      point: target ? await relBox(page, target.point) : null,
      focus: target ? await relBox(page, target.focus) : null,
      results: await relBox(page, "#results"),
      // "To buy" and "Material cost" tiles (the first two-column grid in the result panel).
      buy: await relBox(page, "#results .grid.grid-cols-2"),
    });
  };

  for (const action of scenario.setup) {
    if (action.kind === "clear") await page.locator(action.sel).fill("");
  }
  await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
  await shoot(0, "start", null);

  for (const [i, actions] of scenario.steps.entries()) {
    const step = i + 1;
    for (const action of actions) {
      const target = targetOf(action);
      if (action.kind === "type") {
        await page.locator(action.sel).click();
        for (const ch of action.text) {
          await page.keyboard.type(ch);
          // The ZIP lookup fetches a small JSON chunk; give it time to land.
          if (action.sel === "#zip") await page.waitForTimeout(500);
          await shoot(step, "key", target);
        }
      } else if (action.kind === "radio") {
        await page.locator(target.point).click();
        await shoot(step, "click", target);
      } else if (action.kind === "select") {
        // Focus first, as a real click would, so the previous field loses its focus ring.
        await page.locator(action.sel).focus();
        await page.locator(action.sel).selectOption(action.value);
        await shoot(step, "click", target);
      }
    }
  }

  await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
  await shoot(4, "end", null);

  const manifest: Manifest = { market, layout, dpr, viewportW: viewport.width, frames };
  fs.writeFileSync(path.join(dir, "manifest.json"), JSON.stringify(manifest, null, 2));
  await browser.close();
  const last = frames.at(-1)!;
  console.log(`${market}-${layout}: ${frames.length} frames, card ${Math.round(last.w)}×${Math.round(last.h)}`);
}

const wanted = (process.argv.slice(2).filter((a) => a in SCENARIOS) as Market[]);
const markets = wanted.length ? wanted : (Object.keys(SCENARIOS) as Market[]);
for (const m of markets) {
  for (const layout of Object.keys(LAYOUTS) as Layout[]) await captureOne(m, layout);
}
