// Grep the text of a PDF (verification helper).
// Usage: node pdf-grep.mjs <file.pdf> <regex> [contextChars]
import { pdfTextStreams } from './pdftext.mjs';

const [, , file, pattern, ctxArg = '300'] = process.argv;
const re = new RegExp(pattern, 'i');
const ctx = Number(ctxArg);
for (const { streamNo, text } of pdfTextStreams(file)) {
  const m = re.exec(text);
  if (m) {
    console.log(`--- stream ${streamNo} ---`);
    console.log(text.slice(Math.max(0, m.index - ctx), m.index + ctx));
  }
}
