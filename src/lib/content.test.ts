import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { ROUTES, pathOf } from "@/routes/registry";
import { contentPath, getContent } from "./content";

describe("page content", () => {
  it("exists for every route", () => {
    const missing = ROUTES.filter((e) => !fs.existsSync(contentPath(e))).map(pathOf);
    expect(missing).toEqual([]);
  });

  for (const entry of ROUTES) {
    if (!fs.existsSync(contentPath(entry))) continue;
    it(`has valid SEO frontmatter: ${pathOf(entry)}`, () => {
      const c = getContent(entry);
      expect(c.title.length, "title").toBeGreaterThan(10);
      expect(c.title.length, `title too long: "${c.title}"`).toBeLessThanOrEqual(65);
      expect(c.description.length, "description").toBeGreaterThanOrEqual(100);
      expect(c.description.length, `description too long: "${c.description}"`).toBeLessThanOrEqual(165);
      expect(c.h1.length).toBeGreaterThan(3);
      expect(c.nav.length).toBeGreaterThan(1);
      expect(c.html.length).toBeGreaterThan(200);
      expect(c.html).not.toMatch(/<h1/);
      for (const f of c.faqs) {
        expect(f.q.length).toBeGreaterThan(5);
        expect(f.a.length).toBeGreaterThan(10);
      }
      if (entry.kind !== "article" && entry.group !== "home") expect(c.faqs.length).toBeGreaterThanOrEqual(3);
    });
  }

  it("uses unique titles and descriptions", () => {
    const present = ROUTES.filter((e) => fs.existsSync(contentPath(e))).map(getContent);
    const titles = present.map((c) => c.title);
    const descriptions = present.map((c) => c.description);
    expect(new Set(titles).size).toBe(titles.length);
    expect(new Set(descriptions).size).toBe(descriptions.length);
  });
});
