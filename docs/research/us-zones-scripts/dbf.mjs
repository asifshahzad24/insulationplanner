// Minimal dBASE III (.dbf) reader. Reads the attribute table of a shapefile
// as plain data; it never interprets the file as code.
import { readFileSync } from 'node:fs';

export function readDbf(path, encoding = 'utf-8') {
  const buf = readFileSync(path);
  const numRecords = buf.readUInt32LE(4);
  const headerLen = buf.readUInt16LE(8);
  const recordLen = buf.readUInt16LE(10);
  const fields = [];
  for (let off = 32; off < headerLen - 1 && buf[off] !== 0x0d; off += 32) {
    const rawName = buf.subarray(off, off + 11);
    const nul = rawName.indexOf(0);
    fields.push({
      name: rawName.subarray(0, nul === -1 ? 11 : nul).toString('ascii'),
      type: String.fromCharCode(buf[off + 11]),
      length: buf[off + 16],
      decimals: buf[off + 17],
    });
  }
  const dec = new TextDecoder(encoding);
  const records = [];
  for (let i = 0; i < numRecords; i++) {
    const start = headerLen + i * recordLen;
    if (start + recordLen > buf.length) throw new Error(`truncated DBF at record ${i}`);
    if (buf[start] === 0x2a) continue; // deleted record flag '*'
    let pos = start + 1;
    const rec = {};
    for (const f of fields) {
      const raw = dec.decode(buf.subarray(pos, pos + f.length)).trim();
      pos += f.length;
      rec[f.name] = (f.type === 'N' || f.type === 'F') ? (raw === '' ? null : Number(raw)) : raw;
    }
    records.push(rec);
  }
  return { fields, records, numRecords };
}

// CLI: node dbf.mjs <file.dbf> [n]  -> prints field list and first n records
if (process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/').split('/').pop())) {
  const [, , file, n = '5'] = process.argv;
  const { fields, records, numRecords } = readDbf(file);
  console.log('records:', numRecords);
  console.log('fields:', fields.map(f => `${f.name}:${f.type}${f.length}`).join(', '));
  for (const r of records.slice(0, Number(n))) console.log(JSON.stringify(r));
}
