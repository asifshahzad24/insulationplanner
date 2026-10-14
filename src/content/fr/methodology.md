---
title: "Méthodologie du calculateur d'isolation : calculs et sources"
description: "Comment le calculateur estime épaisseurs, rouleaux, sacs et coûts : unités SI, seuils CEE et réglementaires, tableaux des fabricants, tassement Th-Bat et limites."
h1: "Méthodologie : comment fonctionne le calculateur"
nav: "Méthodologie"
intro: "Les formules, les données et les hypothèses utilisées par le calculateur pour la France, avec leurs sources et leurs limites."
---
## Unités et principe général

Tous les calculs sont faits en unités du Système international : longueurs en millimètres, surfaces en m², résistances thermiques en m²·K/W, conductivités en W/(m·K). Les résultats ne sont arrondis qu'à l'affichage (centimètres, nombre entier de colis, euros).

Le cœur du calcul est la relation **R = e / λ** : la résistance thermique d'une couche d'isolant est son épaisseur divisée par sa conductivité. Les résistances de couches superposées s'additionnent.

## Les objectifs : la résistance de l'isolant

En France, les exigences s'expriment en **résistance thermique R**. Le calculateur compare donc la résistance de l'isolant (existant et nouveau) à l'objectif choisi. Deux objectifs sont proposés :

- **Niveau aides (CEE).** Seuils des fiches BAR-EN-101, BAR-EN-102 et BAR-EN-103 : R ≥ 7 en combles perdus, R ≥ 6 en rampants, R ≥ 3,7 pour les murs, R ≥ 3 pour le plancher bas. Ces fiches ne comptent que le **nouvel isolant** : le calculateur lui demande d'atteindre le seuil à lui seul, quel que soit l'isolant déjà en place. L'objectif total affiché vaut donc R existant + seuil.
- **Minimum réglementaire.** Valeurs de l'arrêté du 3 mai 2007 modifié, en vigueur depuis le 1er janvier 2023, par zone climatique. Ici, l'isolant existant est déduit de l'objectif. La zone H1, H2 ou H3 est déduite du département choisi, d'après l'annexe 1 de la méthode 3CL-DPE.

Le texte réglementaire porte sur la résistance de la paroi isolée. Le calculateur n'additionne que les couches d'isolant et ignore la résistance du support (plancher, mur, plaque de plâtre), ce qui place le résultat du côté de la sécurité.

## L'isolant existant

Vous pouvez décrire l'isolant en place de trois façons :

- **par son type et son épaisseur** : sa résistance est calculée avec un lambda par défaut tiré des règles Th-Bat ;
- **par son R**, utilisé tel quel ;
- **par un coefficient U**, converti en R = 1 / U, sans retrancher les résistances superficielles.

Lambdas par défaut :

| Isolant en place | λ retenu, en W/(m·K) | Tassement appliqué |
|---|---|---|
| Laine minérale (rouleaux, panneaux) | 0,040 | — |
| Ancienne laine de verre légère | 0,047 | — |
| Laine minérale soufflée | 0,056 | 5 % |
| Ouate de cellulose soufflée | 0,046 | 30 % |
| Fibres de bois soufflées | 0,051 | 35 % |
| Vermiculite en vrac | 0,085 | — |

Pour les isolants soufflés existants, la résistance vaut R = e × (1 − tassement) / λ, selon les coefficients de Th-Bat. La vermiculite déclenche un avertissement, car elle peut contenir de l'amiante.

## Rouleaux et panneaux

Chaque produit est décrit par ses épaisseurs commerciales, le R déclaré par le fabricant pour chacune et la surface couverte par rouleau, colis ou panneau. Le calculateur teste toutes les combinaisons d'une à trois couches et retient, parmi celles qui atteignent l'objectif :

1. celle qui compte le **moins de couches** ;
2. à égalité, la **pile la plus fine** ;
3. puis celle qui demande le moins de colis, et enfin la moins chère.

Le nombre de colis de chaque couche vaut : surface × (1 + chutes) ÷ surface d'un colis, arrondi à l'unité supérieure. Les résistances utilisées sont les R déclarés par les fabricants, et non un calcul e / λ.

## Isolants soufflés

Pour la laine de verre à souffler et la ouate de cellulose, le calculateur s'appuie sur les **tableaux de couverture des fabricants** :

- Isover Comblissimo (sac de 17,3 kg, λ 0,046) ;
- Soprema Univercell Cristal (sac de 12,5 kg, λ 0,040).

Pour une résistance donnée, ces tableaux indiquent la surface couverte par sac, l'épaisseur à souffler et l'épaisseur après tassement. Entre deux lignes, le calculateur **interpole linéairement**. Hors du tableau, il calcule à partir de la physique : épaisseur tassée = R × λ, nombre de sacs = surface × épaisseur tassée × densité tassée ÷ poids du sac (11,8 kg/m³ pour la laine de verre, 25 kg/m³ pour la ouate), et hauteur à souffler = épaisseur tassée × (1 + tassement), avec 2,5 % pour la laine de verre et 25 % pour la ouate.

## Chutes

Le calculateur ajoute **10 % de chutes** par défaut à la surface saisie. Vous pouvez modifier ce taux dans « Plus d'options ».

## Prix

Les prix sont des **prix publics TTC relevés en octobre 2026**, principalement chez Brico Dépôt, Leroy Merlin et Castorama. Lorsque l'enseigne affiche un prix au m², il est converti en prix par colis. Le prix du polystyrène en 14 et 20 cm est extrapolé au prorata de l'épaisseur à partir des prix relevés en 8 à 10 cm. Les montants ne couvrent que le matériau : ni outillage, ni accessoires (ossature, membrane, parement), ni main-d'œuvre. Pour les isolants soufflés, vous pouvez saisir votre propre prix par sac.

Les prix de pose professionnelle cités dans nos articles proviennent de guides de prix grand public publiés en 2026. Ce sont des fourchettes larges, données à titre indicatif.

## Limites connues

- **Altitude en zone H3.** Au-dessus de 800 m, la réglementation applique les valeurs de la zone H2. Le calculateur suppose toujours une altitude inférieure à 800 m en zone H3.
- **Ponts thermiques.** Ils ne sont pas modélisés pour les objectifs français, exprimés en résistance de l'isolant en partie courante.
- **Profondeur disponible.** Le calculateur ne vérifie pas que l'épaisseur tient entre les chevrons ou dans une ossature.
- **Mise en œuvre.** Les DTU, avis techniques et notices des fabricants priment sur nos estimations, tout comme les contraintes locales (urbanisme, humidité, sécurité incendie). Aucune vérification hygrothermique n'est faite.
- **Aides.** Le calculateur vérifie les seuils de résistance, pas l'éligibilité complète aux aides (entreprise RGE, ressources, calendrier, conditions des fiches).
- **Données datées.** Les fiches CEE annoncent leur abrogation au 1er mai 2027, et les prix évoluent. La date de mise à jour figure en bas de chaque page.

## Les autres pays

Les sections Royaume-Uni et Allemagne utilisent une **méthode par coefficient U** : l'exigence porte sur la paroi entière, et le calculateur retranche les résistances superficielles et celle de la structure, en tenant compte de la part d'ossature bois. La section États-Unis utilise les valeurs R américaines par zone climatique.

Une erreur, une source plus récente ? Écrivez-nous : info@loftinsulationcalc.com. Voir aussi la page [à propos](/fr/a-propos).

## Sources

- [Exigences réglementaires pour les travaux de rénovation (ministère, juillet 2023) — arrêté du 3 mai 2007 modifié](https://rt-re-batiment.developpement-durable.gouv.fr/IMG/pdf/fiche-exigences-reglementaires-renovation.pdf)
- [Arrêté du 22 mars 2017 modifiant l'arrêté du 3 mai 2007 (JORF n°0072)](https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000034271631/)
- [Fiche CEE BAR-EN-101 — Isolation de combles ou de toitures (v. A64.6)](https://atee.fr/system/files/2024-11/BAR-EN-101%20vA64-6%20%C3%A0%20compter%20du%2001-01-2025_4.pdf)
- [Fiche CEE BAR-EN-102 — Isolation des murs (v. A65.4)](https://atee.fr/system/files/2026-07/BAR-EN-102%20vA65-4%20%C3%A0%20compter%20du%2001-01-2025.pdf)
- [Fiche CEE BAR-EN-103 — Isolation d'un plancher (v. A64.6)](https://atee.fr/system/files/2024-11/BAR-EN-103%20vA64-6%20%C3%A0%20compter%20du%2001-01-2025_0.pdf)
- [Méthode 3CL-DPE 2021, annexe 1 §18.1 — zones climatiques par département](https://rt-re-batiment.developpement-durable.gouv.fr/IMG/pdf/consolide_annexe_1_arrete_du_31_03_2021_relatif_aux_methodes_et_procedures_applicables.pdf)
- [Règles Th-Bat 2020 (version consolidée 2026)](https://rt-re-batiment.developpement-durable.gouv.fr/IMG/pdf/2026-04-29_regles_th-bat.pdf)
- [Isover — fiche technique Comblissimo (24/04/2026)](https://medias.groupe-samse.fr/Fiche_technique/Fiche_technique_423944.pdf)
- [Soprema — fiche technique Univercell Cristal](https://www.soprema.fr/produits-et-systemes/univercell-cristal)
- [Isover — fiche produit IBR revêtu kraft](https://www.chausson.fr/materiaux/rouleau-laine-de-verre-pour-combles-perdus-et-plafonds-ibr-revetu-kraft-isover-r-2-50-m2-k-w-8-00-m-x-1-20-m-ep-100-mm-p-1113-1)
- [Isover — fiche produit GR 32 roulé revêtu kraft](https://www.chausson.fr/materiaux/rouleau-laine-de-verre-pour-murs-maconnes-gr-32-revetu-kraft-isover-r-3-15-m2-k-w-2-70-m-x-1-20-m-ep-100-mm-p-148603-1)
- [ROCKWOOL — Roulrock kraft](https://www.rockwool.com/fr/produits/roulrock-kraft/)
- [STEICOflex 036 — fiche technique](https://www.steico.com/fr/produit/isolation/isolation-entre-ossatures/isolants-semi-rigides/steicoflex-f-036)
- [Recticel — Eurothane Mur](https://www.recticelinsulation.com/fr/product/eurothane-mur)
- [Knauf — Therm ITEx Th38 SE](https://knauf.com/fr-FR/p/produit/knauf-therm-itex-th38-se-22190_4091)
- [Brico Dépôt — laine de verre (prix TTC)](https://www.bricodepot.fr/produits/materiau-et-gros-oeuvre/isolation-et-cloison/laine-de-verre)
- [Selectra — Isolation des combles : coût 2026](https://selectra.info/energie/actualites/marche/isolation-combles-cout-2026-par-ou-commencer)
