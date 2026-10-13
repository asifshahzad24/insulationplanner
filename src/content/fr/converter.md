---
title: "Calcul résistance thermique : R, U et épaisseur avec lambda"
description: "Calcul de résistance thermique avec le lambda : convertissez une épaisseur en R, un R en coefficient U et inversement, avec la formule R = e / λ et des exemples."
h1: "Calcul de la résistance thermique R et du coefficient U"
nav: "Résistance thermique"
intro: "Entrez une épaisseur et un lambda pour obtenir R, ou passez d'un R à un coefficient U. Les formules et des exemples concrets sont détaillés sous l'outil."
faqs:
  - q: "Comment calculer la résistance thermique d'un isolant ?"
    a: "Divisez l'épaisseur en mètres par le lambda : R = e / λ. Par exemple, 20 cm de laine à λ 0,040 donnent R = 0,20 / 0,040 = 5 m²·K/W."
  - q: "Quelle est la différence entre R, λ et U ?"
    a: "λ caractérise le matériau : plus il est bas, plus le matériau isole. R caractérise une couche d'une épaisseur donnée : plus il est haut, mieux c'est. U mesure les pertes à travers une paroi entière : plus il est bas, mieux c'est."
  - q: "Comment passer de R à U ?"
    a: "Pour une couche seule, U = 1 / R. Pour une paroi complète, ajoutez les résistances superficielles : U = 1 / (Rsi + somme des R + Rse), avec Rsi + Rse = 0,17 m²·K/W pour un mur selon les règles Th-Bat."
  - q: "Comment additionner deux couches d'isolant ?"
    a: "Les résistances s'additionnent. Par exemple, 10 cm d'ancienne laine de verre légère (R 2,13) sous 30 cm de laine neuve (R 7,5) donnent R 9,63 au total."
  - q: "Comment convertir une valeur R américaine ?"
    a: "Divisez la valeur R américaine, en ft²·°F·h/Btu, par 5,678 pour obtenir des m²·K/W. Un R-38 correspond ainsi à environ R 6,7."
---
## Calcul de la résistance thermique avec lambda

La résistance thermique R mesure la capacité d'une couche de matériau à freiner le passage de la chaleur. Elle s'exprime en m²·K/W et se calcule ainsi :

**R = e / λ**

- **e** : l'épaisseur, **en mètres** (20 cm = 0,20 m ; 145 mm = 0,145 m) ;
- **λ** (lambda) : la conductivité thermique du matériau, en W/(m·K), indiquée sur l'étiquette et la fiche technique de l'isolant.

Exemples :

- 20 cm de laine de verre à λ 0,040 : R = 0,20 / 0,040 = **5 m²·K/W** ;
- 30 cm du même isolant : R = 0,30 / 0,040 = **7,5 m²·K/W** ;
- 8,2 cm de polyuréthane à λ 0,022 : R = 0,082 / 0,022 ≈ **3,7 m²·K/W**.

L'outil ci-dessus part de 200 mm et λ 0,035, soit R ≈ 5,71 m²·K/W. Modifiez les deux valeurs pour votre isolant.

Pour trouver l'épaisseur nécessaire à partir d'un objectif, on retourne la formule : **e = R × λ**. Pour R 7 à λ 0,040, il faut 0,28 m, soit 28 cm. Le tableau d'[épaisseur d'isolant](/fr/epaisseur-isolant) donne ces valeurs pour R 1 à R 8.

### Plusieurs couches

Quand plusieurs couches se superposent, leurs résistances s'additionnent : **R total = R1 + R2 + …**

Exemple : 10 cm d'ancienne laine de verre légère dans des combles. Les règles Th-Bat lui attribuent un λ d'environ 0,047, soit R = 0,10 / 0,047 ≈ 2,13. Si l'on ajoute 30 cm de laine neuve à λ 0,040 (R 7,5), on obtient R 9,63 au total.

Attention : pour les primes CEE, seul le nouvel isolant compte. Dans cet exemple, c'est sa résistance de 7,5 qui est comparée au seuil de R 7, pas le total.

## Du R au coefficient U

Le **coefficient U** (ou Up) mesure le flux de chaleur qui traverse un mètre carré de paroi pour un degré d'écart entre intérieur et extérieur. Il s'exprime en W/(m²·K) ; plus il est faible, mieux la paroi isole.

- Pour une couche seule, **U = 1 / R**. C'est la conversion directe faite par l'outil : R 4 donne U = 0,25 W/(m²·K).
- Pour une paroi complète, il faut ajouter les résistances superficielles intérieure (Rsi) et extérieure (Rse) ainsi que celle du support : **U = 1 / (Rsi + somme des R + Rse)**.

Valeurs conventionnelles des règles Th-Bat :

| Paroi | Rsi | Rse | Rsi + Rse |
|---|---|---|---|
| Mur, flux horizontal | 0,13 | 0,04 | 0,17 |
| Toiture ou plafond, flux ascendant | 0,10 | 0,04 | 0,14 |
| Plancher sur l'extérieur, flux descendant | 0,17 | 0,04 | 0,21 |

Exemple : un mur isolé avec R 3,7 de nouvel isolant. Isolant seul : U = 1 / 3,7 ≈ 0,27 W/(m²·K). Avec les résistances superficielles : U = 1 / (3,7 + 0,17) ≈ 0,26 W/(m²·K), et un peu moins encore une fois le mur porteur compté. Sur une paroi bien isolée, l'écart reste faible.

## Pourquoi la France parle de R et d'autres pays de U

En France, les aides CEE et le minimum réglementaire en rénovation sont exprimés en **résistance thermique R**, ce qui rend le calcul simple : il suffit de comparer le R de l'isolant au seuil. En Allemagne et au Royaume-Uni, les exigences portent sur le **coefficient U de la paroi entière** ; nos calculateurs pour ces pays tiennent donc compte de la structure du mur ou de la toiture. Aux États-Unis, la valeur R est exprimée dans une autre unité (ft²·°F·h/Btu) : divisez-la par 5,678 pour obtenir des m²·K/W.

## Lambdas des isolants utilisés par nos calculateurs

| Isolant | λ en W/(m·K) |
|---|---|
| Laine de verre pour combles (rouleau) | 0,040 |
| Laine de verre pour murs et rampants (rouleau) | 0,032 |
| Laine de roche (rouleau) | 0,040 |
| Laine de verre à souffler | 0,046 |
| Ouate de cellulose en vrac | 0,040 |
| Fibre de bois souple | 0,036 |
| Polystyrène expansé | 0,038 |
| Polyuréthane PU/PIR | 0,022 |

Ces valeurs sont celles des produits retenus dans nos calculs ; un autre produit de la même famille peut avoir un lambda différent. Fiez-vous toujours à la fiche technique de l'isolant que vous achetez.

Pour aller plus loin, le [calculateur d'isolation](/fr) convertit directement une résistance visée en nombre de rouleaux, de panneaux ou de sacs. Les seuils à atteindre sont détaillés sur la page [exigences MaPrimeRénov' et CEE](/fr/exigences-maprimerenov-cee).

## Sources

- [Règles Th-Bat 2020 (version consolidée 2026) — résistances superficielles, λ des isolants en place](https://rt-re-batiment.developpement-durable.gouv.fr/IMG/pdf/2026-04-29_regles_th-bat.pdf)
- [Exigences réglementaires pour les travaux de rénovation (ministère, juillet 2023)](https://rt-re-batiment.developpement-durable.gouv.fr/IMG/pdf/fiche-exigences-reglementaires-renovation.pdf)
- [Isover — fiche produit IBR revêtu kraft](https://www.chausson.fr/materiaux/rouleau-laine-de-verre-pour-combles-perdus-et-plafonds-ibr-revetu-kraft-isover-r-2-50-m2-k-w-8-00-m-x-1-20-m-ep-100-mm-p-1113-1)
- [Recticel — Eurothane Mur](https://www.recticelinsulation.com/fr/product/eurothane-mur)
