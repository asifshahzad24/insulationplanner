// Downloads the raw source files into <root>/raw and extracts the PNNL DBF.
// Usage: node scripts/fetch.mjs [root]   (root defaults to the parent of scripts/)
// Downloaded files are treated as data only; nothing in raw/ is ever executed.
import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { unzipFiles } from './unzip.mjs';

const root = resolve(process.argv[2] ?? join(dirname(fileURLToPath(import.meta.url)), '..'));
const raw = join(root, 'raw');
mkdirSync(raw, { recursive: true });

export const SOURCES = [
  {
    file: 'ClimateZoneDataFiles.zip',
    url: 'https://basc.pnnl.gov/sites/default/files/ClimateZoneDataFiles.zip',
    what: 'PNNL county climate-zone shapefile (2021 IECC + pre-2021), PNNL-33270 data files',
  },
  {
    file: 'PNNL-33270.pdf',
    url: 'https://www.pnnl.gov/main/publications/external/technical_reports/PNNL-33270.pdf',
    what: 'PNNL-33270 report (county tables; used to fill gaps in the shapefile and for verification)',
  },
  {
    file: 'tab20_zcta520_county20_natl.txt',
    url: 'https://www2.census.gov/geo/docs/maps-data/data/rel2020/zcta520/tab20_zcta520_county20_natl.txt',
    what: 'Census 2020 ZCTA-to-county relationship file',
  },
  {
    file: 'national_county2020.txt',
    url: 'https://www2.census.gov/geo/docs/reference/codes2020/national_county2020.txt',
    what: 'Census 2020 county FIPS codes and names',
  },
];

// basc.pnnl.gov rejects requests without a browser-like User-Agent.
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';

for (const s of SOURCES) {
  const res = await fetch(s.url, { headers: { 'User-Agent': UA, Accept: '*/*' } });
  if (!res.ok) throw new Error(`${s.url}: HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  writeFileSync(join(raw, s.file), buf);
  console.log(`${s.file}  ${buf.length} bytes  sha256=${createHash('sha256').update(buf).digest('hex')}`);
}

const out = unzipFiles(join(raw, 'ClimateZoneDataFiles.zip'), join(raw, 'pnnl'), ['ClimateZones.dbf', 'ClimateZones.cpg']);
for (const f of out) console.log('extracted', f, readFileSync(f).length, 'bytes');
