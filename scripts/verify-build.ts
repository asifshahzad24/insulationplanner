// Checks the static export in out/ against the route registry.
//   npm run build && npm run verify
import fs from "node:fs";
import path from "node:path";
import { site } from "../src/config/site";
import { MARKETS } from "../src/markets/meta";
import { alternatesOf, pathOf, ROUTES } from "../src/routes/registry";

const OUT = path.join(process.cwd(), "out");
const errors: string[] = [];
const fail = (msg: string) => errors.push(msg);

const fileFor = (p: string) => (p === "/" ? path.join(OUT, "index.html") : path.join(OUT, `${p.slice(1)}.html`));
const url = (p: string) => (p === "/" ? site.url : `${site.url}${p}`);

for (const entry of ROUTES) {
  const p = pathOf(entry);
  const file = fileFor(p);
  if (!fs.existsSync(file)) {
    fail(`${p}: missing ${path.relative(OUT, file)}`);
    continue;
  }
  const html = fs.readFileSync(file, "utf8");
  const lang = MARKETS[entry.market].lang;
  if (!html.includes(`<html lang="${lang}"`)) fail(`${p}: <html lang> is not ${lang}`);
  if (!/<title>[^<]{10,}<\/title>/.test(html)) fail(`${p}: missing <title>`);
  if (!html.includes('name="description"')) fail(`${p}: missing meta description`);
  if (!html.includes(`<link rel="canonical" href="${url(p)}"`)) fail(`${p}: canonical should be ${url(p)}`);
  const hreflangs = html.match(/<link rel="alternate" hreflang="[^"]+"/gi) ?? [];
  const expected = alternatesOf(entry).length + 1; // + x-default
  if (hreflangs.length !== expected) fail(`${p}: ${hreflangs.length} hreflang links, expected ${expected}`);
  if ((html.match(/<h1[\s>]/g) ?? []).length !== 1) fail(`${p}: expected exactly one <h1>`);
  if (entry.kind !== "article" && !html.includes('"@type":"WebApplication"')) fail(`${p}: missing WebApplication JSON-LD`);
  if (entry.kind === "calculator" && !html.includes('id="results"')) fail(`${p}: calculator results not prerendered`);
  if (!html.includes(`<meta property="og:image" content="${site.url}/og/${entry.market}.png"`)) fail(`${p}: missing og:image`);
}

const sitemap = fs.existsSync(path.join(OUT, "sitemap.xml")) ? fs.readFileSync(path.join(OUT, "sitemap.xml"), "utf8") : "";
if (!sitemap) fail("missing sitemap.xml");
for (const entry of ROUTES) if (sitemap && !sitemap.includes(`<loc>${url(pathOf(entry))}</loc>`)) fail(`sitemap missing ${pathOf(entry)}`);
for (const f of ["robots.txt", "404.html", "llms.txt", "_headers", "og/us.png", "og/uk.png", "og/de.png", "og/fr.png"]) if (!fs.existsSync(path.join(OUT, f))) fail(`missing ${f}`);
const zipChunks = fs.existsSync(path.join(OUT, "data", "zip")) ? fs.readdirSync(path.join(OUT, "data", "zip")).length : 0;
if (zipChunks < 800) fail(`expected ~891 ZIP chunks in out/data/zip, found ${zipChunks}`);

if (errors.length) {
  console.error(`✗ ${errors.length} problem(s):\n  ${errors.join("\n  ")}`);
  process.exit(1);
}
console.log(`✓ ${ROUTES.length} pages, sitemap, robots, 404, llms.txt, headers and ${zipChunks} ZIP chunks look right.`);
