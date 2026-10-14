# Getting traffic: owner tasks

These tasks need your own accounts, so only you can do them. Everything else (sitemap, Google setup, IndexNow for Bing) is already done in the code.

Do them in this order. All of them are free.

---

## 1. Cloudflare: send everyone to one address (5 minutes)

At the moment `http://loftinsulationcalc.com` and `www.loftinsulationcalc.com` both open the site. They should send visitors on to `https://loftinsulationcalc.com`.

**A. Always use HTTPS**
1. Go to dash.cloudflare.com and log in with aqrab89@gmail.com.
2. Click **loftinsulationcalc.com**.
3. Left menu: **SSL/TLS** → **Edge Certificates**.
4. Scroll to **Always Use HTTPS** and switch it **On**.

**B. www to the main address**
1. Still on loftinsulationcalc.com, left menu: **Rules** → **Overview**.
2. Click **Create rule** → **Redirect Rule**.
3. Choose the template **Redirect from WWW to root** and click **Deploy**.

**Check:** open `http://www.loftinsulationcalc.com/uk` in a private window. The address bar should end up at `https://loftinsulationcalc.com/uk`.

---

## 2. Bing Webmaster Tools (5 minutes)

Bing also feeds DuckDuckGo, Yahoo and ChatGPT's web search. The site already tells Bing about new pages automatically (IndexNow), but this account lets you see Bing traffic.

1. Go to **bing.com/webmasters** and click **Sign in** → **Google**. Use the same Google account as Search Console.
2. Choose **Import from Google Search Console**, then **Continue**, then **Allow**.
3. Tick **loftinsulationcalc.com** and click **Import**.

Done. Bing copies the verification and the sitemap from Google.

---

## 3. YouTube: 4 videos and 4 Shorts (about 40 minutes)

The videos are already made. They are on this computer in `video/out/`:

| File | Upload as | Captions file |
|---|---|---|
| `us-wide.mp4` | normal video | `public/video/us.vtt` |
| `uk-wide.mp4` | normal video | `public/video/uk.vtt` |
| `de-wide.mp4` | normal video | `public/video/de.vtt` |
| `fr-wide.mp4` | normal video | `public/video/fr.vtt` |
| `us-tall.mp4`, `uk-tall.mp4`, `de-tall.mp4`, `fr-tall.mp4` | Shorts | none needed |

**How to upload**
1. Go to **studio.youtube.com**. If YouTube asks, create a channel named **Loft Insulation Calc**.
2. Click **Create** (top right) → **Upload videos** → choose the file.
3. Paste the **title** and **description** from below.
4. Choose **No, it's not made for kids**.
5. Click **Show more**:
   - **Tags:** paste the tags from below.
   - **Video language:** English, German or French.
   - **Category:** Howto & Style.
6. Wide videos only: click **Subtitles** → **Add** → **Upload file** → **With timing** → choose the `.vtt` file from the table.
7. Under **Visibility**, choose **Public** and click **Publish**.

For a Short, upload the `-tall.mp4` file the same way. Use the **Short title**. Paste the same description.

### US (English)

**Title:** Attic Insulation Calculator: How Thick, How Many Bags, What It Costs (Free)

**Short title:** How many bags of attic insulation do you need? #shorts

**Description:**
```
How thick should your attic insulation be, how many bags do you need, and what will it cost?

Enter your attic size and ZIP code and pick a material. The free calculator shows the depth to add, the number of bags to buy and the material cost. Targets come from the 2021 IECC climate zone for your county (R-30 in zone 1, R-49 in zones 2–3, R-60 in zones 4–8).

Free, no sign-up:
https://loftinsulationcalc.com

More tools:
Blown-in insulation calculator: https://loftinsulationcalc.com/blown-in-insulation-calculator
R-value chart (inches per R-value): https://loftinsulationcalc.com/r-value-chart
Insulation by climate zone: https://loftinsulationcalc.com/insulation-by-climate-zone
```

**Tags:** attic insulation, insulation calculator, blown in insulation, R-value, R-49, R-60, how much insulation do I need, attic insulation cost, DIY insulation

### UK (English)

**Title:** Loft Insulation Calculator UK: How Thick, How Many Rolls, What It Costs (Free)

**Short title:** How many rolls of loft insulation do you need? #shorts

**Description:**
```
How thick should your loft insulation be, how many rolls do you need, and what will it cost?

Enter your loft size and what's already up there, then choose your target. The free calculator shows the depth to add (270 mm is the usual target), the number of rolls to buy and the cost. Based on the Building Regulations (Part L).

Free, no sign-up:
https://loftinsulationcalc.com/uk/loft-insulation-calculator

More tools:
Loft insulation thickness guide: https://loftinsulationcalc.com/uk/loft-insulation-thickness
Cavity wall insulation calculator: https://loftinsulationcalc.com/uk/cavity-wall-insulation-calculator
U-value calculator: https://loftinsulationcalc.com/uk/u-value-calculator
```

**Tags:** loft insulation, loft insulation calculator, 270mm loft insulation, loft insulation rolls, loft insulation cost UK, how much loft insulation do I need, DIY loft insulation

### Germany (Deutsch)

**Title:** Dachboden dämmen: Dämmstärke, Rollen und Kosten berechnen (kostenloser Rechner)

**Short title:** Wie dick muss die Dämmung auf dem Dachboden sein? #shorts

**Description:**
```
Wie dick muss die Dämmung der obersten Geschossdecke sein, wie viele Rollen brauchen Sie und was kostet das?

Fläche eingeben, vorhandene Dämmung angeben und Ziel wählen: gesetzliche Pflicht nach GEG (U-Wert 0,24) oder Förderung nach BEG (U-Wert 0,14). Der kostenlose Rechner zeigt sofort die Dämmstärke, die Anzahl der Rollen und die Kosten.

Kostenlos, ohne Anmeldung:
https://loftinsulationcalc.com/de/oberste-geschossdecke-daemmen

Weitere Rechner:
Dämmstärke berechnen: https://loftinsulationcalc.com/de/daemmstaerke-berechnen
Kellerdecke dämmen: https://loftinsulationcalc.com/de/kellerdecke-daemmen
U-Wert-Rechner: https://loftinsulationcalc.com/de/u-wert-rechner
```

**Tags:** Dachboden dämmen, oberste Geschossdecke dämmen, Dämmstärke berechnen, Dämmung Rechner, GEG, BEG Förderung, U-Wert, Dämmung Kosten

### France (Français)

**Title:** Isolation des combles perdus : épaisseur, nombre de sacs et coût (calculateur gratuit)

**Short title:** Quelle épaisseur d'isolant pour vos combles ? #shorts

**Description:**
```
Quelle épaisseur d'isolant pour vos combles, combien de sacs acheter et pour quel budget ?

Indiquez la surface, choisissez votre département puis l'isolant. Le calculateur gratuit affiche tout de suite l'épaisseur à ajouter, le nombre de sacs et le coût. Objectif R ≥ 7 m²·K/W, l'exigence des aides CEE.

Gratuit, sans inscription :
https://loftinsulationcalc.com/fr/isolation-combles-perdus

Autres outils :
Épaisseur d'isolant : https://loftinsulationcalc.com/fr/epaisseur-isolant
Isolation soufflée : https://loftinsulationcalc.com/fr/isolation-soufflee-combles
Calcul de la résistance thermique : https://loftinsulationcalc.com/fr/calcul-resistance-thermique
```

**Tags:** isolation combles perdus, épaisseur isolant, isolation soufflée, résistance thermique, R=7, calcul isolation, coût isolation combles

---

## 4. Links from other websites (10 minutes a week, ongoing)

Links from other sites are the biggest reason a site climbs in Google. Right now no other site links to yours. Getting links is slow, but it works.

**Where to answer questions**

| Site | Country | Search for |
|---|---|---|
| reddit.com/r/DIYUK | UK | loft insulation |
| forums.moneysavingexpert.com (Energy board) | UK | loft insulation |
| diynot.com/diy/forums | UK | loft insulation |
| reddit.com/r/HomeImprovement and r/insulation | US | attic insulation, blown in |
| quora.com | all | how much insulation |
| gutefrage.net | DE | Dachboden dämmen |
| forum-construire.com | FR | isolation combles |

**Rules that stop you getting banned**
1. **Answer the question first.** Add the link only at the end, as "if it helps".
2. **Say it's your site:** "I made this free calculator".
3. **No more than 1 link per thread, and no more than 2 or 3 threads a week.** Copying the same message everywhere gets accounts deleted.
4. **On Reddit, comment on other topics first for a week or two.** New accounts that post links straight away are removed automatically.
5. **Don't post if your site doesn't help that question.**

**Example answers to adapt (change the numbers to fit the question)**

UK, someone asks "I have 100 mm in my loft, how much should I add?":
```
The usual target is 270 mm of mineral wool, so you'd add about 170 mm.
Lay it across the joists (at right angles to the first layer) so it covers the
timber, keep a gap at the eaves for airflow, and don't insulate under the water tank.
Lag any pipes up there first, because the loft gets colder once it's insulated.

If it helps, I made a free calculator that works out how many rolls you'd need
for your loft size and what it costs: https://loftinsulationcalc.com/uk/loft-insulation-calculator
```

US, someone asks "How many bags of blown-in for my attic?":
```
Work out the R-value you still need (R-49 or R-60 for most of the US, minus
what you have now). Then use the coverage chart printed on the bag: it lists
square feet per bag for each R-value. Divide your attic area by that number
and round up. Buy a couple of spare bags, since coverage drops if you blow it in too densely.

I built a free calculator that does this from your ZIP code and attic size,
if that's easier: https://loftinsulationcalc.com/blown-in-insulation-calculator
```

**Other free places**
- **Pinterest:** make a free business account and pin your YouTube videos and pages to a board called "Home insulation tips". DIY and home-improvement content does well there.
- **Product Hunt** (producthunt.com): launch the calculator once as a free tool. You get one link from a high-authority site.

---

## 5. Weekly check (5 minutes)

In **Google Search Console** (search.google.com/search-console):
1. **Performance:** look at **Total impressions** (how often Google showed your pages) and **Total clicks**. Expect small numbers for the first month.
2. **Indexing** → **Pages:** look at how many of the 62 pages are indexed. The number should rise over the next few weeks.

Then do the same in **Bing Webmaster Tools** → **Search Performance**.

**Visitors:** Cloudflare dashboard → **Analytics & Logs** → **Web Analytics** → **loftinsulationcalc.com**. Switch the time range to **Last 7 days**. Look at:
- **Visits:** the number of visitors.
- **Referers:** where they came from (Google, Bing, YouTube, Reddit…).
- **Countries:** which countries they're in.

This is the best way to see which of your efforts bring people in.
