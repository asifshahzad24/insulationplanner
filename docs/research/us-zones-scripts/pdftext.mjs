// Crude PDF text extraction (verification only, not part of the build).
// Inflates FlateDecode streams and pulls literal strings from Tj/TJ operators.
// The PDF is read purely as bytes; nothing in it is executed.
import { readFileSync } from 'node:fs';
import { inflateSync } from 'node:zlib';

function decodeLiteral(str) {
  return str.replace(/\\([nrtbf()\\]|[0-7]{1,3})/g, (m, g) => {
    if (/^[0-7]+$/.test(g)) return String.fromCharCode(parseInt(g, 8));
    return { n: '\n', r: '\r', t: '\t', b: '\b', f: '\f', '(': '(', ')': ')', '\\': '\\' }[g];
  });
}

function textOf(content) {
  const out = [];
  const tok = /\((?:\\.|[^\\)])*\)|\bT[dD*m]\b|\bET\b/g;
  let m;
  while ((m = tok.exec(content))) {
    const t = m[0];
    if (t[0] === '(') out.push(decodeLiteral(t.slice(1, -1)));
    else out.push(t === 'ET' ? '\n' : ' ');
  }
  return out.join('');
}

// Returns [{streamNo, text}] for every content stream containing text.
export function pdfTextStreams(file) {
  const buf = readFileSync(file);
  const s = buf.toString('latin1');
  const res = [];
  let idx = 0, streamNo = 0;
  while ((idx = s.indexOf('stream', idx)) !== -1) {
    const dict = s.slice(s.lastIndexOf('obj', idx), idx);
    let start = idx + 6;
    if (s[start] === '\r') start++;
    if (s[start] === '\n') start++;
    const end = s.indexOf('endstream', start);
    if (end === -1) break;
    idx = end + 9;
    streamNo++;
    if (!/FlateDecode/.test(dict)) continue;
    let data;
    try { data = inflateSync(buf.subarray(start, end)).toString('latin1'); } catch { continue; }
    if (!/\bBT\b/.test(data)) continue;
    res.push({ streamNo, text: textOf(data) });
  }
  return res;
}
