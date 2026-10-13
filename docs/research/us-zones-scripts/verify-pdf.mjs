// Cross-checks the PNNL shapefile zones (IECC21+Moisture21) against the county
// table printed in the PNNL-33270 report. Verification only.
// Usage: node scripts/verify-pdf.mjs [root]
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readDbf } from './dbf.mjs';
import { pdfTextStreams } from './pdftext.mjs';

const root = resolve(process.argv[2] ?? join(dirname(fileURLToPath(import.meta.url)), '..'));
const ST = 'AL AK AZ AR CA CO CT DE DC FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY'.split(' ');
const FP = { '01': 'AL', '02': 'AK', '04': 'AZ', '05': 'AR', '06': 'CA', '08': 'CO', '09': 'CT', '10': 'DE', '11': 'DC', '12': 'FL', '13': 'GA', '15': 'HI', '16': 'ID', '17': 'IL', '18': 'IN', '19': 'IA', '20': 'KS', '21': 'KY', '22': 'LA', '23': 'ME', '24': 'MD', '25': 'MA', '26': 'MI', '27': 'MN', '28': 'MS', '29': 'MO', '30': 'MT', '31': 'NE', '32': 'NV', '33': 'NH', '34': 'NJ', '35': 'NM', '36': 'NY', '37': 'NC', '38': 'ND', '39': 'OH', '40': 'OK', '41': 'OR', '42': 'PA', '44': 'RI', '45': 'SC', '46': 'SD', '47': 'TN', '48': 'TX', '49': 'UT', '50': 'VT', '51': 'VA', '53': 'WA', '54': 'WV', '55': 'WI', '56': 'WY' };

const norm = s => s.toLowerCase().replace(/\(ca\)|\(b\)/g, '').replace(/\bsaint\b/g, 'st').replace(/[^a-z]/g, '');

// --- PDF rows ---
const text = pdfTextStreams(join(root, 'raw', 'PNNL-33270.pdf')).map(s => s.text).join('\n').replace(/\s+/g, ' ');
const stAlt = ST.join('|');
const BA = '(?:(?:[Hh]ot|[Mm]ixed|[Cc]old|[Vv]ery|[Ss]ubarctic|[Mm]arine|[Hh]umid|[Dd]ry) ?)+';
const rowRe = new RegExp(`\\b(${stAlt}) ((?:(?!\\b(?:${stAlt}) ).)+?) ${BA}([0-8])(?: ([0-8]))?(?: (A|B|C|NONE)(?: (A|B|C|NONE))?)?(?= |$)`, 'g');
const pdf = new Map();
let m;
while ((m = rowRe.exec(text))) {
  const [, st, name, z1, z2, m1, m2] = m;
  const mo = m2 ?? m1 ?? 'NONE';
  const zone = (z2 ?? z1) + (mo === 'NONE' ? '' : mo);
  const key = `${st}|${norm(name)}`;
  if (pdf.has(key) && pdf.get(key).zone !== zone) console.log('PDF duplicate with different zone:', key, pdf.get(key).zone, zone);
  pdf.set(key, { zone, name });
}

// --- DBF rows ---
const { records } = readDbf(join(root, 'raw', 'pnnl', 'ClimateZones.dbf'));
let matched = 0, agree = 0, moistureMissing = 0;
// Report rows that use pre-2020 names or merged census areas.
const ALIASES = {
  '02158': 'AK|wadehampton', '46102': 'SD|shannon', '02198': 'AK|princeofwalesouterketchikan',
  '02105': 'AK|skagwayhoonahangoon', '02230': 'AK|skagwayhoonahangoon',
  '02195': 'AK|wrangellpetersburg', '02275': 'AK|wrangellpetersburg',
};
const mismatches = [], dbfOnly = [], used = new Set();
for (const r of records) {
  const fips = r.GEOID.slice(1), st = FP[fips.slice(0, 2)];
  if (!st) continue; // Puerto Rico
  const isCity = ['VA', 'MD', 'MO', 'NV'].includes(st) && Number(fips.slice(2)) >= 500;
  const key = `${st}|${norm(r.Country + (isCity ? ' city' : ''))}`;
  const zone = Number.isFinite(r.IECC21) ? `${r.IECC21}${r.Moisture21}` : 'NaN';
  const k = pdf.has(key) ? key : ALIASES[fips];
  const p = k && pdf.get(k);
  if (!p) { dbfOnly.push({ fips, st, name: r.Country, zone, n: norm(r.Country) }); continue; }
  compare(k, p, fips, st, r.Country, zone);
}
// Second pass: the report mislabels some state codes (e.g. Iowa rows printed as "IN").
// Match leftovers by name when exactly one unused report row has that name.
for (const d of dbfOnly.splice(0)) {
  const cands = [...pdf.keys()].filter(k => !used.has(k) && k.split('|')[1] === d.n);
  if (cands.length === 1) compare(cands[0], pdf.get(cands[0]), d.fips, d.st, d.name, d.zone, ' (matched by name; report state label differs)');
  else dbfOnly.push(`${d.fips} ${d.st} ${d.name} ${d.zone}`);
}
function compare(k, p, fips, st, name, zone, note = '') {
  used.add(k); matched++;
  // The report sometimes prints the county name in the moisture column; compare zone digits only then.
  const pz = p.zone, same = pz === zone || (/^\d$/.test(pz) && zone.startsWith(pz) && Number(pz) <= 6);
  if (same) { agree++; if (pz !== zone) moistureMissing++; }
  else mismatches.push(`${fips} ${st} ${name}: dbf=${zone} pdf=${pz}${note}`);
}
const pdfOnly = [...pdf.keys()].filter(k => !used.has(k)).map(k => `${k} ${pdf.get(k).zone}`);
console.log({ pdfRows: pdf.size, dbfRows: records.length, matched, agree, agreeOnZoneDigitOnly: moistureMissing });
console.log('mismatches:', mismatches);
console.log('dbf rows not found in pdf:', dbfOnly);
console.log('pdf rows not matched to dbf:', pdfOnly);
