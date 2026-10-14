// Generates the site's raster images. Outputs are committed; rerun after editing the sources.
//   npm run images
// From src/app/icon.svg:
//   public/icon-512.png      logo for Google (Organization structured data)
//   src/app/icon1.png        192 px PNG favicon, next to icon.svg
//   src/app/apple-icon.png   180 px home-screen icon (square: iOS fills transparent corners with black)
//   src/app/favicon.ico      48 px, for crawlers and browsers that only ask for /favicon.ico
// From src/lib/diagrams.ts:
//   public/images/<file>     attic cross-section per market
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { ATTIC_DIAGRAMS, DIAGRAM_SIZE, type AtticDiagram } from "../src/lib/diagrams";
import { MARKET_IDS } from "../src/markets/meta";

const ROOT = process.cwd();
const out = (p: string) => path.join(ROOT, p);

// ── Icons ───────────────────────────────────────────────────────────────────
const iconSvg = fs.readFileSync(out("src/app/icon.svg"), "utf8");
const squareIconSvg = iconSvg.replace(' rx="6.5"', "");

/** icon.svg has a 24-unit viewBox; render at the target size so nothing is upscaled. */
const iconPng = (svg: string, size: number) =>
  sharp(Buffer.from(svg), { density: (72 * size) / 24 }).resize(size, size).png().toBuffer();

/** Single-image .ico that wraps a PNG (supported by every browser since Vista-era IE). */
function icoFromPng(pngData: Buffer, size: number): Buffer {
  const header = Buffer.alloc(22);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(1, 4); // image count
  header.writeUInt8(size, 6); // width
  header.writeUInt8(size, 7); // height
  header.writeUInt8(0, 8); // palette
  header.writeUInt8(0, 9); // reserved
  header.writeUInt16LE(1, 10); // colour planes
  header.writeUInt16LE(32, 12); // bits per pixel
  header.writeUInt32LE(pngData.length, 14);
  header.writeUInt32LE(22, 18); // offset of the image data
  return Buffer.concat([header, pngData]);
}

// ── Attic diagram ───────────────────────────────────────────────────────────
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const FONT = "'Segoe UI', 'Helvetica Neue', Arial, sans-serif";

function atticSvg(d: AtticDiagram): string {
  const { width: W, height: H } = DIAGRAM_SIZE;
  // Cross-section card and its layers (y grows downwards).
  const L = 200, R = 900;
  const yAir = 170, yNew = 300, yJoist = 420, yCeil = 490, yRoom = 504, yBottom = 650;
  const joists = Array.from({ length: 8 }, (_, k) => 230 + k * 90);

  // Fluffy top edge of the new layer.
  let newLayer = `M${L},${yJoist} L${L},${yNew + 6}`;
  for (let x = L; x < R; x += 20) newLayer += ` Q${x + 10},${yNew - 6} ${x + 20},${yNew + 6}`;
  newLayer += ` L${R},${yJoist} Z`;

  const arrowHead = (x: number, y: number, dir: 1 | -1) =>
    `<path d="M${x},${y} l${-12 * dir},-7 v14 z" fill="#2a313b"/>`;

  /** Label on the right with a leader line to a point in the drawing. */
  const label = (tx: number, ty: number, title: string, sub: string | null, px: number, py: number) => `
    <path d="M${px},${py} L${tx - 12},${ty - 7}" stroke="#0e1116" stroke-width="1.6" fill="none"/>
    <circle cx="${px}" cy="${py}" r="5" fill="#0e1116" stroke="#fff" stroke-width="2"/>
    <text x="${tx}" y="${ty}" font-size="21" font-weight="700" fill="#0e1116">${esc(title)}</text>
    ${sub ? `<text x="${tx}" y="${ty + 25}" font-size="17" fill="#5b6470">${esc(sub)}</text>` : ""}`;

  const x0 = 936;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="${FONT}">
  <defs>
    <linearGradient id="thermal" x1="0" x2="1">
      <stop offset="0" stop-color="#dc2626"/><stop offset=".25" stop-color="#f97316"/><stop offset=".5" stop-color="#facc15"/>
      <stop offset=".7" stop-color="#22d3ee"/><stop offset=".85" stop-color="#3b82f6"/><stop offset="1" stop-color="#312e81"/>
    </linearGradient>
    <linearGradient id="cool" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#dbeafe"/><stop offset="1" stop-color="#f1f7ff"/></linearGradient>
    <linearGradient id="warm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff4ea"/><stop offset="1" stop-color="#ffdcbc"/></linearGradient>
    <pattern id="woolNew" width="28" height="18" patternUnits="userSpaceOnUse">
      <rect width="28" height="18" fill="#fde68a"/>
      <path d="M0 9 q7 -7 14 0 t14 0" stroke="#e5b53f" stroke-width="1.6" fill="none"/>
    </pattern>
    <pattern id="woolOld" width="28" height="18" patternUnits="userSpaceOnUse">
      <rect width="28" height="18" fill="#f3c14f"/>
      <path d="M0 9 q7 -7 14 0 t14 0" stroke="#c9952a" stroke-width="1.6" fill="none"/>
    </pattern>
    <clipPath id="card"><rect x="${L}" y="${yAir}" width="${R - L}" height="${yBottom - yAir}" rx="18"/></clipPath>
  </defs>

  <rect width="${W}" height="${H}" fill="#f8fafc"/>
  <rect width="${W}" height="8" fill="url(#thermal)"/>

  <!-- where this is: a house with the attic floor highlighted -->
  <g stroke="#2a313b" stroke-width="4" stroke-linejoin="round" fill="none">
    <polygon points="48,92 140,30 232,92"/>
    <rect x="62" y="92" width="156" height="58" fill="#ffffff"/>
    <rect x="86" y="108" width="28" height="22" stroke-width="3" fill="#fff1e6"/>
    <rect x="160" y="116" width="26" height="34" stroke-width="3"/>
  </g>
  <line x1="66" y1="92" x2="214" y2="92" stroke="#ea580c" stroke-width="7" stroke-linecap="round"/>

  <text x="300" y="86" font-size="36" font-weight="700" fill="#0e1116">${esc(d.title)}</text>
  <text x="300" y="124" font-size="20" fill="#5b6470">${esc(d.subtitle)}</text>

  <g clip-path="url(#card)">
    <rect x="${L}" y="${yAir}" width="${R - L}" height="${yNew - yAir + 10}" fill="url(#cool)"/>
    <text x="${L + 24}" y="${yAir + 44}" font-size="20" font-weight="600" fill="#2563eb">${esc(d.labels.attic)}</text>
    <rect x="${L}" y="${yJoist}" width="${R - L}" height="${yCeil - yJoist}" fill="url(#woolOld)"/>
    <path d="${newLayer}" fill="url(#woolNew)" stroke="#d9a83a" stroke-width="1.5"/>
    ${joists.map((x) => `<rect x="${x}" y="${yJoist}" width="24" height="${yCeil - yJoist}" fill="#c98a4b" stroke="#8a5a2b" stroke-width="2"/>`).join("")}
    <rect x="${L}" y="${yCeil}" width="${R - L}" height="${yRoom - yCeil}" fill="#e5e7eb" stroke="#9ca3af" stroke-width="1.5"/>
    <rect x="${L}" y="${yRoom}" width="${R - L}" height="${yBottom - yRoom}" fill="url(#warm)"/>
    <line x1="${L + 30}" y1="548" x2="${R - 30}" y2="548" stroke="#2a313b" stroke-width="2.5"/>
    ${arrowHead(L + 26, 548, -1)}${arrowHead(R - 26, 548, 1)}
    <text x="${(L + R) / 2}" y="586" font-size="19" font-weight="600" fill="#2a313b" text-anchor="middle">${esc(d.labels.measure)}</text>
    <text x="${(L + R) / 2}" y="626" font-size="18" font-weight="600" fill="#c2410c" text-anchor="middle">${esc(d.labels.room)}</text>
  </g>
  <rect x="${L}" y="${yAir}" width="${R - L}" height="${yBottom - yAir}" rx="18" fill="none" stroke="#d3d8de" stroke-width="2"/>

  <!-- depths -->
  <g stroke="#2a313b" stroke-width="2">
    <line x1="180" y1="${yNew}" x2="180" y2="${yCeil}"/>
    <line x1="171" y1="${yNew}" x2="189" y2="${yNew}"/>
    <line x1="171" y1="${yJoist}" x2="189" y2="${yJoist}"/>
    <line x1="171" y1="${yCeil}" x2="189" y2="${yCeil}"/>
  </g>
  <text x="164" y="${(yNew + yJoist) / 2 + 8}" font-size="24" font-weight="700" fill="#c2410c" text-anchor="end">${esc(d.dims.add)}</text>
  <text x="164" y="${(yJoist + yCeil) / 2 + 7}" font-size="20" font-weight="600" fill="#5b6470" text-anchor="end">${esc(d.dims.existing)}</text>

  <!-- labels -->
  ${label(x0, 338, d.labels.add[0], d.labels.add[1], 862, 362)}
  ${label(x0, 430, d.labels.existing[0], d.labels.existing[1], 846, 456)}
  ${label(x0, 510, d.labels.joists, null, 872, 474)}
  ${label(x0, 556, d.labels.ceiling, null, 884, 497)}

  <text x="${W - 36}" y="${H - 28}" font-size="17" fill="#8a929c" text-anchor="end">loftinsulationcalc.com</text>
</svg>`;
}

async function main() {
  const p512 = await iconPng(iconSvg, 512);
  fs.writeFileSync(out("public/icon-512.png"), p512);
  fs.writeFileSync(out("src/app/icon1.png"), await iconPng(iconSvg, 192));
  fs.writeFileSync(out("src/app/apple-icon.png"), await iconPng(squareIconSvg, 180));
  fs.writeFileSync(out("src/app/favicon.ico"), icoFromPng(await iconPng(iconSvg, 48), 48));

  fs.mkdirSync(out("public/images"), { recursive: true });
  for (const m of MARKET_IDS) {
    const d = ATTIC_DIAGRAMS[m];
    const svg = atticSvg(d);
    if (process.argv.includes("--svg")) fs.writeFileSync(out(`public/images/${d.file.replace(/\.webp$/, ".svg")}`), svg);
    const file = out(`public/images/${d.file}`);
    await sharp(Buffer.from(svg), { density: 144 })
      .resize(DIAGRAM_SIZE.width, DIAGRAM_SIZE.height)
      .webp({ quality: 88 })
      .toFile(file);
    console.log(`${m}: public/images/${d.file} (${Math.round(fs.statSync(file).size / 1024)} KB)`);
  }
  console.log("icons: public/icon-512.png, src/app/icon1.png, src/app/apple-icon.png, src/app/favicon.ico");
}

main();
