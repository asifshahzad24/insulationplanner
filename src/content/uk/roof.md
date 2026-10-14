---
title: "Pitched Roof Insulation Calculator: Depth & Cost"
description: "Pitched roof insulation calculator for a room in the roof: PIR depth to hit Part L U-value 0.16, how many boards to buy and the material cost."
h1: "Pitched roof insulation calculator"
nav: "Pitched roof"
intro: "Insulating at the rafters, for a room in the roof? Enter the roof area and see the depth to reach a Part L U-value, how many boards to buy and the cost."
faqs:
  - q: "How thick should pitched roof insulation be?"
    a: "For an upgraded roof in England, Approved Document L asks for a U-value of 0.16 W/m²K. In our model, 120 mm plus 50 mm of PIR board (λ 0.022) gets a bare roof to U-value 0.15. A new element is 0.15, and the same boards at 100 mm plus 75 mm meet that too."
  - q: "Should I insulate the rafters or the loft floor?"
    a: "If the loft is cold and unused, insulate the floor. That is the cheaper job, and 270 mm of mineral wool is the usual target. Insulate the rafters only when the roof space is heated: a dormer room, a loft conversion, or a cathedral ceiling."
  - q: "Will the insulation fit between the rafters?"
    a: "Often not all of it. The calculator treats the first 100 mm as sitting between the rafters and the rest as a continuous layer under them. A 100 mm rafter on its own is not deep enough for U-value 0.16 with this PIR board, so plan on a layer below the rafters or on deepening them."
  - q: "How many boards do I need for 40 m² of roof?"
    a: "With 10% for offcuts, 40 m² needs 16 boards of 120 mm and 16 boards of 50 mm, each board 2,400 × 1,200 mm. At October 2026 prices that is £1,568–£1,689 for the boards alone."
  - q: "Does this include a ventilation gap?"
    a: "No. A vented roof needs a clear channel between the insulation and the underlay, so you cannot fill the whole rafter. The calculator sizes the insulation for the U-value and does not check condensation or ventilation. Follow the underlay maker's instructions, or ask your installer."
---
## How the pitched-roof calculation works

A room in the roof is insulated on the slope, between and under the rafters. A cold loft is insulated on the floor, which is a different job: use the [loft insulation calculator](/uk/loft-insulation-calculator) for that.

The target is a U-value from Approved Document L (England):

- **Building Regs (Part L): 0.16 W/m²K.** Table 4.3, for upgrading an existing roof, including a room in the roof insulated at the rafters.
- **New-build standard: 0.15 W/m²K.** Table 4.2, for a new roof element in an existing home.

The calculator turns that U-value into the R-value the insulation must supply:

**U = 1 ÷ (Rsi + insulation R + the rest of the build-up + Rse)**

- Surface resistances are 0.10 m²K/W on both sides, the figure for a pitched roof with a ventilated layer outside the insulation.
- The rest of the build-up (plasterboard and a small allowance for the ceiling) is R 0.06. An uninsulated slope starts at about U-value 3.85.
- The first 100 mm of insulation is treated as sitting between the rafters. Timber is 8.8% of that layer, at λ 0.13, so the wood bridges part of the insulation. Anything thicker than 100 mm is a continuous layer under the rafters, with no timber in it.
- It then picks the fewest layers, then the thinnest stack, of PIR boards (λ 0.022) that reach the target. The page opens on those boards.

Wales and Scotland set their own values. These figures are England's.

## Worked example: 40 m² of rafters

Nothing in the slope yet, 10% added for offcuts (44 m²), PIR boards of 2,400 × 1,200 mm:

| Target | Build-up | U-value after | Boards | Material cost |
|---|---|---|---|---|
| Part L, U ≤ 0.16 | 120 mm + 50 mm | 0.15 | 16 + 16 | £1,568–£1,689 |
| New-build standard, U ≤ 0.15 | 100 mm + 75 mm | 0.15 | 16 + 16 | £1,584–£1,909 |

Both stacks are deeper than a typical 100 mm rafter. The first board can go between the rafters only as far as the timber allows, and the rest goes under them, on battens, which costs a little headroom. Prices are for the boards only, from Wickes, Toolstation and Travis Perkins on 14 October 2026. Add battens, a vapour-control layer, tape and plasterboard.

## Air leakage and ventilation

- **Vapour control.** On the warm side of the insulation, the ceiling needs a continuous airtight layer. Gaps at laps, walls and roof windows let moist room air into the slope.
- **Ventilation.** Many existing roofs need a clear air channel above the insulation, from eaves to ridge. If you have one, you cannot fill the full rafter depth. The calculator does not model that channel.
- **Cold loft instead.** Where the loft stays outside the heated rooms, 270 mm of mineral wool on the floor is the usual Part L route and uses less material. Compare it on the [loft insulation calculator](/uk/loft-insulation-calculator).

Every target is listed on [Part L U-values](/uk/part-l-u-values). Board thicknesses are on [loft insulation thickness](/uk/loft-insulation-thickness), and the sums are on the [U-value calculator](/uk/u-value-calculator).

## Sources

- [Approved Document L, Volume 1: Dwellings (2021 edition incorporating 2023 amendments)](https://assets.publishing.service.gov.uk/media/662a2e3e55e1582b6ca7e592/Approved_Document_L__Conservation_of_fuel_and_power__Volume_1_Dwellings__2021_edition_incorporating_2023_amendments.pdf)
- [Energy Saving Trust: Roof and loft insulation](https://energysavingtrust.org.uk/advice/roof-and-loft-insulation/)
- [BRE BR 443: Conventions for U-value calculations (2019)](https://www.cibse.org/media/wzrjrf3l/conventions-for-u-value-calculations.pdf)
