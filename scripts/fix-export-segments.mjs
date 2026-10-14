// Post-build fix for static exports built on Windows.
//
// Next 16 writes per-segment prefetch files as `__next.<segment path with "/" → ".">.txt`.
// On Windows its segment paths use "\" separators, so instead of flat files it creates
// nested folders (`__next.uk/$d$slug/__PAGE__.txt`) that the client router never requests.
// This flattens them to the names the router fetches (`__next.uk.$d$slug.__PAGE__.txt`).
// On Linux/macOS (e.g. Cloudflare Pages builds) there is nothing to fix and it is a no-op.
import fs from "node:fs";
import path from "node:path";

const OUT = path.join(process.cwd(), "out");
let moved = 0;

function filesUnder(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = path.join(dir, d.name);
    return d.isDirectory() ? filesUnder(p) : [p];
  });
}

function walk(dir) {
  for (const d of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!d.isDirectory()) continue;
    const full = path.join(dir, d.name);
    if (d.name.startsWith("__next.")) {
      for (const file of filesUnder(full)) {
        const rel = path.relative(full, file).split(path.sep).join(".");
        fs.renameSync(file, path.join(dir, `${d.name}.${rel}`));
        moved++;
      }
      fs.rmSync(full, { recursive: true, force: true });
    } else {
      walk(full);
    }
  }
}

if (fs.existsSync(OUT)) walk(OUT);
console.log(moved ? `fix-export-segments: flattened ${moved} prefetch files` : "fix-export-segments: nothing to fix");
