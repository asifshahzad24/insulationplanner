// Builds the ZIP (ZCTA) -> 2021 IECC climate zone dataset.
// Usage: node scripts/build.mjs [root]   (root defaults to the parent of scripts/)
// Inputs  (from scripts/fetch.mjs): raw/pnnl/ClimateZones.dbf,
//          raw/tab20_zcta520_county20_natl.txt, raw/national_county2020.txt
// Outputs: out/zip3/<zip3>.json, out/counties.json, out/states.json, out/README.md
// Deterministic: same inputs -> byte-identical outputs (sorted keys, no timestamps).
import { readFileSync, writeFileSync, mkdirSync, rmSync, readdirSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { gzipSync } from 'node:zlib';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readDbf } from './dbf.mjs';

const root = resolve(process.argv[2] ?? join(dirname(fileURLToPath(import.meta.url)), '..'));
const RAW = join(root, 'raw');
const OUT = join(root, 'out');

const STATE_NAMES = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California', CO: 'Colorado',
  CT: 'Connecticut', DE: 'Delaware', DC: 'District of Columbia', FL: 'Florida', GA: 'Georgia',
  HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois', IN: 'Indiana', IA: 'Iowa', KS: 'Kansas', KY: 'Kentucky',
  LA: 'Louisiana', ME: 'Maine', MD: 'Maryland', MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota',
  MS: 'Mississippi', MO: 'Missouri', MT: 'Montana', NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire',
  NJ: 'New Jersey', NM: 'New Mexico', NY: 'New York', NC: 'North Carolina', ND: 'North Dakota',
  OH: 'Ohio', OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania', RI: 'Rhode Island',
  SC: 'South Carolina', SD: 'South Dakota', TN: 'Tennessee', TX: 'Texas', UT: 'Utah', VT: 'Vermont',
  VA: 'Virginia', WA: 'Washington', WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming',
  PR: 'Puerto Rico',
};

// Corrections to the PNNL shapefile, each backed by the PNNL-33270 report table
// (pp. 14-15 for Alaska, Virginia section for Bristol) or by a Census FIPS change.
const OVERRIDES = {
  '02158': { zone: '8', why: 'Kusilvak Census Area (formerly Wade Hampton, FIPS 02270): zone is NaN in the shapefile; PNNL-33270 table lists "Wade Hampton (CA) ... 8" (unchanged in 2021).' },
  '51520': { zone: '4A', why: 'Bristol city, VA: shapefile has zone 4 with a blank moisture regime; PNNL-33270 table lists "Bristol (city) ... 4 A".' },
  '34021': { zone: '4A', why: 'Mercer County, NJ: shapefile IECC21 = 5A (unchanged from pre-2021); the PNNL-33270 table explicitly marks a 2021 change "Cold -> Mixed-Humid, 5 -> 4, A". The report (Sept 2022) is newer than the shapefile (Aug 2022).' },
  '20101': { zone: '4A', why: 'Lane County, KS: shapefile IECC21 = 5A (unchanged from pre-2021); the PNNL-33270 table explicitly marks a 2021 change "Cold -> Mixed-Humid, 5 -> 4, A" (neighbors Ness and Trego also moved 5A -> 4A).' },
};
// 2020 Census counties that the PNNL file still carries under a predecessor FIPS.
const SUCCESSORS = {
  '02063': { from: '02261', why: 'Chugach Census Area, split from Valdez-Cordova (02261) in 2019; inherits Valdez-Cordova zone.' },
  '02066': { from: '02261', why: 'Copper River Census Area, split from Valdez-Cordova (02261) in 2019; inherits Valdez-Cordova zone.' },
};

const ZONE_RE = /^(?:[0-6][ABC]|[78])$/;

const sha256 = f => createHash('sha256').update(readFileSync(f)).digest('hex');
const readPipe = f => {
  const lines = readFileSync(f, 'utf8').replace(/^﻿/, '').split(/\r?\n/).filter(Boolean);
  const head = lines[0].split('|');
  return lines.slice(1).map(l => {
    const v = l.split('|');
    return Object.fromEntries(head.map((h, i) => [h, v[i] ?? '']));
  });
};
const byKey = obj => Object.fromEntries(Object.keys(obj).sort().map(k => [k, obj[k]]));

// ---------- 1. PNNL county -> 2021 IECC zone ----------
const dbfPath = join(RAW, 'pnnl', 'ClimateZones.dbf');
const { records: pnnlRows } = readDbf(dbfPath);
const pnnl = new Map();      // fips5 -> zone string or null
const pnnlName = new Map();
const pnnlProblems = [];
for (const r of pnnlRows) {
  const fips = r.GEOID.replace(/^G/, '');
  if (!/^\d{5}$/.test(fips)) throw new Error(`unexpected GEOID ${r.GEOID}`);
  if (pnnl.has(fips)) throw new Error(`duplicate GEOID ${fips}`);
  const n = r.IECC21;
  const zone = Number.isFinite(n) ? `${n}${r.Moisture21 ?? ''}` : null;
  pnnl.set(fips, zone && ZONE_RE.test(zone) ? zone : null);
  pnnlName.set(fips, r.Country);
  if (!zone || !ZONE_RE.test(zone)) pnnlProblems.push({ fips, name: r.Country, raw: `${r.IECC21}|${r.Moisture21}` });
}

// ---------- 2. Census 2020 counties ----------
const countyRows = readPipe(join(RAW, 'national_county2020.txt'));
const stateByFp = {};
const counties = {};           // fips5 -> {name,state,zone}
const zoneSource = {};         // fips5 -> 'pnnl' | 'override' | 'successor'
const noZone = [];             // census counties with no zone (Puerto Rico)
for (const c of countyRows) {
  if (!STATE_NAMES[c.STATE]) continue; // island areas (AS, GU, MP, UM, VI): not in the IECC/PNNL table
  stateByFp[c.STATEFP] = c.STATE;
  const fips = c.STATEFP + c.COUNTYFP;
  let zone = pnnl.get(fips) ?? null, src = 'pnnl';
  if (OVERRIDES[fips]) { zone = OVERRIDES[fips].zone; src = 'override'; }
  else if (!zone && SUCCESSORS[fips]) { zone = pnnl.get(SUCCESSORS[fips].from); src = 'successor'; }
  if (!zone) { noZone.push({ fips, name: c.COUNTYNAME, state: c.STATE }); continue; }
  if (!ZONE_RE.test(zone)) throw new Error(`bad zone ${zone} for ${fips}`);
  counties[fips] = { name: c.COUNTYNAME, state: c.STATE, zone };
  zoneSource[fips] = src;
}
const censusFips = new Set(countyRows.map(c => c.STATEFP + c.COUNTYFP));
const pnnlUnmatched = [...pnnl.keys()].filter(f => !censusFips.has(f)).sort();
const nonPrNoZone = noZone.filter(c => c.state !== 'PR');
if (nonPrNoZone.length) throw new Error(`counties without zone: ${JSON.stringify(nonPrNoZone)}`);

// ---------- 3. ZCTA -> dominant county (largest land overlap) ----------
const rel = readPipe(join(RAW, 'tab20_zcta520_county20_natl.txt'));
const zctaParts = new Map(); // zcta -> [{fips, land, water}]
let relRows = 0;
for (const r of rel) {
  const z = r.GEOID_ZCTA5_20;
  if (!z) continue; // county area not covered by any ZCTA
  if (!/^\d{5}$/.test(z) || !/^\d{5}$/.test(r.GEOID_COUNTY_20)) throw new Error(`bad row ${JSON.stringify(r)}`);
  relRows++;
  if (!zctaParts.has(z)) zctaParts.set(z, []);
  zctaParts.get(z).push({ fips: r.GEOID_COUNTY_20, land: Number(r.AREALAND_PART), water: Number(r.AREAWATER_PART) });
}
const cmp = (a, b) => b.land - a.land || b.water - a.water || (a.fips < b.fips ? -1 : 1);

const zip = {};              // zcta -> zone
const zctaNoZone = [];       // zctas whose dominant county has no zone
let multiCounty = 0, zoneSplit = 0, zoneSplitMajor = 0;
const splitExamples = [];
for (const z of [...zctaParts.keys()].sort()) {
  const parts = zctaParts.get(z).slice().sort(cmp);
  const top = parts[0];
  if (parts.length > 1) multiCounty++;
  const zone = counties[top.fips]?.zone;
  if (!zone) { zctaNoZone.push({ zcta: z, county: top.fips }); continue; }
  zip[z] = zone;
  // ZCTAs whose land spans counties in different zones
  const totalLand = parts.reduce((s, p) => s + p.land, 0);
  const otherLand = parts.filter(p => counties[p.fips] && counties[p.fips].zone !== zone).reduce((s, p) => s + p.land, 0);
  if (otherLand > 0) {
    zoneSplit++;
    const share = totalLand ? otherLand / totalLand : 0;
    if (share >= 0.25) {
      zoneSplitMajor++;
      if (splitExamples.length < 5) splitExamples.push(`${z}: ${zone} (${counties[top.fips].name}, ${counties[top.fips].state}); ${(share * 100).toFixed(0)}% of land in other-zone counties`);
    }
  }
}

// ---------- 4. Write outputs ----------
rmSync(OUT, { recursive: true, force: true });
mkdirSync(join(OUT, 'zip3'), { recursive: true });
const byZip3 = {};
for (const [z, zone] of Object.entries(zip)) (byZip3[z.slice(0, 3)] ??= {})[z] = zone;
for (const [p, obj] of Object.entries(byZip3)) writeFileSync(join(OUT, 'zip3', `${p}.json`), JSON.stringify(byKey(obj)));

writeFileSync(join(OUT, 'counties.json'), JSON.stringify(byKey(counties)));

const stateZones = {};
for (const c of Object.values(counties)) {
  const m = (stateZones[c.state] ??= {});
  m[c.zone] = (m[c.zone] ?? 0) + 1;
}
const states = {};
for (const st of Object.keys(stateZones).sort()) {
  const zones = Object.entries(stateZones[st]).sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1)).map(e => e[0]);
  states[st] = { name: STATE_NAMES[st], zones };
}
writeFileSync(join(OUT, 'states.json'), JSON.stringify(states));

// ---------- 5. Stats + spot checks ----------
const zip3Files = readdirSync(join(OUT, 'zip3')).sort();
const zip3Sizes = zip3Files.map(f => statSync(join(OUT, 'zip3', f)).size);
const zip3Gz = zip3Files.map(f => gzipSync(readFileSync(join(OUT, 'zip3', f)), { level: 9 }).length);
const sum = a => a.reduce((s, x) => s + x, 0);
const fileInfo = f => { const b = readFileSync(join(OUT, f)); return { raw: b.length, gz: gzipSync(b, { level: 9 }).length }; };
const kb = n => `${(n / 1024).toFixed(1)} KB`;

const zoneZips = {};
for (const zone of Object.values(zip)) zoneZips[zone] = (zoneZips[zone] ?? 0) + 1;
const zoneCounties = {};
for (const c of Object.values(counties)) zoneCounties[c.zone] = (zoneCounties[c.zone] ?? 0) + 1;
const zoneOrder = Object.keys(zoneCounties).sort((a, b) => parseInt(a) - parseInt(b) || (a < b ? -1 : 1));

const SPOT = [
  ['60601', 'Chicago, IL', '5A'], ['10001', 'New York, NY', '4A'], ['33101', 'Miami, FL', '1A'],
  ['33130', 'Miami, FL (residential, near 33101)', '1A'], ['85001', 'Phoenix, AZ', '2B'],
  ['85004', 'Phoenix, AZ (downtown, near 85001)', '2B'], ['99501', 'Anchorage, AK', '7'],
  ['98101', 'Seattle, WA', '4C'], ['80202', 'Denver, CO', '5B'], ['55401', 'Minneapolis, MN', '6A'],
];
const spot = SPOT.map(([z, place, expect]) => {
  const parts = zctaParts.get(z);
  const got = zip[z] ?? null;
  const county = parts ? counties[parts.slice().sort(cmp)[0].fips] : null;
  return { z, place, expect, got, county: county ? `${county.name}, ${county.state}` : '-', ok: got === expect };
});

const srcFiles = ['ClimateZoneDataFiles.zip', 'pnnl/ClimateZones.dbf', 'PNNL-33270.pdf', 'tab20_zcta520_county20_natl.txt', 'national_county2020.txt'];
const hashes = srcFiles.map(f => { try { return [f, sha256(join(RAW, f))]; } catch { return [f, '(missing)']; } });
const cj = fileInfo('counties.json'), sj = fileInfo('states.json');
// Territories are outside the IECC county table / PNNL data; anything else missing is a bug.
const TERRITORIES = { 72: 'Puerto Rico', 78: 'US Virgin Islands', 66: 'Guam', 60: 'American Samoa', 69: 'Northern Mariana Islands' };
const strayNoZone = zctaNoZone.filter(x => !TERRITORIES[x.county.slice(0, 2)]);
if (strayNoZone.length) throw new Error(`non-territory ZCTAs without zone: ${JSON.stringify(strayNoZone)}`);
const terrCounts = {};
for (const x of zctaNoZone) { const t = TERRITORIES[x.county.slice(0, 2)]; terrCounts[t] = (terrCounts[t] ?? 0) + 1; }
const terrList = Object.entries(terrCounts).sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1)).map(([t, n]) => `${t} ${n}`).join(', ');
const changed = pnnlRows.filter(r => Number.isFinite(r.IECC21) && (r.IECC15 !== r.IECC21 || r.Moisture15 !== r.Moisture21)).length;

const readme = `# US ZIP (ZCTA) to 2021 IECC climate zone

Generated by \`scripts/build.mjs\` from the inputs fetched by \`scripts/fetch.mjs\`. Re-running both scripts reproduces these files byte for byte (no timestamps; all keys sorted). The scripts need Node.js 18 or later and have no dependencies:

\`\`\`
node scripts/fetch.mjs       # download sources into raw/ (data only, never executed)
node scripts/build.mjs       # write out/
node scripts/verify-pdf.mjs  # optional: cross-check the shapefile against the PNNL report table
node scripts/spotcheck.mjs   # look up the test ZIPs the way the website will; checks file integrity
\`\`\`

## Files

| File | Shape | Size | Gzipped |
|---|---|---|---|
| \`zip3/<zip3>.json\` (${zip3Files.length} files) | \`{"60601":"5A", ...}\` | ${kb(sum(zip3Sizes))} total; ${zip3Sizes.length ? `${Math.min(...zip3Sizes)} B to ${kb(Math.max(...zip3Sizes))}, mean ${(sum(zip3Sizes) / zip3Sizes.length).toFixed(0)} B` : '-'} | ${kb(sum(zip3Gz))} total; largest ${kb(Math.max(...zip3Gz))} |
| \`counties.json\` | \`{"17031":{"name":"Cook County","state":"IL","zone":"5A"}, ...}\` | ${kb(cj.raw)} | ${kb(cj.gz)} |
| \`states.json\` | \`{"IL":{"name":"Illinois","zones":["5A","4A"]}, ...}\` | ${kb(sj.raw)} | ${kb(sj.gz)} |

Zone strings are \`<number><moisture>\`: \`1A\`-\`6C\`, with no letter for zones \`7\` and \`8\` (the IECC assigns no moisture regime there). No county in this dataset is in zone 0. In \`states.json\`, zones are ordered by how many of that state's counties use them (ties broken alphabetically).

Lookup for a ZIP: fetch \`zip3/<first 3 digits>.json\` and read the 5-digit key. A missing file or missing key means the ZIP is not a 2020 ZCTA (PO-box-only and single-business ZIPs usually are not) or is in a US territory; see Caveats.

## Coverage

- ZCTAs in the Census 2020 relationship file: **${zctaParts.size.toLocaleString('en-US')}**
- ZCTAs with a zone (written to \`zip3/\`): **${Object.keys(zip).length.toLocaleString('en-US')}** (50 states + DC)
- ZCTAs without a zone: **${zctaNoZone.length}**, all in US territories (${terrList})
- Counties and county-equivalents with a zone (\`counties.json\`): **${Object.keys(counties).length.toLocaleString('en-US')}** (50 states + DC, 2020 Census FIPS codes)
- States in \`states.json\`: **${Object.keys(states).length}** (50 + DC)
- ZCTAs that span more than one county: ${multiCounty.toLocaleString('en-US')}. Of these, ${zoneSplit.toLocaleString('en-US')} touch a county in a different zone, and ${zoneSplitMajor} have at least 25% of their land in a different-zone county.

| Zone | Counties | ZCTAs |
|---|---|---|
${zoneOrder.map(z => `| ${z} | ${zoneCounties[z]} | ${(zoneZips[z] ?? 0).toLocaleString('en-US')} |`).join('\n')}

## Sources

1. **County to 2021 IECC climate zone.** Pacific Northwest National Laboratory (PNNL) for the US DOE Building America program: *Guide to Determining Climate Zone by County: Building America and IECC 2021 Updates*, PNNL-33270, September 2022 (Antonopoulos, Gilbride, Margiotta, Cragin, Kaltreider). The data comes from its companion GIS file, \`ClimateZones.dbf\` inside https://basc.pnnl.gov/sites/default/files/ClimateZoneDataFiles.zip, using fields \`IECC21\` and \`Moisture21\`. The report PDF (https://www.pnnl.gov/main/publications/external/technical_reports/PNNL-33270.pdf) was used to correct gaps in the shapefile. These are the climate zones of the 2021 IECC, Table R301.1 / C301.1, which is based on ASHRAE 169-2013. The 2024 IECC kept the same map. The file also carries the pre-2021 assignments (\`IECC15\`). ${changed} of its counties changed zone in 2021, and this dataset uses the 2021 assignments.
2. **ZCTA to county.** US Census Bureau, 2020 ZCTA to 2020 County Relationship File: https://www2.census.gov/geo/docs/maps-data/data/rel2020/zcta520/tab20_zcta520_county20_natl.txt
3. **County names and FIPS codes.** US Census Bureau, 2020 FIPS codes: https://www2.census.gov/geo/docs/reference/codes2020/national_county2020.txt

Source file SHA-256 hashes at build time:

${hashes.map(([f, h]) => `- \`raw/${f}\`: \`${h}\``).join('\n')}

## Licensing

- **Census files:** works of the US federal government, in the public domain (17 U.S.C. 105).
- **PNNL data and report:** produced by PNNL (operated by Battelle for the US DOE) and published for free public download. The PNNL page states no explicit license. County climate-zone assignments are factual data. Please attribute: *Antonopoulos, C., et al. 2022. Guide to Determining Climate Zone by County: Building America and IECC 2021 Updates. PNNL-33270. Richland, WA: Pacific Northwest National Laboratory.*
- The IECC itself is copyrighted by the International Code Council. This dataset reproduces only the county-to-zone facts, not code text.

## Method

1. Read \`ClimateZones.dbf\` (${pnnlRows.length} rows, keyed by \`G\` + 5-digit county FIPS). Zone = \`IECC21\` + \`Moisture21\`. Every value is checked against \`^([0-6][ABC]|[78])$\`.
2. Apply corrections backed by the report table or a Census FIPS change:
${Object.entries(OVERRIDES).map(([f, o]) => `   - \`${f}\` set to \`${o.zone}\`. ${o.why}`).join('\n')}
${Object.entries(SUCCESSORS).map(([f, o]) => `   - \`${f}\` set to \`${pnnl.get(o.from)}\`. ${o.why}`).join('\n')}
   These corrections come from \`scripts/verify-pdf.mjs\`, which parses the county table in the PNNL-33270 PDF and compares it with the shapefile. It matched 3,131 of the 3,142 shapefile rows for the 50 states and DC. 3,127 agree, and the 4 disagreements are the first four corrections above. The 11 unmatched rows are text-extraction artifacts at page breaks.
3. Join to the 2020 Census county list by FIPS code. Names (for example "Cook County", "Bristol city", "Anchorage Municipality") come from Census. The build fails if any county in the 50 states or DC lacks a zone. PNNL rows with no 2020 Census county (unused): ${pnnlUnmatched.map(f => `\`${f}\` ${pnnlName.get(f)}`).join(', ') || 'none'}.
4. For each ZCTA in the relationship file (rows with a blank ZCTA are skipped; ${relRows.toLocaleString('en-US')} ZCTA-county rows), pick the county with the largest \`AREALAND_PART\`. Ties go to the larger \`AREAWATER_PART\`, then the lower FIPS. The ZCTA gets that county's zone.
5. Group by the first 3 digits and write compact JSON with sorted keys.

## Spot checks

| ZIP | Place | Expected | Got | Dominant county | |
|---|---|---|---|---|---|
${spot.map(s => `| ${s.z} | ${s.place} | ${s.expect} | ${s.got ?? '(not a ZCTA)'} | ${s.county} | ${s.ok ? 'OK' : s.got ? 'MISMATCH' : 'n/a'} |`).join('\n')}

## Caveats

- **ZCTAs are not ZIP codes.** ZCTAs approximate the areas of residential and delivery ZIP codes. Many PO-box-only and single-organization ZIPs have no ZCTA, so they are absent here. Among the spot checks: ${spot.filter(s => !s.got).map(s => s.z).join(', ') || 'none'} ${spot.filter(s => !s.got).length === 1 ? 'is' : 'are'} not a 2020 ZCTA.${zip['33101'] ? ' 33101 (a Miami PO-box ZIP) does exist as a 2020 ZCTA.' : ''} A UI should say "ZIP not found, try a nearby residential ZIP" or ask for the county.
- **County granularity.** The IECC assigns zones by county, and a ZCTA takes the zone of the county containing most of its land. ${zoneSplitMajor} ZCTAs have 25% or more of their land in a county with a different zone. Examples: ${splitExamples.join('; ') || 'none'}. The zone that legally applies can also differ where a state or city has amended its code; Ketchikan, AK is one example.
- **US territories.** The PNNL data covers only the 50 states and DC. Its Puerto Rico rows have no zone, and it has no rows for the other territories. The ${zctaNoZone.length} territory ZCTAs (${terrList}) are therefore left out rather than guessed. The IECC table may list territories, but it could not be checked because it is paywalled.
- **Mercer County, NJ and Lane County, KS.** PNNL's own files disagree on these two counties: the shapefile says 5A and the report table says 4A. This build follows the report, which explicitly marks the 2021 change. The ICC code text could not be checked directly because it is paywalled. Together they cover ${Object.entries(zip).filter(([z]) => ['34021', '20101'].includes(zctaParts.get(z).slice().sort(cmp)[0].fips)).length} ZCTAs. To revert, delete those two entries from \`OVERRIDES\` in \`scripts/build.mjs\`.
- **Snapshot dates.** County FIPS codes are 2020 Census codes. Connecticut is still the 8 historical counties, which matches PNNL. The 2022 Connecticut planning regions are not used.
`;
writeFileSync(join(OUT, 'README.md'), readme);

console.log(JSON.stringify({
  zctas: zctaParts.size, zctasWithZone: Object.keys(zip).length, zctasNoZone: zctaNoZone.length,
  counties: Object.keys(counties).length, states: Object.keys(states).length, zip3Files: zip3Files.length,
  zip3Bytes: sum(zip3Sizes), zip3Gz: sum(zip3Gz), counties_json: cj, states_json: sj,
  pnnlProblems: { puertoRico: pnnlProblems.filter(p => p.fips.startsWith('72')).length, other: pnnlProblems.filter(p => !p.fips.startsWith('72')) },
  pnnlUnmatched, territoryZctas: terrCounts, noZoneCounties: noZone.length, multiCounty, zoneSplit, zoneSplitMajor,
  zoneSource: Object.values(zoneSource).reduce((m, s) => (m[s] = (m[s] ?? 0) + 1, m), {}),
}, null, 1));
console.table(spot);
