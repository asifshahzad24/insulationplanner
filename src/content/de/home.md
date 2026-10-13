---
title: "Dämmungsrechner: Dämmstärke, U-Wert & Kosten berechnen"
description: "Kostenloser Dämmungsrechner: Dämmung berechnen für Dachboden, Dach, Außenwand und Kellerdecke – mit Dämmstärke, U-Wert nach GModG/GEG oder BEG und Kosten."
h1: "Dämmungsrechner – Dämmstärke und Kosten berechnen"
nav: "Dämmungsrechner"
intro: "Fläche eingeben, vorhandene Dämmung angeben, Ziel wählen: Der Rechner zeigt, wie viele Zentimeter Sie brauchen, wie viele Rollen oder Platten und was das Material ungefähr kostet."
faqs:
  - q: "Wie berechne ich die richtige Dämmstärke?"
    a: "Ausgangspunkt ist der U-Wert, den Ihr Bauteil nach der Sanierung haben soll, zum Beispiel 0,24 W/(m²·K) nach GModG (ehemals GEG). Davon zieht der Rechner den Wärmedurchlasswiderstand des vorhandenen Aufbaus ab. Die Differenz multipliziert mit der Wärmeleitfähigkeit λ ergibt die Dicke, aufgerundet auf die nächste Handelsdicke."
  - q: "Welcher U-Wert gilt nach GEG bei einer Sanierung?"
    a: "Nach Anlage 7 des GModG (ehemals GEG) höchstens 0,24 W/(m²·K) für Außenwand, Steildach und oberste Geschossdecke, 0,20 für Flachdächer und 0,30 für eine von unten gedämmte Kellerdecke. Für die BAFA-Förderung sind die Werte strenger. Die ganze Tabelle steht unter [GEG- und BEG-Anforderungen](/de/geg-beg-anforderungen)."
  - q: "Sind die Kosten inklusive Einbau?"
    a: "Nein, bei Rollen und Platten zeigt der Rechner die Materialkosten zu typischen Baumarktpreisen (OBI, BAUHAUS, toom, hagebau, Stand 14.10.2026), ohne Werkzeug und Arbeitslohn. Ausnahme ist die Einblasdämmung: Sie wird vom Fachbetrieb eingebaut, deshalb sehen Sie dort einen Preis inklusive Einblasen."
  - q: "Wie genau ist der Dämmungsrechner?"
    a: "Die Rechnung folgt dem üblichen Verfahren nach DIN EN ISO 6946 und nutzt Bemessungswerte und Paketinhalte der Hersteller. Wärmebrücken, Feuchteschutz und Ihr genauer Wandaufbau bleiben aber außen vor. Nutzen Sie das Ergebnis zur Planung, nicht als Nachweis."
  - q: "Ist der Rechner kostenlos?"
    a: "Ja. Sie brauchen kein Konto, wir setzen keine Cookies, und die Berechnung läuft vollständig in Ihrem Browser."
---
## So rechnet der Dämmungsrechner

Der Rechner beantwortet eine Frage: Wie viel Dämmung brauchen Sie zusätzlich, damit Ihr Bauteil den gewünschten U-Wert erreicht? Dafür gehen Sie fünf Schritte durch:

1. **Bauteil wählen:** oberste Geschossdecke, Dachschräge, Außenwand oder Kellerdecke.
2. **Fläche eingeben:** Länge × Breite oder direkt die Fläche. Bei der Außenwand geben Sie Wandlänge und Wandhöhe ein, Fenster und Türen zieht der Rechner ab.
3. **Vorhandenes angeben:** Dicke und Art der alten Dämmung, oder den R-Wert bzw. U-Wert, falls Sie ihn kennen.
4. **Ziel wählen:** die gesetzliche Anforderung nach GModG (ehemals GEG) oder die strengere Mindestanforderung für die BAFA-Förderung (BEG EM).
5. **Dämmstoff wählen:** Klemmfilz aus Glas- oder Steinwolle, Holzfaser, EPS-Platten, PUR oder Einblasdämmung, je nach Bauteil.

### Die Formel hinter dem Ergebnis

In Deutschland wird nicht der R-Wert der Dämmung vorgeschrieben, sondern der U-Wert des ganzen Bauteils. Er berechnet sich so:

**U = 1 / (Rsi + Σ d/λ + Rse)**

- **d/λ** ist der Wärmedurchlasswiderstand einer Schicht: Dicke in Metern geteilt durch die Wärmeleitfähigkeit. 16 cm Dämmung mit λ 0,035 ergeben 0,16 / 0,035 = 4,57 m²·K/W.
- **Rsi und Rse** sind die Wärmeübergangswiderstände an der Innen- und Außenseite nach DIN EN ISO 6946, zum Beispiel 0,13 und 0,04 bei einer Außenwand.
- **Restaufbau:** Decke, Mauerwerk und Putz dämmen auch ein wenig. Weil kaum jemand seinen genauen Aufbau kennt, nimmt der Rechner die amtlichen Pauschal-U-Werte für ungedämmte Bauteile aus der Bekanntmachung vom 08.10.2020, etwa 2,1 W/(m²·K) für eine massive oberste Geschossdecke. Wenn Sie den U-Wert Ihres Bauteils kennen, geben Sie ihn ein.
- **Holzanteil:** Zwischen Sparren leitet das Holz mehr Wärme als die Dämmung. In der Sparrenebene rechnet der Rechner deshalb mit 11 % Holz und 89 % Dämmstoff, nach Flächenanteilen gewichtet.
- **Bemessungswert λB:** Für deutsche U-Wert-Berechnungen zählt der Bemessungswert, nicht der Nennwert λD. Bei Holzfaser-Dämmmatten mit λD 0,036 rechnet der Rechner deshalb mit 0,038.
- **WLS und WLG:** Die Zahl hinter der Wärmeleitstufe (WLS) oder der älteren Wärmeleitgruppe (WLG) ist λ in Tausendstel. WLS 035 bedeutet λ = 0,035 W/(m·K). Je kleiner die Zahl, desto dünner kann die Dämmung sein.

## Rechenbeispiel: 80 m² oberste Geschossdecke

Ein Dachboden mit 80 m² über einer massiven, ungedämmten Decke (U 2,10 W/(m²·K)), gedämmt mit Glaswolle-Klemmfilz WLS 035. Mit 10 % Verschnitt rechnet der Rechner mit 88 m².

| Ziel | Dämmung | Einkaufen | Materialkosten | U danach |
|---|---|---|---|---|
| GModG/GEG, U ≤ 0,24 | 16 cm | 21 Rollen | 1.023 € – 1.128 € | 0,20 W/(m²·K) |
| BEG-Förderung, U ≤ 0,14 | 2 Lagen à 12 cm | 34 Rollen | 1.508 € – 1.704 € | 0,14 W/(m²·K) |

Liegen auf derselben Decke schon 8 cm alte Mineralwolle (U 0,44), reichen für das Förderziel 18 cm zusätzlich: 23 Rollen für 1.113 € bis 1.412 €. Der Rechner zeigt in diesem Fall einen Warnhinweis zur alten Mineralwolle.

Warum 16 cm und nicht exakt die rechnerisch nötigen 12,9 cm? Klemmfilz gibt es nur in festen Dicken. Der Rechner wählt die Kombination mit den wenigsten Lagen und davon die dünnste, die das Ziel sicher erreicht. Deshalb liegt der U-Wert danach oft etwas unter dem Grenzwert.

## So lesen Sie das Ergebnis

- **Jetzt, Ziel, Danach:** Der Balken zeigt Ihren aktuellen U-Wert, den Grenzwert und den Wert nach der Dämmung.
- **Zusätzlich aufbringen:** die Dicke der neuen Dämmung, bei mehreren Lagen mit jeder Lage einzeln.
- **Einkaufsliste:** Rollen, Pakete oder Platten je Lage, mit dem Inhalt pro Gebinde.
- **Rechenweg anzeigen:** jeder Schritt der Rechnung zum Nachprüfen.
- **Link kopieren:** Ihre Eingaben stehen in der Adresse der Seite. So können Sie ein Ergebnis speichern oder weitergeben.

## Welches Bauteil zuerst?

Für jedes Bauteil gibt es eine eigene Seite mit Hinweisen für die Praxis:

- [Oberste Geschossdecke dämmen](/de/oberste-geschossdecke-daemmen): Dachboden, Nachrüstpflicht, begehbar oder nicht
- [Einblasdämmung](/de/einblasdaemmung-rechner): Zellulose vom Fachbetrieb, Preise inklusive Einbau
- [Dach dämmen](/de/dach-daemmen): Zwischensparren- und Untersparrendämmung
- [Außenwand dämmen](/de/aussenwand-daemmen): WDVS mit EPS-Platten
- [Kellerdecke dämmen](/de/kellerdecke-daemmen): Platten von unten

Alle Grenzwerte auf einen Blick finden Sie unter [GEG- und BEG-Anforderungen](/de/geg-beg-anforderungen). Wenn Sie selbst nachrechnen möchten, hilft der [U-Wert-Rechner](/de/u-wert-rechner).

## Vor dem Kauf

- **Herstellerangaben prüfen:** Paketinhalte und Preise ändern sich. Vergleichen Sie unsere Mengen mit dem Etikett des Produkts, das Sie kaufen.
- **Alte Mineralwolle nicht anfassen:** Mineralwolle, die vor 1996 eingebaut wurde, kann krebserzeugende Fasern freisetzen. Den Rückbau regelt die TRGS 521. Lassen Sie alte Wolle liegen oder von einem Fachbetrieb entfernen.
- **Asbestverdacht ernst nehmen:** Bei alten Platten, Klebern oder Pappen gilt die TRGS 519, auch für Privatleute. Nicht bohren, schleifen oder brechen.
- **Förderung vorab klären:** Für den BAFA-Zuschuss brauchen Sie in der Regel einen Energieeffizienz-Experten. Die Grundförderung für Dämmung beträgt 15 %.

## Quellen

- [GModG (ehem. GEG) Anlage 7 – Höchstwerte der Wärmedurchgangskoeffizienten](https://www.gesetze-im-internet.de/geg/anlage_7.html)
- [§ 37 GModG – Berechnung des Wärmedurchgangskoeffizienten](https://www.gesetze-im-internet.de/geg/__37.html)
- [BBSR GModG-Infoportal – Gebäudemodernisierungsgesetz](https://www.gmodg.bund.de/GModG/DE/Home/startseite/GModG_News/GModG_News-node.html)
- [Förderrichtlinie BEG EM vom 17. Juli 2026](https://www.ingenieurkammer.de/fileadmin/dokumente/Downloads_PDF/News_Dokumente/20260717_F%C3%B6rderrichtlinie_BEG_EM.pdf)
- [Bekanntmachung der Regeln zur Datenaufnahme im Wohngebäudebestand (08.10.2020) – Pauschal-U-Werte](https://www.gmodg.bund.de/GModG/DE/ErgaenzendeRegelungen/Bekanntmachungen/Bestandsberechnungen/Download/WGDatenaufnahmeGEG_DL.pdf?__blob=publicationFile&v=2)
- [Wärmeübergangswiderstände nach DIN EN ISO 6946 (Übersicht)](https://de.wikipedia.org/wiki/W%C3%A4rme%C3%BCbergangswiderstand)
- [sanier.de – Wärmeleitfähigkeitsgruppen und -stufen](https://www.sanier.de/wissen/waermeleitfaehigkeitsgruppen-und-waermeleitfaehigkeitsstufen)
- [Verbraucherzentrale – Wärmedämmung richtig anpacken (Stand 28.09.2026)](https://www.verbraucherzentrale.de/wissen/energie/energetische-sanierung/tipps-so-packen-sie-die-waermedaemmung-richtig-an-40001)
