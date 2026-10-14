---
title: "U-Value Calculator: Convert R-Value, U-Value & Thickness"
description: "Free U-value calculator: convert R-values to U-values and back, turn a thickness and λ into an R-value, and see how a UK loft or wall U-value is worked out."
h1: "U-value calculator"
nav: "U-value calculator"
intro: "Convert between R-value and U-value, or work out the R-value of any thickness from its thermal conductivity (λ). The guide below shows how a whole loft or wall U-value adds up."
faqs:
  - q: "How do I calculate a U-value?"
    a: "Work out the R-value of each layer (thickness in metres ÷ λ), add them up with the inside and outside surface resistances, then take the reciprocal: U = 1 ÷ total R. For a loft with 100 mm of roll between the joists and 170 mm across, that gives U-value 0.16 W/m²K."
  - q: "How do I convert an R-value to a U-value?"
    a: "For a single layer, U = 1 ÷ R. R 4 m²K/W is U 0.25 W/m²K. For a whole wall, roof or floor, add the R-values of every layer and the surface resistances first, then take 1 ÷ the total."
  - q: "What is lambda (λ)?"
    a: "λ is thermal conductivity, in W/m·K: how readily a material conducts heat. Lower is better. Knauf Loft Roll 44 has λ 0.044, PIR boards such as SOPRATHERM GA4000 or Kingspan TP10 have λ 0.022, and softwood timber is about 0.13."
  - q: "Is a lower U-value better?"
    a: "Yes. A U-value measures how much heat flows through, so lower is better. An R-value measures resistance to heat flow, so higher is better."
  - q: "Why doesn't 1 ÷ R match the U-value of my loft?"
    a: "The converter's 1 ÷ R covers one layer only. A real loft also has surface resistances, a ceiling and timber joists that let heat past part of the insulation. The calculators include all of these, which is why they're the better guide for meeting Part L."
---
## The formulas

The converter above uses three relationships.

**Thickness to R-value**

- **R = thickness (m) ÷ λ**
- 200 mm of a material with λ 0.035 W/m·K: 0.200 ÷ 0.035 = **R 5.71 m²K/W**

R-values are in m²K/W. Thicknesses go into the formula in metres, so divide millimetres by 1,000 first.

**R-value to U-value**

- **U = 1 ÷ R**, and **R = 1 ÷ U**
- R 4 m²K/W = **U 0.25 W/m²K**

**Whole element: roof, wall or floor**

- **U = 1 ÷ (Rsi + Σ thickness/λ + Rse)**

This is the method in BS EN ISO 6946, which UK U-value calculations follow, with conventions from BRE's BR 443. **Rsi** and **Rse** are the inside and outside surface resistances: the thin layers of still air that cling to each face.

| Surface resistance | Value (m²K/W) | Where the calculators use it |
|---|---|---|
| Rsi, heat flowing up | 0.10 | Lofts and roofs |
| Rsi, heat flowing sideways | 0.13 | Walls |
| Rsi, heat flowing down | 0.17 | Floors |
| Rse, outside | 0.04 | Lofts, walls and floors |

The converter also shows the US R-value. US product labels use different units: 1 US R-value = 0.1761 m²K/W, so R 5.71 m²K/W is about R-32 in US terms.

## Worked example: a loft, step by step

Here's how the [loft insulation calculator](/uk/loft-insulation-calculator) reaches U-value 0.16 with 100 mm of Loft Roll 44 between the joists and 170 mm across them.

1. **Surfaces and ceiling.** Rsi 0.10 + Rse 0.04 + 0.43 for the ceiling and roof space = **0.57 m²K/W**. On its own, that's an uninsulated loft at 1 ÷ 0.57 = U 1.75.
2. **The layer between the joists.** Timber joists take up 12.8% of the area in our model. The calculator blends the two conductivities by area (a parallel-path calculation): 0.872 × 0.044 + 0.128 × 0.13 = λ 0.055. So 100 mm gives 0.100 ÷ 0.055 = **R 1.82**, not the 2.27 it would give on its own.
3. **The layer across the joists.** Nothing bridges it: 0.170 ÷ 0.044 = **R 3.86**.
4. **Total.** 0.57 + 1.82 + 3.86 = **6.25 m²K/W**.
5. **U-value.** 1 ÷ 6.25 = **0.16 W/m²K**, the Part L value for an upgraded loft.

## Worked example: a filled cavity wall

A cavity wall with a 65 mm cavity filled with blown mineral wool at λ 0.040:

1. Rsi 0.13 + Rse 0.04 + 0.51 for the rest of the wall = **0.68 m²K/W**, or U 1.47 unfilled.
2. Cavity fill: 0.065 ÷ 0.040 = **R 1.63**.
3. Total: 0.68 + 1.63 = **2.31 m²K/W**.
4. U-value: 1 ÷ 2.31 = **0.43 W/m²K**, inside the Part L value of 0.55 for cavity fill.

The [cavity wall insulation calculator](/uk/cavity-wall-insulation-calculator) does this for every cavity width from 50 to 100 mm.

## Layer R-value or element U-value?

Type 270 mm and λ 0.044 into the converter and you get **R 6.14**, which is 1 ÷ 6.14 = U 0.163. That's close to the loft calculator's 0.16, but by coincidence: the joists take away about 0.45, and the surfaces and ceiling add 0.57. In a floor or wall the two don't cancel out. A Part L U-value always means the whole element, so use the calculators when you're checking against the Building Regulations, and the converter for single layers and product comparisons.

## Common mistakes

- **Adding U-values.** R-values of layers add up; U-values don't. Convert each layer to R, add them, then take 1 ÷ the total.
- **Forgetting the surfaces.** Leaving out Rsi and Rse makes an element look worse than it is.
- **Ignoring timber.** Insulation between joists, rafters or studs performs worse than its label, because heat flows through the wood.
- **Millimetres in the formula.** 100 mm is 0.1 m. Divide by 1,000 before dividing by λ.
- **US and UK R-values.** An American R-30 is about 5.3 m²K/W. Check which unit a figure uses.

For the targets you're aiming at, see [Part L U-values](/uk/part-l-u-values). For thicknesses at a glance, see [loft insulation thickness](/uk/loft-insulation-thickness).

## Sources

- [BRE BR 443: Conventions for U-value calculations (2019)](https://www.cibse.org/media/wzrjrf3l/conventions-for-u-value-calculations.pdf)
- [Approved Document L, Volume 1: Dwellings (2021 edition incorporating 2023 amendments)](https://assets.publishing.service.gov.uk/media/662a2e3e55e1582b6ca7e592/Approved_Document_L__Conservation_of_fuel_and_power__Volume_1_Dwellings__2021_edition_incorporating_2023_amendments.pdf)
- [RdSAP10 Specification (BRE, February 2024)](https://bregroup.com/documents/d/bre-group/rdsap10-dt13-02-2024-1-pdf)
- [Knauf Insulation: Loft Roll 44 (Combi-cut)](https://knauf.com/en-GB/p/product/loft-roll-44-combi-cut-26333_4206)
- [SOPREMA UK: SOPRATHERM GA4000 (previously Celotex GA4000)](https://www.soprema.co.uk/products/sopratherm-ga4000)
- [Knauf: Supafil 40 cavity wall insulation](https://knauf.com/en-GB/p/product/supafil-r-40-26377_4206)
