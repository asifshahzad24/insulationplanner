---
title: "Methodik: So rechnet der Dämmungsrechner"
description: "Methodik des Dämmungsrechners: U-Wert nach DIN EN ISO 6946, Restaufbau aus Pauschalwerten, Holzanteil, Bemessungswerte λB, Verschnitt und Preisquellen."
h1: "Methodik: So rechnet der Dämmungsrechner"
nav: "Methodik"
intro: "Alle Formeln, Annahmen und Quellen hinter unseren Ergebnissen für Deutschland, damit Sie jeden Schritt selbst nachprüfen können."
---
## Einheiten

Alle Rechnungen laufen in SI-Einheiten: Dicken in Millimetern, Flächen in Quadratmetern, Wärmedurchlasswiderstände R in m²·K/W, U-Werte in W/(m²·K) und Wärmeleitfähigkeiten λ in W/(m·K). Angezeigt werden Dicken in Zentimetern, U-Werte und R-Werte mit zwei Nachkommastellen.

## Ziele

Für Deutschland rechnet der Rechner mit dem U-Wert des ganzen Bauteils, so wie ihn das Gesetz und die Förderung vorgeben:

| Bauteil | Pflicht nach GModG (ehem. GEG) | Förderung nach BEG EM |
|---|---|---|
| Oberste Geschossdecke | 0,24 | 0,14 |
| Dachschräge | 0,24 | 0,14 |
| Außenwand | 0,24 | 0,20 |
| Kellerdecke, von unten gedämmt | 0,30 | 0,25 |

- **Pflicht:** Höchstwerte nach Anlage 7 GModG, das bis 28.07.2026 Gebäudeenergiegesetz (GEG) hieß. Für die oberste Geschossdecke gilt zusätzlich die Nachrüstpflicht nach § 35 GModG (ehemals § 47 GEG).
- **Förderung:** Technische Mindestanforderungen der Förderrichtlinie BEG EM vom 17.07.2026, in Kraft seit 21.07.2026.

## U-Wert-Berechnung

Der Rechner verwendet das übliche Verfahren nach DIN EN ISO 6946, auf das § 37 GModG verweist:

**U = 1 / (Rsi + Σ d/λ + Rse)**

Die Wärmeübergangswiderstände je Bauteil:

| Bauteil | Rsi | Rse | Begründung |
|---|---|---|---|
| Oberste Geschossdecke | 0,10 | 0,10 | Wärmestrom nach oben, unbeheizter Dachraum |
| Dachschräge | 0,10 | 0,10 | Wärmestrom nach oben, hinterlüftete Eindeckung |
| Außenwand | 0,13 | 0,04 | waagerechter Wärmestrom, Außenluft |
| Kellerdecke | 0,17 | 0,17 | Wärmestrom nach unten, unbeheizter Keller |

Aus dem Ziel-U-Wert ergibt sich der R-Wert, den die Dämmung erreichen muss: R(Dämmung) = 1/U(Ziel) − Rsi − Rse − R(Restaufbau). Vorhandene Dämmung wird davon abgezogen.

## Restaufbau

Die meisten Nutzer kennen den genauen Aufbau ihrer Decke oder Wand nicht. Der Rechner nimmt deshalb die amtlichen Pauschal-U-Werte für nicht nachträglich gedämmte Bauteile aus der Bekanntmachung der Regeln zur Datenaufnahme im Wohngebäudebestand vom 08.10.2020:

| Bauteil | Annahme | R inkl. Rsi und Rse |
|---|---|---|
| Oberste Geschossdecke | massiv, U 2,1 | 0,48 |
| Außenwand | Mauerwerk, U 1,4 | 0,71 |
| Kellerdecke | Stahlbeton, U 1,6 | 0,63 |
| Dachschräge | Innenbekleidung R 0,05 | 0,25 |

Das sind Werte älterer, ungedämmter Bauteile. Bei neueren oder besser gedämmten Bauteilen ist der Restaufbau günstiger. Wenn Sie den U-Wert Ihres Bauteils kennen, geben Sie ihn unter „Ich kenne den U-Wert“ ein. Der Rechner zieht dann die Übergangswiderstände ab und rechnet mit Ihrem Wert weiter.

## Vorhandene Dämmung

Geben Sie Dicke und Art der vorhandenen Dämmung an, rechnet der Rechner mit diesen Wärmeleitfähigkeiten:

| Material | λ in W/(m·K) | Quelle |
|---|---|---|
| Mineralwolle (WLG 040, nach 2000) | 0,040 | Bekanntmachung 08.10.2020 |
| Alte Mineralwolle (vor 1996) | 0,045 | sanier.de |
| Styropor / Hartschaum | 0,040 | Bekanntmachung 08.10.2020 |
| Einblasdämmung / Naturdämmstoff | 0,050 | Bekanntmachung 08.10.2020 |
| Holzwolle-Leichtbauplatte | 0,09 | Altbauatlas |
| Schlackenschüttung (Fehlboden) | 0,19 | Altbauatlas |

Bei alter Mineralwolle zeigt der Rechner einen Warnhinweis zu TRGS 521.

## Holzanteil bei Sparren

In der Dachschräge liegt die Dämmung zwischen Sparren. Der Rechner nimmt 11 % Holzanteil an und mittelt die Wärmeleitfähigkeit in der Sparrenebene nach Flächenanteilen (Parallelschaltung von Gefach und Sparren): wirksames λ = 0,89 × λ(Dämmstoff) + 0,11 × 0,13. Für Nadelholz setzt er λ 0,13 W/(m·K) an. Der Holzanteil von 11 % ist aus üblichen Sparrenbreiten und -abständen abgeleitet, eine Annahme, keine Normvorgabe. Schichten jenseits der Sparrenhöhe rechnet der Rechner ohne Holzanteil.

Die Sparrenhöhe stellen Sie als Hohlraumtiefe ein (12 bis 24 cm, voreingestellt 16 cm). Mehr Dämmung als Platz im Hohlraum rechnet der Rechner nicht ein. Er zeigt dann einen Hinweis und das bestmögliche Ergebnis.

Für Nachweise schreibt DIN EN ISO 6946 bei inhomogenen Schichten ein genaueres Verfahren vor. Unsere Näherung genügt für die Planung.

## Bemessungswerte λB

Für U-Wert-Berechnungen in Deutschland zählt der Bemessungswert λB, nicht der Nennwert λD. Wo beide abweichen, rechnet der Rechner mit λB. Beispiel: Holzfaser-Dämmmatten mit λD 0,036 gehen mit λB 0,038 in die Rechnung ein. Bei Mineralwolle und EPS mit WLS- oder WLG-Angabe verwenden wir die Stufe direkt, also λ 0,035 für WLS 035.

## Auswahl der Dicke

Rollen und Platten gibt es nur in festen Dicken. Der Rechner probiert alle Kombinationen aus bis zu drei Lagen der hinterlegten Dicken und wählt:

1. die Kombination mit den **wenigsten Lagen**, die das Ziel erreicht,
2. davon die **dünnste**,
3. bei Gleichstand die mit den wenigsten Gebinden und dann die günstigste.

Erreicht keine Kombination das Ziel, etwa weil der Hohlraum zu klein ist, zeigt der Rechner die Kombination mit dem höchsten R-Wert und einen Hinweis.

## Mengen und Verschnitt

Der Rechner schlägt standardmäßig **10 % Verschnitt** auf die Fläche auf. Sie können den Wert unter „Weitere Optionen“ ändern. Die Zahl der Rollen, Pakete oder Platten wird je Lage aus dem Inhalt pro Gebinde berechnet und aufgerundet.

## Preise

- **Rollen und Platten:** typische Ladenpreise von OBI, BAUHAUS, toom und hagebau, erhoben am 14.10.2026. Wo die Märkte unterschiedliche Preise hatten, zeigen wir eine Spanne. Einige Preise für dicke EPS-Platten sind aus dem m²-Preis dünnerer Platten hochgerechnet. Die Beträge gelten für Material ohne Werkzeug, Zubehör und Arbeitslohn.
- **Einblasdämmung:** Sie wird vom Fachbetrieb eingebaut. Der Rechner zeigt deshalb einen Preis inklusive Einblasen: 20–40 €/m² für offen aufgeblasene Zellulose bei einer typischen Dicke von 22 cm laut einer Kostenübersicht von 2026, anteilig auf Ihre Dicke umgerechnet und ohne Verschnitt.
- **Eigener Preis:** Unter „Weitere Optionen“ können Sie Ihren eigenen Preis eingeben.

Typische Preise mit Fachbetrieb nennen wir auf den Seiten der einzelnen Bauteile, mit Quelle.

## Grenzen

Der Rechner ist ein Planungswerkzeug. Er berücksichtigt nicht:

- Wärmebrücken, etwa an Fensteranschlüssen, Deckenrändern oder Sparren-Fußpunkten,
- Feuchteschutz und Tauwasser; einen Tauwassernachweis ersetzt er nicht,
- Statik, Brandschutz und bauaufsichtliche Zulassungen,
- den Nachweis nach GModG oder die Bestätigung für einen Förderantrag.

Er ersetzt keine Energieberatung. Für Förderanträge brauchen Sie in der Regel einen Energieeffizienz-Experten.

## Andere Länder

Für die USA, Großbritannien und Frankreich rechnet der Rechner mit anderen Zielen und Methoden. In den USA gibt er zum Beispiel R-Werte je Klimazone vor und rechnet Einblasdämmung nach den Verbrauchstabellen der Hersteller. Die Ergebnisse der Länderversionen lassen sich deshalb nicht direkt vergleichen.

## Quellen

- [GModG (ehem. GEG) Anlage 7 – Höchstwerte der Wärmedurchgangskoeffizienten](https://www.gesetze-im-internet.de/geg/anlage_7.html)
- [§ 35 GModG – Nachrüstpflicht oberste Geschossdecke](https://www.gesetze-im-internet.de/geg/__35.html)
- [§ 37 GModG – Berechnung des Wärmedurchgangskoeffizienten](https://www.gesetze-im-internet.de/geg/__37.html)
- [BBSR GModG-Infoportal – Gebäudemodernisierungsgesetz](https://www.gmodg.bund.de/GModG/DE/Home/startseite/GModG_News/GModG_News-node.html)
- [Förderrichtlinie BEG EM vom 17. Juli 2026 mit Technischen Mindestanforderungen](https://www.ingenieurkammer.de/fileadmin/dokumente/Downloads_PDF/News_Dokumente/20260717_F%C3%B6rderrichtlinie_BEG_EM.pdf)
- [KfW/BAFA – BEG EM Technische FAQ, Version 7.0 (06/2026)](https://www.kfw.de/PDF/Download-Center/F%C3%B6rderprogramme-%28Inlandsf%C3%B6rderung%29/PDF-Dokumente/6000004864_BEG_TFAQ_EM.pdf)
- [Bekanntmachung der Regeln zur Datenaufnahme im Wohngebäudebestand (08.10.2020) – Pauschal-U-Werte](https://www.gmodg.bund.de/GModG/DE/ErgaenzendeRegelungen/Bekanntmachungen/Bestandsberechnungen/Download/WGDatenaufnahmeGEG_DL.pdf?__blob=publicationFile&v=2)
- [BBSR / Universität Kassel – Altbauatlas (Baustoffe im Bestand)](https://www.altbauatlas.de/)
- [sanier.de – Wärmeleitfähigkeitsgruppen und -stufen](https://www.sanier.de/wissen/waermeleitfaehigkeitsgruppen-und-waermeleitfaehigkeitsstufen)
- [Wärmeübergangswiderstände nach DIN EN ISO 6946 (Übersicht)](https://de.wikipedia.org/wiki/W%C3%A4rme%C3%BCbergangswiderstand)
- [STEICO – STEICOflex 036 Lieferformen](https://www.steico.com/de/produkte/daemmung/gefachdaemmung/flexible-waermedaemmung/steicoflex-036)
- [OBI – Klemmfilz (Preise, Paketinhalte)](https://www.obi.de/search/klemmfilz/)
- [OBI – Fassadendämmplatten EPS 032/035](https://www.obi.de/search/fassadend%C3%A4mmplatte%20eps/)
- [OBI – Kellerdecken-Dämmplatten (EPS, Mineralwolle, PUR)](https://www.obi.de/p/5760897/kellerdecken-daemmplatte-eps-035-100-mm)
- [GREENOX – Einblasdämmung: Kosten, Förderung & Materialvergleich (04/2026)](https://greenox-group.de/einblasdaemmung/)
- [Verbraucherzentrale – Wärmedämmung richtig anpacken (Stand 28.09.2026)](https://www.verbraucherzentrale.de/wissen/energie/energetische-sanierung/tipps-so-packen-sie-die-waermedaemmung-richtig-an-40001)
