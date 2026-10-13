---
title: "Methodology: How Our Insulation Calculator Works"
description: "How Insulation Planner works out R-values, depth, bags and cost: targets from ENERGY STAR and the 2021 IECC, manufacturer coverage charts and retail prices."
h1: "How the calculator works"
nav: "Methodology"
intro: "Every formula, assumption and source behind our numbers, so you can check the work yourself."
---
## Units

All the math runs in SI units: R-values in m²·K/W, lengths in millimeters, areas in square meters. US inputs are converted on the way in and results are converted back for display:

- 1 US R-value (ft²·°F·h/Btu) = 0.1761 m²·K/W
- 1 in = 25.4 mm
- 1 sq ft = 0.0929 m²

R-values are shown rounded to the nearest whole number. Depths are shown to up to two decimal places below 10 in and one decimal place above that.

## Targets

US targets are the levels DOE and ENERGY STAR recommend for existing homes. ENERGY STAR's table is based on Table R402.1.3 of the 2021 International Energy Conservation Code (IECC).

| Climate zone | Attic | Walls | Floors | Basement walls |
|---|---|---|---|---|
| 0–1 | R-30 | R-13 | R-13 | none |
| 2 | R-49 | R-13 | R-13 | none |
| 3 | R-49 | R-20 | R-19 | R-13 |
| 4 (except 4C) | R-60 | R-30 | R-19 | R-13 |
| 4C | R-60 | R-30 | R-30 | R-19 |
| 5–6 | R-60 | R-30 | R-30 | R-19 |
| 7–8 | R-60 | R-30 | R-38 | R-19 |

- **These are nominal insulation R-values**: the R of the insulation itself, as printed on the product. Framing and other layers aren't part of the target.
- **Walls and basement walls use the code's cavity-only option.** The code also accepts combinations of cavity and continuous insulation, which we don't model as separate targets.
- **Sloped roofs** use the attic values.

The same table, with a calculator, is on [insulation R-values by climate zone](/insulation-by-climate-zone).

### ZIP code to climate zone

Climate zones are assigned by county in PNNL-33270, PNNL's guide to 2021 IECC zones. We match each ZIP code to its county using the Census Bureau's 2020 ZIP Code Tabulation Area (ZCTA) to county relationship file. The lookup is precomputed and served as small static files, so your browser asks our site only for the file covering the first three digits of your ZIP.

## Existing insulation

If you enter a depth, we multiply it by ENERGY STAR's per-inch values for older insulation:

| Material | R per inch |
|---|---|
| Fiberglass batts | 3.2 |
| Loose fiberglass | 2.5 |
| Cellulose | 3.7 |
| Rock wool (loose) | 2.8 |
| Vermiculite | 2.7 |

Choosing vermiculite triggers a warning: the EPA advises that it may contain asbestos and shouldn't be disturbed. You can also enter a known R-value directly. If what you have already meets the target, the calculator says so and stops.

## The core formula

- **R to add = target R − existing R**
- **Area to cover = area × (1 + waste allowance)**

The waste allowance defaults to 10%. That's an editorial choice: it covers offcuts, uneven floors and spillage, and GreenFiber notes that actual coverage can vary by up to 10%. You can set anything from 0% to 50%.

For walls measured as a perimeter, the net area is perimeter × wall height minus 21 sq ft per door and 12 sq ft per window, the same deductions Benjamin Moore's paint calculator uses.

## Batts and boards

Each product has a list of standard thicknesses, each with its labeled R-value, coverage per package and price. The calculator tries every combination of up to three layers and keeps those that reach the target. From those it picks:

1. the **fewest layers**, then
2. the **thinnest total stack**, then
3. the fewest packages, then
4. the lowest price.

Packages per layer = area to cover ÷ coverage per package, rounded up. If no combination reaches the target, for example because it won't fit in a wall cavity, the calculator shows the highest-R stack that fits and warns you.

## Loose-fill

Blown cellulose and blown fiberglass use the manufacturers' coverage charts: **GreenFiber SANCTUARY** (Rev K, 25 lb bags) and **Knauf EcoFill Wx** (28.6 lb bags). Each chart row gives, for one R-value, the square feet per bag, the installed depth and the settled depth.

- **Inside the chart's range**, the calculator interpolates linearly between the two nearest rows by R. Bags = area to cover ÷ sq ft per bag, rounded up.
- **Outside the chart's range**, such as a small top-up below the lowest row, it falls back on physics. Settled depth = R to add ÷ R per inch (3.65 for cellulose, 2.92 for blown fiberglass). Bags = area to cover × settled depth × settled density ÷ bag weight, using 1.52 lb/ft³ for cellulose and 0.525 lb/ft³ for blown fiberglass. Cellulose is installed 8% deeper than its settled depth to allow for settling. The Knauf chart shows no settling, so blown fiberglass isn't adjusted.

**Show the math** on every result says which method was used. The [blown-in insulation calculator](/blown-in-insulation-calculator) has a worked example of each.

## Spray foam

Spray foam is sprayed to whatever depth is needed:

- **Depth = R to add ÷ R per inch**: 3.7 for open-cell and 6.5 for closed-cell (DOE).
- **Cost = area × depth in board feet × installed price per board foot.**

The installed prices come from HomeGuide's 2026 figures: $1.50–$3.50 per sq ft for open-cell at a typical 3.5 in, which works out to $0.43–$1.00 per board foot, and $3–$5 per sq ft for closed-cell at a typical 2 in, or $1.50–$2.50 per board foot. Because these are installed prices, no waste allowance is added. Minimum job fees of $1,000–$2,000 are common and aren't included.

## Cavity depth limits

In walls, basement walls and sloped roofs, insulation that goes between the framing (batts and spray foam) can't be deeper than the cavity. You choose the framing size: 2×4 (3.5 in), 2×6 (5.5 in), 2×8 (7.25 in), 2×10 (9.25 in) or 2×12 (11.25 in). If you enter existing insulation by depth, the room left is the cavity depth minus that depth. Foam boards are treated as continuous insulation outside the cavity and aren't limited. When the target won't fit, the result shows what you'd reach and suggests adding continuous boards. The [wall insulation calculator](/wall-insulation-calculator) walks through an example.

## Prices

Material prices are typical retail prices from Home Depot, Lowe's and Menards listings in October 2026, shown as a low–high range where they vary (for example, Menards loose-fill before and after rebate). They don't include tools, labor, delivery, sales tax or blower rental. You can enter your own price per package under **More options**.

## Product data

- Fiberglass batts: Owens Corning PINK Next Gen fact sheet (coverage per kraft-faced bag)
- Mineral wool batts: ROCKWOOL Comfortbatt fact sheet
- XPS: Owens Corning FOAMULAR NGX (180-day aged R-values at 75 °F)
- Polyiso: Johns Manville AP Foil-Faced
- EPS: retail-labeled R-values at Menards

## Limitations

- **Framing isn't modeled for US targets.** Studs and joists carry more heat than insulation, so a whole wall or ceiling performs below the nominal R. US targets are written as nominal insulation R, and we follow that.
- **Compression.** We assume batts are installed at full thickness. A batt squeezed into a shallower space delivers less than its label.
- **Workmanship.** Gaps, voids and air leaks aren't modeled. Air sealing first and careful installation matter as much as the numbers.
- **Old insulation.** ENERGY STAR's per-inch values are averages. Wet, dirty or compressed insulation performs worse.
- **Local codes.** States and cities adopt the IECC on their own schedule and may amend it. If your project needs a permit, your building department's rules apply.
- **ZIP codes aren't counties.** Some ZIP codes cross county lines, and a few cross a zone boundary. If you know your county's zone, pick it directly.
- **Brands differ.** Coverage varies between products. Check the chart on the bag you buy.

## How the European sections differ

Our UK and German sections work from building regulations written as maximum U-values for the whole roof, wall or floor. There, the engine works out the insulation R needed as 1 ÷ target U, minus the surface resistances on each side and the R of the rest of the build-up. Where insulation sits between timber joists or rafters, it allows for heat flowing through the timber with a parallel-path method: the effective conductivity of that layer is (1 − f) × λ of the insulation + f × λ of timber, where f is the timber fraction and timber is taken as 0.13 W/m·K.

## Checking our numbers

The engine is covered by automated tests. The worked examples on our pages are produced by the same engine through a command-line tool, so every quoted depth, bag count and price matches what the calculator shows. If you spot an error, email hello@loftinsulationcalc.com.

## Sources

- [ENERGY STAR: Recommended home insulation R-values](https://www.energystar.gov/saveathome/seal_insulate/identify-problems-you-want-fix/diy-checks-inspections/insulation-r-values)
- [ENERGY STAR: DIY checks and inspections (depth multipliers)](https://www.energystar.gov/saveathome/seal_insulate/identify-problems-you-want-fix/diy-checks-inspections)
- [U.S. DOE: Insulation and air-sealing essentials (2021 IECC minimum R-values)](https://www.energy.gov/cmei/buildings/articles/energy-efficient-home-improvement-credit-insulation-and-air-sealing)
- [U.S. DOE: Guide to Home Insulation](https://www.energy.gov/sites/prod/files/guide_to_home_insulation.pdf)
- [PNNL Building America Solution Center: 2009–2021 IECC minimum insulation requirements](https://basc.pnnl.gov/information/2009-2021-iecc-and-irc-minimum-insulation-requirements-new-homes)
- [PNNL-33270: Guide to Determining Climate Zone by County (IECC 2021)](https://www.pnnl.gov/main/publications/external/technical_reports/PNNL-33270.pdf)
- [US Census Bureau: 2020 ZCTA to County Relationship File](https://www2.census.gov/geo/docs/maps-data/data/rel2020/zcta520/tab20_zcta520_county20_natl.txt)
- [U.S. EPA: Asbestos-contaminated vermiculite insulation](https://www.epa.gov/asbestos/protect-your-family-asbestos-contaminated-vermiculite-insulation)
- [GreenFiber SANCTUARY attic coverage chart (Rev K)](https://www.greenfiber.com/uploads/documents/SANCTUARY-Attic-Card_Rev-K.pdf)
- [Knauf EcoFill Wx blowing insulation product data](https://www.buildsite.com/pdf/knauf/Perfomance-EcoFill-Blowing-Insulation-Product-Data-2968935.pdf)
- [Owens Corning PINK Next Gen Fiberglas fact sheet](https://www.owenscorning.com/dms/10025109)
- [ROCKWOOL Comfortbatt R-value fact sheet](https://editserver.rockwool.com/siteassets/o2-rockwool/documentation/brochures/residential/comfortbatt-r-value-expansion-fact-sheet_en.pdf)
- [Owens Corning FOAMULAR NGX product sheet](https://www.owenscorning.com/dms/10017466)
- [Johns Manville AP Foil-Faced polyiso](https://www.jm.com/content/jm/global/en/index/insulation-systems/building-insulation/ap-foil-faced-foam-continuous-insulation/)
- [Menards: foam board insulation (retail prices)](https://www.menards.com/main/building-materials/insulation/foam-board-insulation/c-5779.htm)
- [HomeGuide: Spray foam insulation cost (2026)](https://homeguide.com/costs/spray-foam-insulation-cost)
- [Benjamin Moore paint calculator](https://www.benjaminmoore.com/en-us/paint-calculator)
