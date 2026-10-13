# Insulation Planner MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and verify the lean-launch Insulation Planner described in `docs/superpowers/specs/2026-10-14-insulation-planner-design.md`. That means a static Next.js site with a tested calculation engine and four markets (US, UK, DE, FR) in three languages, ready to deploy on Cloudflare Pages.

**Architecture:**
- **Engine:** a pure TypeScript engine (`src/engine`) computes everything in SI units from typed, sourced market data (`src/markets/*`).
- **Routing:** Next.js 16 App Router with `output: 'export'`. Each market has its own *root layout* (`app/(us)`, `app/uk`, `app/de`, `app/fr`), so `<html lang>` is correct without post-processing.
- **Pages:** each market has a `page.tsx` home and a `[slug]/page.tsx` that render from a central route registry.
- **Calculator:** the only client island.
- **Content:** Markdown rendered at build time.

**Tech Stack:** Next.js 16.4 · React 19.3 · TypeScript 5 · Tailwind CSS 4 · Vitest · unified/remark/rehype · Cloudflare Pages.

**Plan note (owner instruction):** the owner asked for no interruptions, so this plan is executed inline by the author. Engine tasks follow strict TDD with the test code in the repo. UI/content tasks are specified by interfaces and acceptance checks rather than duplicating every line of JSX in this document.

---

## File map

| Path | Responsibility |
|---|---|
| `next.config.ts` | `output: 'export'`, `trailingSlash: false`, `images.unoptimized`, `experimental.globalNotFound` |
| `vitest.config.ts` | unit test config (node env, `@/` alias) |
| `src/engine/units.ts` | IP↔SI conversions (`rIP`, `toRIP`, `inches`, `sqft`, `perBoardFoot` …) |
| `src/engine/types.ts` | `MarketData`, `Product`, `TargetTier`, `CalcInput`, `CalcResult`, … |
| `src/engine/targets.ts` | resolve target + existing R for both target bases (insulationR / elementU) |
| `src/engine/select.ts` | layered product selection (≤3 layers, cavity cap) |
| `src/engine/loosefill.ts` | coverage-chart interpolation + physics fallback |
| `src/engine/calculate.ts` | `calculate(input, market)` orchestrator + math steps + warnings |
| `src/engine/area.ts` | rectangle / walls (perimeter × height − openings) area helpers |
| `src/engine/*.test.ts` | unit tests |
| `src/markets/{us,uk,de,fr}/index.ts` | `MarketData` (meta, targets, products, existing, conventions, sources) |
| `src/markets/index.ts` | registry `getMarket(id)` |
| `src/markets/integrity.test.ts` | data integrity tests |
| `public/data/zip/<zip3>.json` | US ZIP → zone chunks (+ `src/lib/zip.ts` client lookup) |
| `src/markets/fr/departements.ts` | département → H1/H2/H3 |
| `src/i18n/{en-US,en-GB,de,fr}.ts` | typed UI dictionaries (`Dict` type from en-US) |
| `src/routes/registry.ts` | all pages: `{ market, slug, kind, group, preset?, contentId }` + helpers (`pathOf`, `alternatesOf`) |
| `src/routes/registry.test.ts` | unique paths, symmetric groups, every content file exists |
| `src/content/{us,uk,de,fr}/*.md` | page copy (frontmatter: title, description, h1, intro, faqs) |
| `src/lib/content.ts` | load + render Markdown at build (gray-matter + remark + rehype) |
| `src/lib/seo.ts` | metadata builder (canonical, hreflang, OG), JSON-LD builders |
| `src/lib/format.ts` | locale-aware number/currency/R/U/length formatting |
| `src/components/site/*` | `RootShell`, `Header`, `CountrySwitcher`, `Footer`, `Hero`, `Prose`, `Faq`, `Breadcrumbs`, `JsonLd` |
| `src/components/calculator/*` | `Calculator` (client), `useCalcState` (URL sync), `Inputs`, `ResultPanel`, `RMeter`, `ShoppingList`, `MathSteps`, `MobileSummaryBar` |
| `src/components/converter/Converter.tsx` | R ↔ U converter (client) |
| `src/app/(us)/layout.tsx`, `page.tsx`, `[slug]/page.tsx` | US root layout + pages |
| `src/app/{uk,de,fr}/layout.tsx`, `page.tsx`, `[slug]/page.tsx` | per-market root layouts + pages |
| `src/app/global-not-found.tsx` | 404 |
| `src/app/sitemap.ts`, `robots.ts` | SEO files |
| `src/app/fonts.ts`, `globals.css` | fonts (Bricolage Grotesque, Geist, Geist Mono) + Thermal tokens |
| `src/config/site.ts` | siteUrl, brand, email, analytics token, owner details (placeholders) |
| `public/_headers`, `public/llms.txt` | Cloudflare headers, LLM summary |
| `scripts/calc.ts` | CLI to compute worked examples for content writers |
| `DEPLOY.md`, `README.md` | owner docs |

## Tasks

### Task 1: Project scaffold
- [ ] Copy the scaffold (package.json, tsconfig, eslint, src/app, public) into the repo and keep the existing README/docs.
- [ ] `next.config.ts`: `output:'export'`, `trailingSlash:false`, `images:{unoptimized:true}`, `experimental:{globalNotFound:true}`. Remove `cacheComponents`/`partialPrefetching`, since a static export has no server runtime.
- [ ] Add dev deps: `vitest`, `tsx`. Add deps: `gray-matter`, `unified`, `remark-parse`, `remark-gfm`, `remark-rehype`, `rehype-stringify`.
- [ ] Scripts: `test` (vitest run), `calc` (tsx scripts/calc.ts), `check` (lint + typecheck + test).
- [ ] Verify with `npm run build`, which produces `out/index.html`. Then commit.

### Task 2: Units (TDD)
- [ ] Test first: `rIP(1)` = 0.17611 (±1e-5), `toRIP(rIP(38))` = 38, `inches(1)` = 25.4 mm, `sqft(1)` = 0.092903 m², `perBoardFoot(1)` = 1/(0.092903×25.4) per m²·mm, `uFromR`/`rFromU` round-trip.
- [ ] Implement and make the tests pass. Commit.

### Task 3: Engine core (TDD)
- [ ] Tests with a fixture market (no real data):
  - insulationR basis: R_add = target − existing
  - elementU basis: R_needed = 1/U − (Rsi+Rse+Rstruct); bridging multiplies the declared R for between-framing products; existing from U is 1/U_exist − R_other
  - already-met → `status:'alreadyMet'`
  - layered selection picks the thinnest combination ≥ R (≤3 layers); tie → fewer packages
  - cavity cap → best R within the cavity + `cavityLimit` warning + shortfall
  - loose-fill chart interpolation (exact chart row → exact bags; midpoint → linear); physics fallback beyond the chart
  - spray depth/cost
  - waste applied before ceil
  - vermiculite existing → `asbestosRisk` warning
  - zone lookup `'5A'` → `'5A'` → `'5'` fallback; `'4C'` explicit
  - invalid area ≤ 0 → `status:'invalid'`
- [ ] Implement `types.ts`, `targets.ts`, `select.ts`, `loosefill.ts`, `calculate.ts`, `area.ts` until green. Commit.

### Task 4: Market data
- [ ] Transcribe each research JSON (`scratchpad/research/{us,uk,de,fr}.json`) into `src/markets/<id>/index.ts` using unit helpers. Every target, product and price carries a `source` id that resolves in `sources`. Prices carry `priceDate`.
- [ ] Integrity tests:
  - every market enables ≥4 areas
  - every enabled area has a value in every tier (and every zone for zoned tiers)
  - every enabled area has ≥1 product
  - thickness R increases with mm
  - prices are low ≤ high and > 0
  - coverage > 0
  - sources resolve
  - defaults (tier, product per area) exist
- [ ] Commit.

### Task 5: US ZIP lookup
- [ ] Copy `research/us-zones/out/zip3/*.json` to `public/data/zip/`. Copy `states.json` (for the fallback zone picker) to `src/markets/us/states.json`.
- [ ] `src/lib/zip.ts`: `lookupZone(zip)` fetches `/data/zip/<zip3>.json`, with an in-memory cache. Unit-test with an injected fetch.
- [ ] Commit.

### Task 6: i18n dictionaries
- [ ] `en-US.ts` defines the `Dict` shape. The others are typed `Dict`, so a missing key fails `tsc`.
- [ ] Covers nav, calculator labels/options, result strings, warnings, math-step templates, footer and legal snippets. Commit.

### Task 7: Design system + site shell
- [ ] Fonts and Thermal tokens in `globals.css` (`@theme`).
- [ ] `RootShell({market, children})` renders html/body/header/footer. Four tiny root layouts call it.
- [ ] Components: Header (nav + CountrySwitcher using plain `<a>`, a full load across root layouts), Footer, Hero (dark + glow), Prose, Faq (`<details>`), Breadcrumbs, JsonLd. Commit.

### Task 8: Calculator UI
- [ ] `useCalcState`: defaults from market + preset, hydrates from `location.search` on mount, writes back with `history.replaceState` (debounced). No `useSearchParams`, which keeps the static export simple.
- [ ] Inputs:
  - area segmented control
  - dimensions (rect / total / walls with doors & windows)
  - existing (none / thickness+material / known R or U)
  - location (US ZIP + zone picker; FR département)
  - tier, material/product, cavity depth, waste, price override
  - unit toggle
- [ ] Results:
  - big depth number
  - RMeter (Now / Target / After pins)
  - stat tiles (packages, cost)
  - layers/bags breakdown
  - warnings
  - shopping list (copy to clipboard + print)
  - "Show the math"
  - sticky mobile summary bar
  - print CSS
- [ ] Verify in the browser with Playwright MCP that it updates live in all four markets. Commit.

### Task 9: Routing, SEO and page renderers
- [ ] `registry.ts` lists each market's home + 8 SEO pages + trust pages, with `group` keys for alternates.
- [ ] `[slug]/page.tsx`: `generateStaticParams` from the registry, `dynamicParams=false`, `generateMetadata` via `seo.ts`.
- [ ] JSON-LD: WebApplication (calculator pages), FAQPage, BreadcrumbList.
- [ ] `sitemap.ts` (with alternates), `robots.ts`, `public/llms.txt`, `global-not-found.tsx`.
- [ ] Registry tests. Commit.

### Task 10: Content
- [ ] `scripts/calc.ts` prints a worked example for given inputs, for content writers.
- [ ] Content files for all pages in all markets, written in the market's language. Each has: frontmatter (title ≤60 chars, description ≤155 chars, h1, faqs[4–6]) and body (intro, how it works, worked example from `npm run calc`, tips, sources).
- [ ] Legal pages: privacy, terms, affiliate disclosure, about, methodology, FAQ, plus the DE Impressum with owner placeholders. Commit per market.

### Task 11: Converter page
- [ ] `Converter` client component: R(IP) ↔ R(SI) ↔ U, plus thickness ↔ R for a chosen λ. Used on the converter pages. Commit.

### Task 12: Deploy assets + docs
- [ ] `public/_headers` (cache + security headers).
- [ ] Analytics snippet, rendered only when a token is set.
- [ ] `DEPLOY.md` (Cloudflare Pages + domain + Search Console) and `README.md` (dev commands, structure, how to add a page or market, data sources). Commit.

### Task 13: Verification
- [ ] `npm run check` (lint, `tsc --noEmit`, vitest) passes.
- [ ] `npm run build` passes. `out/` contains every registry path.
- [ ] Spot-check `out/de/*.html` for `lang="de"`, the hreflang links and the JSON-LD.
- [ ] Serve `out/` locally. With Playwright MCP, check each market home on desktop and mobile widths: calculator live update, copy list, no console errors. Screenshot review.
- [ ] Commit. Write the owner question list.
