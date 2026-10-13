---
title: "U-Wert-Rechner: U-Wert berechnen und R-Wert umrechnen"
description: "U-Wert berechnen: Rechner für R-Wert, U-Wert und Dämmdicke mit λ. Mit der Formel U = 1/(Rsi + Σ d/λ + Rse), Übergangswiderständen und zwei Rechenbeispielen."
h1: "U-Wert-Rechner – R-Wert und U-Wert umrechnen"
nav: "U-Wert-Rechner"
intro: "Rechnen Sie R-Wert und U-Wert ineinander um oder ermitteln Sie aus Dicke und Wärmeleitfähigkeit λ den R-Wert einer Dämmschicht."
faqs:
  - q: "Wie berechnet man den U-Wert?"
    a: "Teilen Sie die Dicke jeder Schicht in Metern durch ihre Wärmeleitfähigkeit λ, addieren Sie alle Werte und die Wärmeübergangswiderstände Rsi und Rse. Der Kehrwert dieser Summe ist der U-Wert: U = 1 / (Rsi + Σ d/λ + Rse)."
  - q: "Wie rechne ich einen R-Wert in einen U-Wert um?"
    a: "U = 1 / R. Das gilt aber nur für den Gesamtwiderstand des Bauteils mit Rsi und Rse. Der R-Wert einer einzelnen Dämmschicht ergibt nur einen groben Näherungswert für den U-Wert."
  - q: "Welche Werte gelten für Rsi und Rse?"
    a: "Nach DIN EN ISO 6946 ist Rsi 0,13 m²·K/W bei waagerechtem Wärmestrom (Wand), 0,10 bei Wärmestrom nach oben (Dach, Decke) und 0,17 nach unten (Kellerdecke). Außen gilt Rse 0,04. Grenzt das Bauteil an einen unbeheizten Raum oder eine Lüftungsebene, wird außen wie innen gerechnet."
  - q: "Was ist ein guter U-Wert für eine Außenwand?"
    a: "Wer die Außenwand erneuert, muss nach Anlage 7 GModG (ehemals GEG) höchstens U 0,24 W/(m²·K) erreichen. Für die BEG-Förderung sind 0,20 nötig. Eine ungedämmte Mauerwerkswand liegt nach den amtlichen Pauschalwerten bei rund 1,4."
  - q: "Wie dick muss die Dämmung für U 0,20 an der Außenwand sein?"
    a: "Auf einer ungedämmten Wand mit U 1,4 sind es im Rechner 16 cm EPS mit WLS 035 (U danach 0,19) oder 14 cm graues EPS mit WLS 032 (U 0,20). Rechnerisch reichen 15,0 cm WLS 035."
---
## So berechnen Sie den U-Wert

Der U-Wert (Wärmedurchgangskoeffizient) gibt an, wie viel Wärme in Watt pro Quadratmeter und Grad Temperaturunterschied durch ein Bauteil geht. Je kleiner, desto besser. Er wird in drei Schritten berechnet:

1. **Widerstand jeder Schicht:** R = d / λ, mit der Dicke d in Metern und der Wärmeleitfähigkeit λ in W/(m·K). 20 cm Dämmung mit λ 0,035 ergeben 0,20 / 0,035 = 5,71 m²·K/W.
2. **Alles addieren:** die Widerstände aller Schichten plus die Wärmeübergangswiderstände innen (Rsi) und außen (Rse).
3. **Kehrwert bilden:** U = 1 / R(gesamt).

Zusammen ergibt das die Formel **U = 1 / (Rsi + Σ d/λ + Rse)**. So steht es auch in § 37 GModG (ehemals GEG), der für die Berechnung auf DIN 4108-4 und DIN EN ISO 6946 verweist.

### Wärmeübergangswiderstände nach DIN EN ISO 6946

| Bauteil, Richtung des Wärmestroms | Rsi in m²·K/W | Rse in m²·K/W |
|---|---|---|
| Außenwand (waagerecht) | 0,13 | 0,04 |
| Dach und Decke (nach oben) | 0,10 | 0,04 |
| Kellerdecke (nach unten) | 0,17 | 0,04 |

Grenzt das Bauteil nicht an Außenluft, sondern an einen unbeheizten Raum oder eine belüftete Schicht, wird außen der gleiche Wert wie innen angesetzt. Deshalb rechnet unser [Dämmungsrechner](/de) bei der obersten Geschossdecke und der Dachschräge mit 0,10 auf beiden Seiten und bei der Kellerdecke mit 0,17 auf beiden Seiten.

### So funktioniert das Werkzeug oben

- **Links** rechnen Sie R-Wert und U-Wert ineinander um, U = 1 / R. Setzen Sie hier den Gesamtwiderstand mit Rsi und Rse ein, wenn Sie den U-Wert eines Bauteils wollen. Das Feld für den US-R-Wert brauchen Sie nur für amerikanische Produktangaben.
- **Rechts** geben Sie λ und die Dicke in Millimetern ein und erhalten den R-Wert der Schicht.

## Rechenbeispiel 1: Außenwand mit WDVS

Eine ungedämmte Mauerwerkswand mit dem amtlichen Pauschal-U-Wert 1,4 W/(m²·K) bekommt 14 cm EPS mit WLS 035.

- Bestehende Wand inklusive Rsi und Rse: 1 / 1,4 = 0,714 m²·K/W
- Neue Dämmung: 0,14 / 0,035 = 4,000 m²·K/W
- Summe: 4,714 m²·K/W
- **U = 1 / 4,714 = 0,21 W/(m²·K)**

Das unterschreitet den Grenzwert 0,24 nach GModG. Der [WDVS-Rechner](/de/aussenwand-daemmen) kommt für dieselbe Wand auf dasselbe Ergebnis und zählt dazu die Pakete.

## Rechenbeispiel 2: Dachschräge mit Holzanteil

Zwischen 16 cm hohen Sparren liegt Klemmfilz WLS 035. Etwa 11 % der Fläche sind Holz mit λ 0,13. Diese Ebene ist nicht einheitlich, deshalb wird λ nach Flächenanteilen gemittelt:

- Wirksames λ: 0,89 × 0,035 + 0,11 × 0,13 = 0,0455 W/(m·K)
- Dämmebene: 0,16 / 0,0455 = 3,52 m²·K/W (ohne Sparren wären es 4,57)
- Innenbekleidung: 0,05 m²·K/W
- Rsi + Rse: 0,10 + 0,10 = 0,20 m²·K/W
- **U = 1 / 3,77 = 0,27 W/(m²·K)**

Der Grenzwert 0,24 wird knapp verfehlt. Wie Sie das mit einer Untersparrendämmung lösen, zeigt der [Rechner für die Dachdämmung](/de/dach-daemmen). Die Mittelung über die Flächenanteile ist eine Näherung. Für Nachweise schreibt DIN EN ISO 6946 bei inhomogenen Schichten ein genaueres Verfahren vor.

## λB, λD und die Wärmeleitstufe

- **WLS und WLG:** WLS 035 oder WLG 035 heißt λ = 0,035 W/(m·K). Die Wärmeleitstufe (WLS) ist feiner abgestuft als die ältere Wärmeleitgruppe (WLG).
- **Bemessungswert:** Für U-Wert-Berechnungen in Deutschland gilt der Bemessungswert λB, nicht der Nennwert λD. Bei Holzfaser-Dämmmatten mit λD 0,036 sind das 0,038. 16 cm ergeben damit R 4,21 statt 4,44.
- **Unbekannte alte Dämmung:** Fehlen Angaben, nennt die Bekanntmachung vom 08.10.2020 λ 0,040 für Mineralfaser und Schaumkunststoffe und 0,050 für Einblasdämmung und nachwachsende Rohstoffe.

Welche Dicke Sie für einen bestimmten R-Wert brauchen, zeigt die Tabelle unter [Dämmstärke berechnen](/de/daemmstaerke-berechnen). Die Grenzwerte stehen unter [GEG- und BEG-Anforderungen](/de/geg-beg-anforderungen).

## Was der U-Wert-Rechner nicht berücksichtigt

Der U-Wert beschreibt die ungestörte Fläche. Wärmebrücken an Fensteranschlüssen, Balkonplatten oder Sparren-Fußpunkten, Feuchteschutz und Tauwasser sind nicht enthalten. Für Fenster gelten eigene Kennwerte, die Sie dem Datenblatt des Herstellers entnehmen. Für einen Nachweis nach GModG oder einen Förderantrag brauchen Sie einen Energieberater.

## Quellen

- [§ 37 GModG – Berechnung des Wärmedurchgangskoeffizienten](https://www.gesetze-im-internet.de/geg/__37.html)
- [Wärmeübergangswiderstände nach DIN EN ISO 6946 (Übersicht)](https://de.wikipedia.org/wiki/W%C3%A4rme%C3%BCbergangswiderstand)
- [KfW/BAFA – BEG EM Technische FAQ, Version 7.0 (06/2026)](https://www.kfw.de/PDF/Download-Center/F%C3%B6rderprogramme-%28Inlandsf%C3%B6rderung%29/PDF-Dokumente/6000004864_BEG_TFAQ_EM.pdf)
- [GModG (ehem. GEG) Anlage 7 – Höchstwerte der Wärmedurchgangskoeffizienten](https://www.gesetze-im-internet.de/geg/anlage_7.html)
- [Bekanntmachung der Regeln zur Datenaufnahme im Wohngebäudebestand (08.10.2020) – Pauschal-U-Werte](https://www.gmodg.bund.de/GModG/DE/ErgaenzendeRegelungen/Bekanntmachungen/Bestandsberechnungen/Download/WGDatenaufnahmeGEG_DL.pdf?__blob=publicationFile&v=2)
- [sanier.de – Wärmeleitfähigkeitsgruppen und -stufen](https://www.sanier.de/wissen/waermeleitfaehigkeitsgruppen-und-waermeleitfaehigkeitsstufen)
- [STEICO – STEICOflex 036 Lieferformen](https://www.steico.com/de/produkte/daemmung/gefachdaemmung/flexible-waermedaemmung/steicoflex-036)
