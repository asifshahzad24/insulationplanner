# Insulation Planner — Design Spec

**Date:** 2026-10-14 · **Status:** Approved (owner delegated remaining decisions) · **Source brief:** `docs/Insulation_Planner_Complete_Guide.pdf`

## 1. Goal

A free, no-signup insulation calculator site for homeowners and DIYers in the US and Europe. It tells you how much insulation to add, how many bags, rolls or boards to buy, and what it will cost. It grows through organic search, the way drywallplanner.com and kilohour.com do, and earns money later from display ads and affiliate links.

**Competitive gap:** drywallplanner.com/insulation-calculator only does batts. It has no blown-in, no climate-zone targets, no cost, no U-values, no Europe coverage and only one page. We win by specialising: all common materials, per-country targets, a transparent method and many long-tail pages.

## 2. Decisions

| Topic | Decision |
|---|---|
| Stack | Next.js (App Router, `output: 'export'`), TypeScript, Tailwind CSS v4 |
| Hosting | Cloudflare Pages (static `out/`), GitHub repo, Cloudflare DNS |
| Analytics | Cloudflare Web Analytics (cookieless, so no consent banner) + Google Search Console |
| Theme | "Thermal": a thermal-camera gradient as the brand, a dark hero only at the top, light content, and friendly question-style labels |
| Markets | 🇺🇸 US at `/`, 🇬🇧 UK at `/uk/`, 🇩🇪 DE at `/de/`, 🇫🇷 FR at `/fr/` |
| Languages | en-US, en-GB, de-DE, fr-FR |
| Domain | **loftinsulationcalc.com** (registered by the owner on Cloudflare), set in `src/config/site.ts` |
| Launch scope | Lean launch: full calculator, converter, ~8 SEO pages and the trust/legal pages per market. Grow weekly after launch. |
| Monetisation | None at launch. Affiliate boxes and ads are phase 2. Affiliate-disclosure page ships at launch. |

## 3. Markets

> **Updated during build (2026-10-14):** the US has a single tier (DOE/ENERGY STAR = 2021 IECC values). The UK splits walls into cavity fill (Part L 0.55) and solid walls (0.30), and uses a "new-build standard" second tier (ADL Table 4.2). In Germany the GEG was renamed **GModG** on 29 Jul 2026 (same values). In France, MaPrimeRénov' *par geste* no longer funds insulation since 1 Sep 2026, so the second tier is the CEE level, counting only new insulation.

| | US | UK | DE | FR |
|---|---|---|---|---|
| Units (default) | ft, in, sq ft | m, mm, m² | m, cm, m² | m, cm, m² |
| Rating shown | R-value (IP) | U-value (W/m²K) + R (SI) | U-Wert + R | Résistance R (m²K/W) |
| Target basis | insulation R | element U | element U | insulation R |
| Target tiers | IECC 2021 code minimum · DOE/ENERGY STAR recommended | Building Regs Part L (ADL 2021 Table 4.3) · EST recommended (270 mm loft) | GEG Anlage 7 (legal) · BEG EM TMA (grant level) | RT existant (par élément) · CEE/MaPrimeRénov' level |
| Location input | ZIP → IECC climate zone (fallback: zone picker) | none (national) | none (national) | département → zone H1/H2/H3 (only where targets differ) |
| Currency | USD | GBP | EUR | EUR |

Every page can switch units manually (imperial ↔ metric). The R ↔ U converter works in every market.

## 4. Pages at launch (per market)

1. **Calculator home.** The main tool, plus explanatory content.
2. **Preset calculator pages.** The same calculator with an area or material preset, plus unique content: intro, method, a worked example computed by the engine, tips and an FAQ.
   - **US:** attic · walls · floor/crawl space · basement walls · blown-in · R-value chart (R → inches) · insulation by climate zone (ZIP lookup) · R ↔ U converter
   - **UK:** loft · cavity wall · solid wall · floor · loft insulation thickness · U-value calculator · Part L targets · blown loft insulation
   - **DE:** oberste Geschossdecke · Außenwand · Kellerdecke · Dach (Zwischensparren) · Dämmstärke · U-Wert-Rechner · GEG & BEG Anforderungen · Einblasdämmung
   - **FR:** combles perdus · murs · plancher bas · rampants · épaisseur d'isolant · calcul résistance thermique · exigences MaPrimeRénov'/CEE · isolation soufflée
3. **Trust/legal pages:** Methodology (all formulas and sources), FAQ, About, Privacy (GDPR), Terms & Disclaimer, Affiliate Disclosure. DE adds **Impressum**, which is legally required and needs the owner's details.
4. **404 page.**

Pages linked across markets (e.g. US attic ↔ UK loft ↔ DE oberste Geschossdecke ↔ FR combles perdus) share a `group` key, which drives the hreflang alternates.

## 5. Calculator

### Inputs (friendly labels)

- **What are you insulating?** Area: `attic` (attic floor / loft / oberste Geschossdecke / combles perdus) · `roof` (sloped roof between rafters) · `wall` (exterior walls) · `floor` (floor over unheated space / basement ceiling) · `basementWall` (US only).
- **How big is it?** Length × width, or total area. Walls use perimeter × height minus doors and windows (counts with default sizes).
- **What's there now?** None · thickness + old material · known R (or U for EU elements).
- **Where do you live?** US ZIP → zone, or zone picker. FR département where relevant. UK/DE need nothing.
- **Target level:** tier selector (defaults: US recommended, UK Part L, DE GEG, FR CEE level).
- **What will you use?** A material, which filters the market's product presets: fiberglass/glass-wool batts or rolls · mineral (rock) wool · blown fiberglass · blown cellulose · EPS · XPS · polyiso/PIR · wood fibre (EU) · spray foam open/closed (US, professional install).
- **Cavity depth** (walls/roof, optional): limits in-cavity depth and warns.
- **Waste factor:** default 10%.
- **Prices:** editable per package (defaults from market data).

### Engine (pure TypeScript, no React, fully unit-tested)

`calculate(input, market) → result`. All internal maths is in SI units. The conversion is 1 h·ft²·°F/Btu = 0.1761 m²K/W.

- **Insulation-R markets (US, FR):** `R_add = R_target − R_existing`.
- **Element-U markets (UK, DE):**
  - `R_ins_required = (1/U_target − Rsi − Rse − R_structure) × bridging` (bridging = 1.10 when installed between timber members, 1.0 for continuous boards).
  - If the existing element's U is known: `R_add = 1/U_target − 1/U_existing`.
  - Otherwise: `R_add = R_ins_required − d_existing/λ_existing`.
  - The simplification is documented on the Methodology page.
- **Already at target:** if `R_add ≤ 0`, the verdict is "You're already at or above target", with an optional upgrade suggestion to the next tier.
- **Product forms:**
  - **batt / roll / board:** search combinations of up to 2 layers of the preset's standard thicknesses for the thinnest stack with R ≥ R_add. Ties go to fewer packages. Packages = ceil(area × (1 + waste) / coverage) per layer.
  - **loose-fill:** settled depth = R_add / R-per-unit. Installed depth comes from the settling factor. Bags = area × settled depth × settled density / bag mass. Where a manufacturer coverage chart exists, use chart rows instead (linear interpolation on R).
  - **spray:** depth = R_add / R-per-inch. Cost = area × depth × price per board-foot (or per m²·cm).
- **Cavity constraint:** if the in-cavity depth exceeds the cavity, cap it. Report the achieved R and the shortfall, and suggest continuous boards for the rest.
- **Output:**
  - depth to add (installed and settled)
  - R/U now → after vs target
  - packages per layer
  - material cost range (low–high)
  - shopping list (products + accessory checklist + safety notes)
  - warnings (vermiculite/asbestos, cavity overflow, old mineral wool)
  - "Show the math" steps

### Market data (typed TS files, each number carries a source id)

- `targets` (per tier, per area, optionally per zone)
- `products` (preset per material/form with thickness options, λ or R/in, coverage, price low/high, price date)
- `existingMaterials`
- `conventions` (Rsi/Rse, structure R per area)
- `sources`

### Shareable state

All inputs are mirrored into URL query params, so a result can be shared or bookmarked.

## 6. UX & design system ("Thermal")

- **Tokens:** ink `#0E1116`, surface `#FFFFFF`, canvas `#F5F6F8`, line `#E3E6EA`, muted `#5B6470`. Thermal scale: `#DC2626 → #F97316 → #FACC15 → #22D3EE → #3B82F6 → #312E81` (hot = heat loss, cold = well insulated). Dark hero `#0B0E14` with a blurred thermal glow.
- **Type:** Bricolage Grotesque (display), Geist (UI/body), Geist Mono (numbers). All self-hosted via `next/font`, with no Google CDN calls (GDPR).
- **Components:**
  - header (logo, nav, country switcher)
  - hero
  - calculator card (segmented control, inputs with unit suffix, select, toggle)
  - result panel with **R-meter** (gradient bar with Now / Target / After pins)
  - stat tiles
  - shopping list (copy + print)
  - "Show the math" disclosure
  - FAQ accordion (native `<details>`)
  - content prose
  - footer (markets, calculators, guides, legal)
- **Mobile:** single column. A sticky bottom summary bar ("Add 13.5 in · 42 bags · $630–760") jumps to the results.
- **Print:** a stylesheet that prints only the shopping list and inputs summary.
- **Accessibility:** labelled inputs, keyboard-operable controls, AA contrast, `prefers-reduced-motion`.

## 7. Architecture

```
src/
  app/                 layout.tsx (root), page.tsx (US home), [...path]/page.tsx (all other routes),
                       not-found.tsx, sitemap.ts, robots.ts
  config/site.ts       siteUrl, brand, contact email, analytics token (placeholders)
  engine/              units.ts, calculate.ts, select-products.ts, types.ts (+ *.test.ts)
  markets/{us,uk,de,fr}/  market.ts (meta, locale, currency, units), targets.ts, products.ts,
                       existing.ts, conventions.ts, sources.ts, zones (US zip3 chunks in public/data/zip/)
  i18n/                dictionaries en-US, en-GB, de, fr (typed; missing key = type error)
  routes/registry.ts   every page: path, market, kind, group, preset, content id
  content/{market}/*.md  page copy with frontmatter (title, description, h1, faqs)
  components/          UI (calculator, result, meter, layout, prose, faq …)
scripts/               post-build (set <html lang> per market dir), calc CLI for worked examples
```

- **Routing:** `app/page.tsx` renders the US home. `app/[...path]/page.tsx` uses `generateStaticParams` from the registry with `dynamicParams = false`, so every URL is known at build time.
- **`<html lang>`:** the root layout defaults to `en-US`. A post-build script rewrites `lang` for `out/uk|de|fr/**`, and a small client effect keeps it correct after client-side navigation.
- **Content:** Markdown is rendered at build time (unified/remark/rehype), so content pages ship no runtime JS. The calculator is the only client island.
- **SEO:**
  - per-page `generateMetadata`: title, description, canonical, hreflang alternates by `group` + `x-default` → US
  - `sitemap.xml` with alternates, `robots.txt`
  - JSON-LD: WebApplication, FAQPage, BreadcrumbList
  - Open Graph tags, `llms.txt`
- **Performance budget:** Lighthouse ≥ 95 on mobile for performance, accessibility, best practices and SEO. Calculator JS under 60 kB gzipped.
- **Headers:** a `public/_headers` file sets long-cache static assets and security headers (CSP, HSTS-ready, X-Content-Type-Options, Referrer-Policy).

## 8. Privacy & legal

- No cookies and no tracking at launch. Cloudflare Web Analytics is cookieless.
- The privacy policy covers hosting logs (Cloudflare) and analytics.
- Fonts are self-hosted.
- The Impressum (DE) and About pages use owner placeholders, flagged before launch.
- Every result carries this disclaimer: estimates for planning; confirm with the supplier, the product's coverage chart and local code.

## 9. Testing

- **Vitest unit tests:**
  - unit conversions
  - engine maths, with worked examples checked by hand against the formulas and manufacturer coverage charts
  - product selection
  - edge cases (zero area, already above target, cavity overflow)
  - data integrity: every market has targets for every enabled area/tier, every number has a source, prices are positive
- **Build checks:**
  - every registry route builds
  - every page has a title/description
  - hreflang groups are symmetric
  - the sitemap matches the registry
- **Playwright smoke test** on the built `out/`:
  - each market's home renders
  - the calculator updates live
  - copying the list works
  - there are no console errors

## 10. Deployment

Write `DEPLOY.md` with the steps: GitHub → Cloudflare Pages (build `npm run build`, output `out`) → custom domain → Web Analytics token → Search Console (DNS verify) → submit sitemap.

## 11. Out of scope (phase 2+)

- affiliate product boxes
- display ads with a consent platform (CMP)
- embed widget
- 50 US state pages and "bags for X sq ft" pages
- more guides
- other languages
- sloped-roof rafter-depth optimiser
- labour cost estimates
- dark mode
