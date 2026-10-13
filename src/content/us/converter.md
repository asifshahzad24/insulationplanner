---
title: "R-Value to U-Value Converter: US R, SI R and U"
description: "Convert US R-values to metric (SI) R-values and U-values, and back. Also turn a thickness and thermal conductivity (λ) into an R-value and R per inch."
h1: "R-value to U-value converter"
nav: "R ↔ U converter"
intro: "Convert between US R-values, metric (SI) R-values and U-values, or work out the R-value of any thickness from its thermal conductivity."
faqs:
  - q: "How do you convert R-value to U-value?"
    a: "First convert the US R-value to SI by multiplying by 0.1761, then take the reciprocal: U = 1 ÷ R(SI). For example, R-38 × 0.1761 = 6.69 m²K/W, and 1 ÷ 6.69 = 0.149 W/m²K."
  - q: "What is R-38 in metric?"
    a: "R-38 is about R 6.69 m²K/W in SI units, which corresponds to a U-value of about 0.149 W/m²K for the insulation layer alone."
  - q: "Is a lower U-value better?"
    a: "Yes. U-value measures how much heat flows through, so lower is better. R-value measures resistance to heat flow, so higher is better. They're reciprocals of each other."
  - q: "What's the difference between an R-value and a U-value?"
    a: "R-value is the thermal resistance of a layer or product: higher means better insulation. U-value is the rate of heat flow through it: lower is better. US product labels use R-values in imperial units, while European specs mostly quote U-values for whole walls, roofs and floors."
  - q: "How do I convert thermal conductivity (lambda) to R per inch?"
    a: "Divide 0.1442 by λ in W/m·K. A material with λ = 0.040 works out to about R-3.61 per inch, and λ = 0.024 to about R-6 per inch."
---
## The formulas

The converter uses three relationships.

**US R-value ↔ SI R-value**

- R (SI, m²·K/W) = R (US) × 0.1761
- R (US) = R (SI) × 5.678

The US unit is ft²·°F·h/Btu. The SI unit is m²·K/W. One US R is 0.1761 SI R, so the same insulation always has a much bigger number on a US label than on a European data sheet.

**R-value ↔ U-value**

- U (W/m²·K) = 1 ÷ R (SI)
- R (SI) = 1 ÷ U

U-value is just the reciprocal of R. A US-style U-factor in Btu/h·ft²·°F is 1 ÷ R (US). To turn a metric U into a US U-factor, multiply it by 0.1761.

**Thickness ↔ R-value**

- R (SI) = thickness (m) ÷ λ (W/m·K)
- R per inch (US) = 0.0254 ÷ λ ÷ 0.1761, or about 0.1442 ÷ λ

λ (lambda) is thermal conductivity, the number European data sheets print instead of R per inch. The lower it is, the better the material insulates.

## Worked examples

**R-38 to SI and U.** This is the converter's starting value. R-38 × 0.1761 = **6.69 m²K/W**, and 1 ÷ 6.69 = **0.149 W/m²K**.

**A European U-value to US R.** A data sheet quotes U = 0.25 W/m²K. 1 ÷ 0.25 = **R 4.00 m²K/W**, which is about **R-22.7** in US units.

**Thickness and λ to R.** Ten inches of a material with λ = 0.040 W/m·K: 0.254 m ÷ 0.040 = **R 6.35 m²K/W**, or **R-36.1** in US units. That's **3.61 per inch**, close to blown cellulose.

Common US R-values converted:

| US R-value | SI R (m²K/W) | U (W/m²K) | US U-factor (Btu/h·ft²·°F) |
|---|---|---|---|
| R-13 | 2.29 | 0.437 | 0.077 |
| R-19 | 3.35 | 0.299 | 0.053 |
| R-21 | 3.70 | 0.270 | 0.048 |
| R-30 | 5.28 | 0.189 | 0.033 |
| R-38 | 6.69 | 0.149 | 0.026 |
| R-49 | 8.63 | 0.116 | 0.020 |
| R-60 | 10.57 | 0.095 | 0.017 |

## Insulation R vs. whole-assembly U

The converter turns one number into another. It doesn't know what else is in the wall, so be careful what you compare.

- **US targets are insulation R-values.** When ENERGY STAR recommends R-49 for an attic, it means the R of the insulation itself, printed on the bag or batt. Studs, joists, drywall and sheathing aren't counted.
- **European targets are usually whole-element U-values.** A UK or German limit for a roof or wall covers everything in it: the insulation, the timber or masonry, the boards and the thin layers of still air on each surface (called surface resistances).

So converting R-21 batts to U = 0.270 tells you about the batt, not the wall. The real wall does worse, because heat also flows through the studs. Our UK and German calculators work this way: they subtract surface resistances and allow for heat flow through the timber when they size insulation.

## Common conversion mistakes

- **Mixing up US and metric R.** A European spec that says "R 5" almost always means 5 m²K/W. That's about R-28 in US units, not R-5.
- **Taking 1 ÷ R with the US number.** 1 ÷ 38 gives 0.026, which is a US U-factor in Btu/h·ft²·°F. The metric U-value for R-38 is 0.149 W/m²K. Check which unit you need.
- **Adding U-values.** R-values of layers add up; U-values don't. To combine layers, convert each to R, add them, then take 1 ÷ the total. R-21 batts plus R-10 board make R-31, which is 5.46 m²K/W, or U = 0.183 W/m²K.
- **Forgetting the thickness.** R per inch describes the material. Multiply by the thickness to get the R-value of the layer.

## When you'd use this

- **Reading a European data sheet.** These often list only λ. Enter it with a thickness to get the US R-value and R per inch.
- **Comparing foam boards.** Check a product's R per inch against the values on the [R-value chart](/r-value-chart).
- **Following a European guide** written in U-values while shopping with US labels.

To size insulation for your home, use the [insulation calculator](/), or see the levels for your area on [insulation R-values by climate zone](/insulation-by-climate-zone).

## Sources

- [U.S. DOE: Guide to Home Insulation](https://www.energy.gov/sites/prod/files/guide_to_home_insulation.pdf)
- [ENERGY STAR: Recommended home insulation R-values](https://www.energystar.gov/saveathome/seal_insulate/identify-problems-you-want-fix/diy-checks-inspections/insulation-r-values)
- [Owens Corning FOAMULAR NGX product sheet](https://www.owenscorning.com/dms/10017466)
- [Johns Manville AP Foil-Faced polyiso](https://www.jm.com/content/jm/global/en/index/insulation-systems/building-insulation/ap-foil-faced-foam-continuous-insulation/)
