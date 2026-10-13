// Minimal ZIP reader (stored + deflate only), used to pull named files out of
// a downloaded archive without shelling out. Only the requested entry names
// are extracted, and only by basename, so archive paths cannot escape outDir.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { inflateRawSync } from 'node:zlib';
import { join, basename } from 'node:path';

export function listZip(buf) {
  let eocd = -1;
  for (let i = buf.length - 22; i >= Math.max(0, buf.length - 65557); i--) {
    if (buf.readUInt32LE(i) === 0x06054b50) { eocd = i; break; }
  }
  if (eocd < 0) throw new Error('not a zip: no end-of-central-directory record');
  const count = buf.readUInt16LE(eocd + 10);
  let p = buf.readUInt32LE(eocd + 16);
  const entries = [];
  for (let n = 0; n < count; n++) {
    if (buf.readUInt32LE(p) !== 0x02014b50) throw new Error('bad central directory');
    const method = buf.readUInt16LE(p + 10);
    const csize = buf.readUInt32LE(p + 20);
    const usize = buf.readUInt32LE(p + 24);
    const nlen = buf.readUInt16LE(p + 28), xlen = buf.readUInt16LE(p + 30), clen = buf.readUInt16LE(p + 32);
    const local = buf.readUInt32LE(p + 42);
    const name = buf.subarray(p + 46, p + 46 + nlen).toString('utf8');
    entries.push({ name, method, csize, usize, local });
    p += 46 + nlen + xlen + clen;
  }
  return entries;
}

export function extract(buf, entry) {
  const p = entry.local;
  if (buf.readUInt32LE(p) !== 0x04034b50) throw new Error('bad local header');
  const start = p + 30 + buf.readUInt16LE(p + 26) + buf.readUInt16LE(p + 28);
  const data = buf.subarray(start, start + entry.csize);
  const out = entry.method === 0 ? Buffer.from(data)
    : entry.method === 8 ? inflateRawSync(data)
    : (() => { throw new Error(`unsupported zip method ${entry.method}`); })();
  if (out.length !== entry.usize) throw new Error(`size mismatch for ${entry.name}`);
  return out;
}

export function unzipFiles(zipPath, outDir, wanted) {
  const buf = readFileSync(zipPath);
  const entries = listZip(buf);
  mkdirSync(outDir, { recursive: true });
  const written = [];
  for (const w of wanted) {
    const e = entries.find(x => basename(x.name) === w);
    if (!e) throw new Error(`${w} not found in ${zipPath}`);
    const dest = join(outDir, basename(e.name));
    writeFileSync(dest, extract(buf, e));
    written.push(dest);
  }
  return written;
}
