# Insulation Planner

A free, independent insulation calculator for homeowners in the **US, UK, Germany and France**. It tells you how much insulation to add, how many bags, rolls or boards to buy, and what it will cost.

- **Live domain:** https://loftinsulationcalc.com (see [DEPLOY.md](DEPLOY.md))
- **Design spec:** [docs/superpowers/specs/2026-10-14-insulation-planner-design.md](docs/superpowers/specs/2026-10-14-insulation-planner-design.md)

## Stack

- Next.js 16 (App Router), static export (`out/`), so there is no server
- TypeScript, Tailwind CSS 4, Vitest
- Content in Markdown, rendered at build time
- Hosted on Cloudflare Pages

## Commands

```bash
npm install
npm run dev          # http://localhost:3000
npm run check        # lint + typecheck + unit tests
npm run build        # static site in out/
npm start            # serve out/ locally
npm run calc -- --market us --list                        # ids for a market
npm run calc -- --market us --area attic --size 1200 --zone 5A --product cellulose
```

## How it is organised

| Path | What it is |
|---|---|
| `src/engine/` | The calculation engine: pure TypeScript, SI units, fully unit-tested |
| `src/markets/<id>/index.ts` | Per-country data: targets, products, coverage, prices, sources |
| `src/routes/registry.ts` | Every page on the site: URL, market, kind, cross-language group |
| `src/content/<market>/<group>.md` | Page copy: frontmatter (title, description, h1, nav, intro, faqs) + Markdown body |
| `src/i18n/` | Interface text per locale (`en-US` defines the shape; others must match) |
| `src/components/calculator/` | The calculator (the only client-side JavaScript) |
| `src/components/site/` | Header, footer, page template, tables |
| `src/app/(us)`, `src/app/uk`, `src/app/de`, `src/app/fr` | One root layout per market, so `<html lang>` is correct |
| `public/data/zip/` | US ZIP → IECC climate zone lookup (PNNL-33270 + Census 2020 ZCTA) |

### The method in one paragraph

All maths is in SI units (1 US R = 0.1761 m²K/W).
- **US and France:** targets are the R of the insulation itself.
- **UK and Germany:** targets are maximum U-values for the whole element. The engine subtracts the surface resistances and the rest of the build-up, then accounts for timber joists, studs and rafters with the parallel-path method.
- **Batts, rolls and boards:** the engine picks the fewest layers, then the thinnest stack that reaches the target.
- **Loose-fill:** it uses the manufacturer's coverage chart, interpolated, with density × depth ÷ bag weight outside the chart.

The full explanation is on each market's Methodology page.

## Adding a page

1. Add an entry to `src/routes/registry.ts`. Give it a `group` and reuse an existing group when the page has equivalents in other markets, so hreflang links them.
2. Create `src/content/<market>/<group>.md`.
3. Run `npm run check && npm run build`.

## Owner checklist before launch

- [ ] Domain is set in `src/config/site.ts` (`loftinsulationcalc.com`)
- [ ] Contact email exists (Cloudflare Email Routing) or `site.email` is changed
- [ ] **Impressum (DE) and mentions légales (FR):** fill `site.owner` (name and postal address). German and French law require this for sites aimed at those countries.
- [ ] Cloudflare Web Analytics token in `site.analyticsToken`
- [ ] Search Console verified and sitemap submitted
- [ ] Review the generated legal pages (privacy, terms) and adapt them to your situation
- [ ] Before adding ads or affiliate links: update the privacy policy and affiliate disclosure, and add a consent banner if any ad network sets cookies
