// Page copy lives in src/content/<market>/<group>.md (frontmatter + Markdown body).
// Rendered to HTML at build time, so content pages ship no runtime JS.
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import type { RouteEntry } from "@/routes/registry";

export interface Faq {
  q: string;
  a: string;
  /** answer rendered to HTML */
  html: string;
}

export interface PageContent {
  /** <title>, ≤ 60 chars */
  title: string;
  /** meta description, ≤ 160 chars */
  description: string;
  h1: string;
  /** short label for nav/footer links */
  nav: string;
  intro?: string;
  faqs: Faq[];
  /** body rendered to HTML */
  html: string;
}

const CONTENT_DIR = path.join(process.cwd(), "src", "content");
const cache = new Map<string, PageContent>();

const processor = unified().use(remarkParse).use(remarkGfm).use(remarkRehype).use(rehypeStringify);

export function markdownToHtml(md: string): string {
  const html = String(processor.processSync(md));
  return html.replace(/<table>/g, '<div class="table-wrap"><table>').replace(/<\/table>/g, "</table></div>");
}

/** Inline Markdown (no wrapping <p>) for short strings such as FAQ answers. */
export function inlineMarkdown(md: string): string {
  return markdownToHtml(md).replace(/^<p>([\s\S]*)<\/p>\s*$/, "$1");
}

export const contentPath = (entry: Pick<RouteEntry, "market" | "group">) =>
  path.join(CONTENT_DIR, entry.market, `${entry.group}.md`);

export function getContent(entry: Pick<RouteEntry, "market" | "group">): PageContent {
  const file = contentPath(entry);
  const hit = cache.get(file);
  if (hit) return hit;
  const raw = fs.readFileSync(file, "utf8");
  const { data, content } = matter(raw);
  const faqs: Faq[] = Array.isArray(data.faqs)
    ? data.faqs.map((f: { q: string; a: string }) => ({ q: String(f.q), a: String(f.a), html: markdownToHtml(String(f.a)) }))
    : [];
  const page: PageContent = {
    title: String(data.title ?? ""),
    description: String(data.description ?? ""),
    h1: String(data.h1 ?? data.title ?? ""),
    nav: String(data.nav ?? data.h1 ?? data.title ?? ""),
    intro: data.intro ? String(data.intro) : undefined,
    faqs,
    html: markdownToHtml(content),
  };
  cache.set(file, page);
  return page;
}
