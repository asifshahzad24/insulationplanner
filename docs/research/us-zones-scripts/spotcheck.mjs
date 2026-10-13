// Consumer-side check: looks ZIPs up exactly the way the website will
// (fetch zip3/<first3>.json, read the key) and joins counties/states for context.
// Usage: node scripts/spotcheck.mjs [root] [zip ...]
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
const root = resolve(args[0] && !/^\d{5}$/.test(args[0]) ? args.shift() : join(dirname(fileURLToPath(import.meta.url)), '..'));
const OUT = join(root, 'out');

function lookup(zip) {
  const f = join(OUT, 'zip3', `${zip.slice(0, 3)}.json`);
  if (!existsSync(f)) return null;
  return JSON.parse(readFileSync(f, 'utf8'))[zip] ?? null;
}

const DEFAULT = [
  ['60601', '5A'], ['10001', '4A'], ['33101', '1A'], ['33130', '1A'], ['85001', '2B'], ['85004', '2B'],
  ['99501', '7'], ['98101', '4C'], ['80202', '5B'], ['55401', '6A'],
];
const checks = args.length ? args.map(z => [z, undefined]) : DEFAULT;
let fail = 0;
for (const [z, expect] of checks) {
  const got = lookup(z);
  const status = expect === undefined ? '' : got === expect ? 'OK' : got === null ? 'NOT A ZCTA' : 'MISMATCH';
  if (status === 'MISMATCH') fail++;
  console.log(`${z}  got=${got ?? '-'}${expect ? `  expected=${expect}` : ''}  ${status}`);
}

// Integrity: every value is a valid zone, every key sits in the right file.
const ZONE_RE = /^(?:[0-6][ABC]|[78])$/;
let n = 0;
for (const f of readdirSync(join(OUT, 'zip3'))) {
  const obj = JSON.parse(readFileSync(join(OUT, 'zip3', f), 'utf8'));
  for (const [k, v] of Object.entries(obj)) {
    n++;
    if (!k.startsWith(f.slice(0, 3)) || !ZONE_RE.test(v)) { console.log('BAD', f, k, v); fail++; }
  }
}
const counties = JSON.parse(readFileSync(join(OUT, 'counties.json'), 'utf8'));
const states = JSON.parse(readFileSync(join(OUT, 'states.json'), 'utf8'));
console.log(`zip3 entries=${n}  counties=${Object.keys(counties).length}  states=${Object.keys(states).length}`);
console.log('IL', JSON.stringify(states.IL), ' 17031', JSON.stringify(counties['17031']));
process.exit(fail ? 1 : 0);
