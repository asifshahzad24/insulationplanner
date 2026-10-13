---
title: "Dämmstärke berechnen: Dämmdicke je R-Wert und WLS"
description: "Dämmstärke berechnen: Tabelle mit der nötigen Dämmdicke je R-Wert und Wärmeleitstufe (WLS) für Glaswolle, Steinwolle, Holzfaser, EPS, PUR und Zellulose."
h1: "Dämmstärke berechnen – Tabelle nach R-Wert und WLS"
nav: "Dämmstärke"
intro: "Wie dick muss die Dämmung sein? Die Tabelle zeigt für jeden Dämmstoff, wie viele Zentimeter Sie für einen bestimmten R-Wert brauchen. Darunter erfahren Sie, welchen R-Wert Ihr Bauteil braucht."
faqs:
  - q: "Wie berechne ich die Dämmstärke?"
    a: "Dicke = R-Wert × Wärmeleitfähigkeit λ. Für R 4,0 m²·K/W mit einem Dämmstoff der WLS 035 sind das 4,0 × 0,035 = 0,14 m, also 14 cm. Welchen R-Wert Sie brauchen, hängt vom Ziel-U-Wert und vom vorhandenen Aufbau ab."
  - q: "Wie dick muss die Dämmung für U 0,24 sein?"
    a: "Das hängt vom Bauteil ab. Auf einer ungedämmten massiven obersten Geschossdecke sind mit WLS 035 rechnerisch 12,9 cm nötig, an einer ungedämmten Mauerwerkswand 12,1 cm. Weil Dämmstoffe nur in festen Dicken verkauft werden, wählt der Rechner 16 cm Klemmfilz bzw. 14 cm EPS-Platten."
  - q: "Was bedeutet WLS 035 oder WLG 035?"
    a: "Die Zahl ist die Wärmeleitfähigkeit λ in Tausendstel W/(m·K): WLS 035 und WLG 035 bedeuten beide λ = 0,035. WLG steht für die ältere Wärmeleitgruppe, WLS für die feiner abgestufte Wärmeleitstufe. Je kleiner die Zahl, desto besser dämmt der Stoff."
  - q: "Wie viel dünner ist WLS 032 als WLS 035?"
    a: "Rund 9 %, denn 0,032 / 0,035 = 0,91. Für R 4,0 brauchen Sie 13 statt 14 cm. Ob Sie davon profitieren, hängt von den lieferbaren Dicken ab: Am Dachboden landen beide Varianten für U 0,14 bei 24 cm."
  - q: "Warum rechnet der Rechner bei Holzfaser mit 0,038 statt 0,036?"
    a: "Für U-Wert-Berechnungen in Deutschland zählt der Bemessungswert λB, nicht der Nennwert λD. Bei Holzfaser-Dämmmatten wie STEICOflex 036 liegt der Bemessungswert bei 0,038 W/(m·K). 16 cm erreichen damit R 4,21 statt 4,44."
  - q: "Zählt die vorhandene Dämmung mit?"
    a: "Ja. Nach § 37 GModG (ehemals GEG) zählen beim U-Wert alle Schichten des Bauteils, alte wie neue. Geben Sie die vorhandene Dämmung im Rechner an, dann wird die neue Schicht entsprechend dünner."
---
## So lesen Sie die Tabelle

Jede Dämmschicht hat einen Wärmedurchlasswiderstand R. Er hängt nur von Dicke und Wärmeleitfähigkeit ab:

**R = d / λ** und umgekehrt **d = R × λ**

Die Tabelle oben rechnet das für die Dämmstoffe im Rechner aus. In der ersten Spalte steht der R-Wert der Dämmschicht in m²·K/W, darunter der U-Wert, den diese Schicht **allein** hätte (U ≈ 1/R). Der U-Wert des ganzen Bauteils ist besser, weil Mauerwerk oder Decke und die Wärmeübergangswiderstände Rsi und Rse hinzukommen.

- **Glaswolle und Steinwolle** mit WLS 035 brauchen gleich viel Dicke. Steinwolle ist nicht brennbar, im Baumarkt aber teurer.
- **Holzfaser** steht mit dem Bemessungswert λB 0,038 in der Tabelle und braucht deshalb etwas mehr Dicke.
- **EPS mit λ 0,040** sind die begehbaren Dachboden-Elemente, EPS 035 und 032 die Fassaden- und Kellerdeckenplatten.
- **PUR** mit WLS 027 ist am dünnsten: R 4,0 erreicht es mit 11 cm statt 14 cm bei WLS 035.
- **Zellulose** wird mit λ 0,040 gerechnet und vom Fachbetrieb eingeblasen.

## Welchen R-Wert braucht Ihr Bauteil?

In Deutschland gibt das GModG (ehemals GEG) keinen R-Wert vor, sondern einen U-Wert für das ganze Bauteil. Der Rechner zieht vom Grenzwert ab, was Bauteil und Übergangswiderstände schon leisten. Für ungedämmte Bauteile mit den amtlichen Pauschal-U-Werten ergibt sich:

| Bauteil (U ungedämmt) | Pflicht GModG | rechnerisch mit WLS 035 | Förderung BEG | rechnerisch mit WLS 035 |
|---|---|---|---|---|
| Oberste Geschossdecke, massiv (2,1) | R 3,69 für U 0,24 | 12,9 cm | R 6,67 für U 0,14 | 23,3 cm |
| Außenwand, Mauerwerk (1,4) | R 3,45 für U 0,24 | 12,1 cm | R 4,29 für U 0,20 | 15,0 cm |
| Kellerdecke, Beton (1,6) | R 2,71 für U 0,30 | 9,5 cm | R 3,38 für U 0,25 | 11,8 cm |

Bei der **Dachschräge** kommt der Holzanteil der Sparren hinzu. Für U 0,24 braucht die Dämmebene einen wirksamen R-Wert von 3,92. Mit 11 % Holzanteil sind dafür 18 cm Klemmfilz WLS 035 zwischen den Sparren nötig. Die Tabelle allein reicht hier nicht, nutzen Sie den [Rechner für die Dachdämmung](/de/dach-daemmen).

## Rechenbeispiel: 80 m² Dachboden mit verschiedenen Dämmstoffen

Eine ungedämmte massive oberste Geschossdecke mit 80 m², Ziel U 0,24 nach GModG, 10 % Verschnitt. Rechnerisch reichen 12,9 cm WLS 035, doch gekauft wird, was es gibt:

| Dämmstoff | Dicke | Einkaufen | Kosten | U danach |
|---|---|---|---|---|
| Glaswolle-Klemmfilz WLS 035 | 16 cm | 21 Rollen | 1.023 € – 1.128 € | 0,20 |
| Steinwolle-Klemmfilz WLS 035 | 16 cm | 30 Rollen | 1.754 € – 1.934 € | 0,20 |
| Holzfaser-Dämmmatte (λB 0,038) | 16 cm | 42 Pakete | 1.500 € | 0,21 |
| Begehbares Dachboden-Element (EPS 040) | 16 cm | 176 Platten | 3.518 € | 0,23 |
| Zellulose, eingeblasen vom Fachbetrieb | 15 cm | – | 1.074 € – 2.147 € inkl. Einbau | 0,24 |

Für das Förderziel U 0,14 wird die Rechnung noch deutlicher: Mit Klemmfilz WLS 035 wählt der Rechner zwei Lagen à 12 cm (34 Rollen, 1.508 € bis 1.704 €). Mit WLS 032 sind es 14 + 10 cm, ebenfalls 24 cm, aber 46 Rollen für 2.376 € bis 2.854 €. Der bessere Dämmstoff spart hier keinen Zentimeter, weil die Handelsdicken nicht passen.

## WLS, WLG und Bemessungswert

- **Wärmeleitgruppe (WLG):** die ältere Angabe in Schritten von 0,005, etwa WLG 035 oder WLG 040.
- **Wärmeleitstufe (WLS):** die neuere, feiner abgestufte Angabe in Schritten von 0,001, etwa WLS 032. Die Zahl ist in beiden Fällen λ in Tausendstel W/(m·K).
- **Bemessungswert λB:** Für den Nachweis in Deutschland zählt der Bemessungswert. Er kann über dem Nennwert λD liegen, den viele Hersteller groß auf die Verpackung drucken. Holzfaser mit λD 0,036 hat zum Beispiel λB 0,038.
- **Alte Dämmung:** Ist die Wärmeleitfähigkeit vorhandener Dämmung unbekannt, rechnet der Rechner mit Erfahrungswerten, zum Beispiel λ 0,045 für alte Mineralwolle aus der Zeit vor 1996.

## Typische Fehler beim Dämmstärke berechnen

- **Mit dem Nennwert rechnen:** Wer λD statt λB einsetzt, plant zu dünn.
- **Holzanteil vergessen:** Zwischen Sparren und Balken dämmt das Holz schlechter als der Dämmstoff.
- **Dämmung zusammendrücken:** Eine Matte, die unter einem Laufsteg zusammengepresst wird, verliert an Dicke und damit an R-Wert.
- **Nur die Dämmschicht ansehen:** Der Grenzwert gilt für den U-Wert des ganzen Bauteils. Den rechnen Sie mit dem [U-Wert-Rechner](/de/u-wert-rechner) nach.

Die Grenzwerte im Überblick finden Sie unter [GEG- und BEG-Anforderungen](/de/geg-beg-anforderungen). Für konkrete Mengen nutzen Sie den [Dämmungsrechner](/de) oder die Rechner für [oberste Geschossdecke](/de/oberste-geschossdecke-daemmen), [Außenwand](/de/aussenwand-daemmen) und [Kellerdecke](/de/kellerdecke-daemmen).

## Quellen

- [sanier.de – Wärmeleitfähigkeitsgruppen und -stufen](https://www.sanier.de/wissen/waermeleitfaehigkeitsgruppen-und-waermeleitfaehigkeitsstufen)
- [STEICO – STEICOflex 036 Lieferformen](https://www.steico.com/de/produkte/daemmung/gefachdaemmung/flexible-waermedaemmung/steicoflex-036)
- [§ 37 GModG – Berechnung des Wärmedurchgangskoeffizienten](https://www.gesetze-im-internet.de/geg/__37.html)
- [GModG (ehem. GEG) Anlage 7 – Höchstwerte der Wärmedurchgangskoeffizienten](https://www.gesetze-im-internet.de/geg/anlage_7.html)
- [Förderrichtlinie BEG EM vom 17. Juli 2026](https://www.ingenieurkammer.de/fileadmin/dokumente/Downloads_PDF/News_Dokumente/20260717_F%C3%B6rderrichtlinie_BEG_EM.pdf)
- [Bekanntmachung der Regeln zur Datenaufnahme im Wohngebäudebestand (08.10.2020) – Pauschal-U-Werte](https://www.gmodg.bund.de/GModG/DE/ErgaenzendeRegelungen/Bekanntmachungen/Bestandsberechnungen/Download/WGDatenaufnahmeGEG_DL.pdf?__blob=publicationFile&v=2)
- [OBI – Klemmfilz (Preise, Paketinhalte)](https://www.obi.de/search/klemmfilz/)
- [OBI – Rockwool Klemmrock WLG 035](https://www.obi.de/p/8266256/rockwool-klemmrock-daemmwolle-klemmfilz-wlg-035-160-mm-steinwolle)
