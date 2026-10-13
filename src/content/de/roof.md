---
title: "Dach dämmen: Zwischensparren- & Untersparren-Rechner"
description: "Dachdämmung berechnen: Zwischensparrendämmung je Sparrenhöhe, Untersparrendämmung, Rollen und Kosten. Mit U-Wert 0,24 nach GModG/GEG und 0,14 für die BEG."
h1: "Dach dämmen – Rechner für Zwischen- und Untersparrendämmung"
nav: "Dachschräge"
intro: "Sparrenhöhe wählen, Dachfläche eingeben: Der Rechner zeigt, ob die Dämmung zwischen den Sparren für U 0,24 reicht oder ob zusätzlich unter den Sparren gedämmt werden muss."
faqs:
  - q: "Wie dick muss die Dachdämmung sein?"
    a: "Zwischen den Sparren braucht Klemmfilz mit WLS 035 in unserer Rechnung 18 cm, um U 0,24 W/(m²·K) nach GModG (ehemals GEG) zu erreichen. Das setzt mindestens 18 cm hohe Sparren voraus. Für die BEG-Förderung (U 0,14) sind bei 16 cm hohen Sparren 16 cm dazwischen und 12 cm darunter nötig."
  - q: "Was tun, wenn die Sparren zu niedrig sind?"
    a: "Sie können zusätzlich unter den Sparren dämmen oder die Sparren aufdoppeln. Ist die Dicke technisch begrenzt, gilt die Anforderung nach Anlage 7 GModG auch als erfüllt, wenn die höchstmögliche Dicke mit λ 0,035 eingebaut wird. Ob das in Ihrem Fall greift, klären Sie mit Fachbetrieb oder Energieberater."
  - q: "Was kostet eine Zwischensparrendämmung?"
    a: "Laut co2online kostet eine Zwischensparrendämmung mit Montage etwa 55–150 €/m², eine Untersparrendämmung 30–80 €/m². Wer selbst dämmt, zahlt für 60 m² mit 16 cm Klemmfilz WLS 035 an Material 780 € bis 860 €."
  - q: "Brauche ich bei der Dachdämmung eine Dampfbremse?"
    a: "Ja. Auf der warmen Raumseite muss eine luftdichte Ebene liegen, meist eine Dampfbremsbahn, die an allen Stößen, Wänden und Durchdringungen verklebt ist. Sonst zieht feuchte Raumluft in die Dämmung."
  - q: "Reicht eine Zwischensparrendämmung für die BEG-Förderung?"
    a: "Bei üblichen Sparrenhöhen meist nicht. Selbst 24 cm Klemmfilz WLS 035 zwischen den Sparren erreichen wegen des Holzanteils nur U 0,18. Für U 0,14 braucht es zusätzlich eine durchgehende Schicht unter oder auf den Sparren."
---
## So rechnet der Dach-Rechner

Wer den Dachraum bewohnt, dämmt nicht die oberste Geschossdecke, sondern die Dachschräge. Meist kommt die Dämmung zwischen die Sparren. Das Problem: Die Sparren selbst sind aus Holz, und Holz dämmt deutlich schlechter als Dämmstoff.

Der Rechner ermittelt den U-Wert der Dachschräge nach

**U = 1 / (Rsi + Σ d/λ + Rse)**

- **Übergangswiderstände:** 0,10 m²·K/W innen. Bei einem hinterlüfteten Dach zählen die Schichten außerhalb der Lüftungsebene nicht mit, außen wird ebenfalls mit 0,10 gerechnet (DIN EN ISO 6946).
- **Restaufbau:** Für die Innenbekleidung setzt der Rechner pauschal R 0,05 an. Ein ungedämmtes Dach hat damit U 4,00 W/(m²·K).
- **Holzanteil:** In der Sparrenebene rechnet der Rechner mit 11 % Holz (λ 0,13 W/(m·K)) und 89 % Dämmstoff, nach Flächenanteilen gewichtet. Bei Klemmfilz WLS 035 ergibt das ein wirksames λ von 0,89 × 0,035 + 0,11 × 0,13 = 0,0455. 16 cm zwischen den Sparren bringen deshalb nicht R 4,57, sondern nur R 3,52.
- **Sparrenhöhe:** Unter „Weitere Optionen“ stellen Sie die Hohlraumtiefe ein, von 12 bis 24 cm. Voreingestellt sind 16 cm. Mehr Dämmung als Platz zwischen den Sparren rechnet der Rechner nicht ein, er zeigt dann einen Hinweis.
- **Nicht begrenzt:** Wählen Sie diese Option, rechnet der Rechner die ersten 16 cm mit Holzanteil und alles darüber hinaus als durchgehende Schicht. Das entspricht einer Zwischensparrendämmung mit einer Untersparrendämmung darunter.
- **Bemessungswert:** Bei Holzfaser-Dämmmatten mit λD 0,036 zählt der Bemessungswert λB 0,038.
- **WLS/WLG:** WLS 035 heißt λ = 0,035 W/(m·K). Klemmfilz mit WLS 032 holt aus derselben Sparrenhöhe etwas mehr heraus.

## Rechenbeispiel: 60 m² Dachschräge

60 m² Dachfläche, 10 % Verschnitt (66 m²), Glaswolle-Klemmfilz WLS 035, sofern nicht anders angegeben:

| Sparrenhöhe | Ziel | Aufbau | Einkaufen | Materialkosten | U danach |
|---|---|---|---|---|---|
| 12 cm | GModG, U ≤ 0,24 | 12 cm zwischen den Sparren | 13 Rollen | 577 € – 651 € | 0,35 |
| 16 cm | GModG, U ≤ 0,24 | 16 cm zwischen den Sparren | 16 Rollen | 780 € – 860 € | 0,27 |
| 16 cm | GModG, U ≤ 0,24 | 16 cm Klemmfilz WLS 032 | 22 Rollen | 1.141 € – 1.339 € | 0,25 |
| 20 cm | GModG, U ≤ 0,24 | 18 cm zwischen den Sparren | 18 Rollen | 871 € – 1.105 € | 0,24 |
| 24 cm | BEG, U ≤ 0,14 | 2 × 12 cm zwischen den Sparren | 26 Rollen | 1.153 € – 1.303 € | 0,18 |
| 16 cm, nicht begrenzt | BEG, U ≤ 0,14 | 16 cm zwischen + 12 cm unter den Sparren | 29 Rollen | 1.356 € – 1.511 € | 0,14 |

Das Beispiel zeigt das typische Problem: Bei 12 oder 16 cm hohen Sparren erreicht die Zwischensparrendämmung allein den Grenzwert 0,24 nicht, selbst mit WLS 032. Holzfaser mit 16 cm (32 Pakete, 1.143 €) kommt auf U 0,28. Erst ab etwa 18 cm Dämmung zwischen den Sparren klappt es. Für das Förderziel 0,14 reicht auch eine Sparrenhöhe von 24 cm nicht, hier ist eine zweite, durchgehende Dämmebene nötig.

Laut co2online kostet die Zwischensparrendämmung mit Montage etwa **55–150 €/m²**, die Untersparrendämmung **30–80 €/m²**.

### Wenn die Sparrenhöhe nicht reicht

Nach Anlage 7 GModG (ehemals GEG) gilt die Anforderung als erfüllt, wenn die Dämmdicke technisch begrenzt ist und die höchstmögliche Dicke mit λ 0,035 eingebaut wird, bei Einblasdämmung oder nachwachsenden Rohstoffen mit λ 0,045. Ob die Sparrenhöhe in Ihrem Fall als technische Grenze gilt oder ob eine Untersparrendämmung zumutbar ist, klären Sie am besten mit dem Fachbetrieb oder einem Energieberater.

## Zwischensparren, Untersparren oder Aufsparren?

- **Zwischensparrendämmung:** Klemmfilz oder Holzfasermatten werden zwischen die Sparren geklemmt. Die Dicke ist durch die Sparrenhöhe begrenzt. Sparren lassen sich mit Kanthölzern aufdoppeln, das kostet aber Raum.
- **Untersparrendämmung:** Eine zweite, durchgehende Schicht unter den Sparren, meist zwischen einer Querlattung. Sie überdeckt die Sparren und verringert so die Wärmebrücke. Gleichzeitig entsteht Platz für Leitungen vor der luftdichten Ebene. Dafür gehen einige Zentimeter Raumhöhe verloren. Die Lattung hat ebenfalls einen Holzanteil, den der Rechner nicht gesondert berücksichtigt.
- **Aufsparrendämmung:** Die Dämmung liegt außen über den Sparren und wird meist bei einer Neueindeckung eingebaut. Das bildet der Rechner nicht ab.

## Luftdichtheit und Hinterlüftung

- **Luftdichte Ebene:** Auf der warmen Seite, also raumseitig, gehört eine Dampfbremse, die an allen Stößen, an Wänden, Fenstern und Durchdringungen dauerhaft verklebt ist. Schon kleine Lücken lassen feuchte Raumluft in die Dämmung.
- **Hinterlüftung:** Ältere Dächer ohne diffusionsoffene Unterdeckung brauchen oft eine Belüftungsebene zwischen Dämmung und Dacheindeckung. Dann können Sie nicht die volle Sparrenhöhe füllen. Stellen Sie in diesem Fall die verbleibende Tiefe als Hohlraumtiefe ein.
- **Feuchteschutz:** Einen Tauwassernachweis ersetzt der Rechner nicht. Bei Holzfaser, feuchtevariablen Bahnen oder unklarer Unterdeckung hilft der Fachbetrieb.

## Alte Mineralwolle und Asbest

Wer ein altes Dach öffnet, stößt oft auf alte Dämmung. Mineralwolle aus der Zeit vor 1996 kann krebserzeugende Fasern freisetzen. Der Rückbau ist in der TRGS 521 geregelt und gehört in die Hände eines Fachbetriebs. Alte Faserzementplatten können Asbest enthalten. Dann gilt die TRGS 519, auch für Privatleute.

Ist der Dachboden nicht ausgebaut, dämmen Sie günstiger die [oberste Geschossdecke](/de/oberste-geschossdecke-daemmen). Alle Grenzwerte finden Sie unter [GEG- und BEG-Anforderungen](/de/geg-beg-anforderungen). Den U-Wert eines eigenen Aufbaus rechnen Sie mit dem [U-Wert-Rechner](/de/u-wert-rechner) nach, und die Dicke je Dämmstoff zeigt die Tabelle unter [Dämmstärke berechnen](/de/daemmstaerke-berechnen).

## Quellen

- [GModG (ehem. GEG) Anlage 7 – Höchstwerte der Wärmedurchgangskoeffizienten](https://www.gesetze-im-internet.de/geg/anlage_7.html)
- [§ 37 GModG – Berechnung des Wärmedurchgangskoeffizienten](https://www.gesetze-im-internet.de/geg/__37.html)
- [Förderrichtlinie BEG EM vom 17. Juli 2026](https://www.ingenieurkammer.de/fileadmin/dokumente/Downloads_PDF/News_Dokumente/20260717_F%C3%B6rderrichtlinie_BEG_EM.pdf)
- [KfW/BAFA – BEG EM Technische FAQ, Version 7.0 (06/2026)](https://www.kfw.de/PDF/Download-Center/F%C3%B6rderprogramme-%28Inlandsf%C3%B6rderung%29/PDF-Dokumente/6000004864_BEG_TFAQ_EM.pdf)
- [Wärmeübergangswiderstände nach DIN EN ISO 6946 (Übersicht)](https://de.wikipedia.org/wiki/W%C3%A4rme%C3%BCbergangswiderstand)
- [OBI – Klemmfilz (Preise, Paketinhalte)](https://www.obi.de/search/klemmfilz/)
- [OBI – Rockwool Klemmrock WLG 035](https://www.obi.de/p/8266256/rockwool-klemmrock-daemmwolle-klemmfilz-wlg-035-160-mm-steinwolle)
- [STEICO – STEICOflex 036 Lieferformen](https://www.steico.com/de/produkte/daemmung/gefachdaemmung/flexible-waermedaemmung/steicoflex-036)
- [Verbraucherzentrale – Wärmedämmung richtig anpacken (Stand 28.09.2026)](https://www.verbraucherzentrale.de/wissen/energie/energetische-sanierung/tipps-so-packen-sie-die-waermedaemmung-richtig-an-40001)
