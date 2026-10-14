---
title: "UK Calculator Methodology: U-Values, Bridging & Prices"
description: "How the UK insulation calculator works: BS EN ISO 6946 and BR 443 U-values, timber bridging, Part L targets, product data, retail prices and limitations."
h1: "How the UK calculator works"
nav: "Methodology"
intro: "The formulas, conventions, data and assumptions behind the UK results, and what the calculator doesn't do, so you can check the work yourself."
---
## Units

The UK section works in SI units throughout: thicknesses in millimetres, areas in square metres, R-values in m²K/W, thermal conductivity (λ) in W/m·K and U-values in W/m²K. Prices are in pounds sterling.

## Targets

UK targets are **U-values for the whole element**, from Approved Document L, Volume 1: Dwellings (2021 edition incorporating 2023 amendments), which applies in England. There are two levels:

| Area | Building Regs (Part L), Table 4.3 (b) | New-build standard, Table 4.2 |
|---|---|---|
| Loft | 0.16 | 0.15 |
| Room in roof | 0.16 | 0.15 |
| Cavity walls | 0.55 | – |
| Solid walls (internal or external insulation) | 0.30 | 0.18 |
| Floor | 0.25 | 0.18 |

- **Table 4.3** gives the improved U-values for upgrading an existing element. Its single roof row covers lofts, rooms in the roof and flat roofs.
- **Table 4.2** gives values for new elements in an existing home. A cavity can only be filled, so cavity walls have no new-build value.
- The **2026 edition** of Approved Document L, published on 24 March 2026 and in force from 24 March 2027, keeps the same values for existing homes.
- **Wales and Scotland** set their own values. We use England's, and say so on every page.

The full rules, including when they apply, are on [Part L U-values](/uk/part-l-u-values).

## U-value method

U-values are calculated following **BS EN ISO 6946**, with the conventions in BRE's **BR 443**:

**U = 1 ÷ (Rsi + Σ thickness/λ + Rse)**

To size insulation, the calculator turns this around. The R-value the insulation must supply is 1 ÷ target U, minus the surface resistances and the R of the rest of the build-up. These are the values it uses:

| Area | Rsi | Rse | Rest of build-up | Timber | Timber fraction |
|---|---|---|---|---|---|
| Loft | 0.10 | 0.04 | 0.43 | 100 mm ceiling joists | 12.8% |
| Room in roof | 0.10 | 0.10 | 0.06 | 100 mm rafters | 8.8% |
| Cavity walls | 0.13 | 0.04 | 0.51 | – | – |
| Solid walls | 0.13 | 0.04 | 0.42 | – | – |
| Floor (suspended timber) | 0.17 | 0.04 | 1.04 | 150 mm floor joists | 10.8% |

R-values in m²K/W. The ‘rest of build-up’ column covers everything except the new insulation and the surfaces: plasterboard, roof space, masonry, floorboards, ventilated voids and, for floors, a simplified allowance for the ground.

### Timber bridging

Where insulation sits between joists or rafters, heat also flows through the timber. The calculator uses a **parallel-path** method. Layers fill from the bottom up. Within the depth of the timber, the effective conductivity is:

**λ effective = (1 − f) × λ insulation + f × λ timber**

where f is the timber fraction and λ timber is 0.13 W/m·K, a typical softwood value from EN ISO 10456. Anything above the timber, such as a loft layer laid across the joists, is calculated as plain thickness ÷ λ.

### Calibration

The values for the rest of each build-up are calibrated so that reference constructions match published results:

- **Loft:** 100 mm + 170 mm of λ 0.044 loft roll with 12.8% timber gives **U 0.16**, as Knauf and RdSAP 10 state.
- **Cavity wall:** a filled 65 mm cavity gives about **U 0.43**, as in Knauf's tables.
- **Floor:** 150 mm of mineral wool between the floor joists gives about **U 0.25**, in line with the Energy Saving Trust.
- **Solid wall:** an uninsulated 225 mm solid brick wall gives about **U 1.7**, the RdSAP 10 value.

## Existing insulation

If you enter a depth, existing mineral wool and polystyrene (EPS) are valued at **λ 0.040**, the figure in the RdSAP 10 specification, and bridged by the timber in the same way as new insulation. Vermiculite is given a conservative λ of about 0.053 and triggers a warning, because the HSE lists loose-fill insulation among materials that may contain asbestos. You can also enter a known R-value or U-value instead. If what's there already meets the target, the calculator says so and stops.

## Choosing rolls and boards

Each product has a list of standard thicknesses, each with its coverage per roll or board and a price range. The calculator tries every combination of up to three layers and keeps those that reach the target. From those it picks:

1. the **fewest layers**, then
2. the **thinnest total stack**, then
3. the fewest rolls or boards, then
4. the lowest price.

Rolls or boards per layer = area × (1 + waste allowance) ÷ coverage, rounded up. If nothing fits within a limited depth, it shows the best stack that does and warns you.

## Installer products

**Cavity fill** fills the whole cavity. It can't be installed part-way, so the calculator doesn't size it to the target: it fills the cavity width you choose (50, 65, 75, 85 or 100 mm) with λ 0.040 blown mineral wool (Knauf Supafil 40) and reports the U-value you end up with.

**Blown loft insulation** (Knauf Supafil Loft 045, λ 0.045) is calculated as a continuous layer to whatever depth reaches the target.

## Prices

- **Rolls and boards** use retail prices from **Wickes, Toolstation and Travis Perkins**, checked on **14 October 2026**. Where they differ, you see a low–high range; multibuy offers set the low end. B&Q was unavailable on that date. These are material costs only, without tools, labour or delivery.
- **Installer prices** are derived from the Energy Saving Trust's per-home figures, so they're estimates. Cavity wall insulation at about £2,200 for a typical home, assuming 80–110 m² of external wall, gives **£20–£27.50 per m²**. Loft insulation at about £750 from 0 to 270 mm, assuming a 40–55 m² loft, gives **£13.60–£18.75 per m² at 270 mm**, scaled by depth. No waste allowance is added to installed prices.

You can enter your own price per roll or board under **More options**.

## Waste and wall areas

The waste allowance defaults to **10%**. It's an editorial choice that covers offcuts, trimming around obstructions and uneven spacing, and you can change it. If you measure walls by length and height, the calculator deducts **1.9 m² per door** and **1.5 m² per window**.

## Product data

- Loft roll: Knauf Loft Roll 44 Combi-cut, λ 0.044, 100/150/170/200 mm
- PIR board: SOPRATHERM GA4000 (formerly Celotex) and Kingspan TP10, λ 0.022, 2400 × 1200 mm, 25–120 mm
- EPS board: Jablite Jabfloor 70, λ 0.038, 2400 × 1200 mm
- Cavity fill: Knauf Supafil 40, λ 0.040
- Blown loft: Knauf Supafil Loft 045, λ 0.045

## Limitations

- **Ground floors are simplified.** Floor heat loss really depends on the floor's size, shape, edge insulation and the ground, as set out in BS EN ISO 13370. We use a fixed allowance calibrated to a suspended timber floor, so solid floors aren't modelled properly.
- **No condensation risk analysis.** The calculator doesn't check for condensation inside walls, roofs or floors. That matters most for internal wall insulation and rooms in the roof.
- **Not a SAP or RdSAP assessment.** It doesn't produce an EPC rating, estimate bills or savings, or replace a calculation for building control.
- **Simplified build-ups.** Battens, fixings, plasterboard and render systems aren't modelled individually. Product data sheets and an installer's calculation take precedence.
- **Workmanship.** Gaps, compression and air leaks aren't modelled. Careful installation matters as much as the numbers.
- **England only.** Wales and Scotland have their own targets.
- **Prices change.** They're a snapshot from one day, including promotions.

## How other sections differ

The site has separate sections for the US, Germany and France, and each uses a different method. The US section follows ENERGY STAR's recommended insulation R-values by climate zone, which count the insulation alone, not the framing. The German section works from U-values in the GEG and federal funding rules. The French section works from the thermal resistance thresholds used by renovation grant schemes.

## Checking our numbers

The engine is covered by automated tests, and the worked examples on our pages come from the same engine through a command-line tool, so every quoted depth, roll count, price and U-value matches the calculator. **Show the maths** under each result lists every step. If you spot an error, email hello@loftinsulationcalc.com.

## Sources

- [Approved Document L, Volume 1: Dwellings (2021 edition incorporating 2023 amendments)](https://assets.publishing.service.gov.uk/media/662a2e3e55e1582b6ca7e592/Approved_Document_L__Conservation_of_fuel_and_power__Volume_1_Dwellings__2021_edition_incorporating_2023_amendments.pdf)
- [GOV.UK: Approved Document L (2026 edition) — takes effect 24 March 2027](https://www.gov.uk/government/publications/approved-document-l-2026)
- [BRE BR 443: Conventions for U-value calculations (2019)](https://www.cibse.org/media/wzrjrf3l/conventions-for-u-value-calculations.pdf)
- [RdSAP10 Specification (BRE, February 2024)](https://bregroup.com/documents/d/bre-group/rdsap10-dt13-02-2024-1-pdf)
- [Energy Saving Trust: Roof and loft insulation](https://energysavingtrust.org.uk/advice/roof-and-loft-insulation/)
- [Energy Saving Trust: Cavity wall insulation](https://energysavingtrust.org.uk/advice/cavity-wall-insulation/)
- [Energy Saving Trust: Floor insulation](https://energysavingtrust.org.uk/advice/floor-insulation/)
- [Energy Saving Trust: Solid wall insulation](https://energysavingtrust.org.uk/advice/solid-wall-insulation/)
- [Knauf Insulation: Loft Roll 44 (Combi-cut)](https://knauf.com/en-GB/p/product/loft-roll-44-combi-cut-26333_4206)
- [Knauf Insulation: Loft Roll installation guide (2025)](https://knauf.com/api/download-center/v1/assets/8bedb4b5-e85d-43ac-8ecb-3a2fb1fa09bc?download=true&country=gb)
- [Knauf Insulation: UK & Ireland Insulation Solutions Guide (June 2026)](https://knauf.com/api/download-center/v1/assets/ebadf176-5e33-4515-9ad0-fb5e6c674c8d?download=true&country=gb)
- [Knauf: Supafil 40 cavity wall insulation](https://knauf.com/en-GB/p/product/supafil-r-40-26377_4206)
- [ACERMI certificate 04/D/016/378 — Knauf Supafil Loft 045](https://acermi.com/en/certified-insulation-products/certificate/04-d-016-378-27/)
- [SOPREMA UK: SOPRATHERM GA4000 (previously Celotex GA4000)](https://www.soprema.co.uk/products/sopratherm-ga4000)
- [Wickes: insulation boards (prices)](https://www.wickes.co.uk/Products/Building-Materials/Insulation/Insulation-Boards/c/1000272)
- [Wickes: loft insulation (prices)](https://www.wickes.co.uk/Products/Building-Materials/Insulation/Loft-Insulation+Accessories/Loft-Insulation/c/1000270)
- [Toolstation: insulation (prices)](https://www.toolstation.com/construction-insulation/insulation/c754)
- [HSE: Asbestos — location of materials (loose-fill)](https://www.hse.gov.uk/asbestos/location-materials.htm)
