# Deploying Insulation Planner

The site is a static export (`out/`). It runs on **Cloudflare Pages**, on the same account as your domain **loftinsulationcalc.com**. Hosting is free.

## 1. Put the code on GitHub

The repository already points at `https://github.com/asifshahzad24/insulationplanner`.

```bash
git push -u origin build/mvp     # or merge build/mvp into main first, then push main
```

## 2. Create the Cloudflare Pages project

1. Open Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
2. Pick the `insulationplanner` repository and the branch you deploy from (`main`).
3. Build settings:
   - **Framework preset:** None
   - **Build command:** `npm run build`
   - **Build output directory:** `out`
   - **Environment variable:** `NODE_VERSION` = `22`
4. **Save and Deploy.** You get a `*.pages.dev` preview URL. Check it before connecting the domain.

Every push to `main` redeploys automatically. Pushes to other branches get preview URLs.

## 3. Connect the domain

1. In the Pages project → **Custom domains** → **Set up a custom domain** → `loftinsulationcalc.com`. Cloudflare creates the DNS record for you, because the domain is on the same account.
2. Add `www.loftinsulationcalc.com` too.
3. Redirect `www` to the bare domain: **Rules** → **Redirect Rules** → "www → apex", status 301, preserve path and query.
4. SSL/TLS → **Full (strict)**. Edge Certificates → **Always Use HTTPS**: on.

## 4. Analytics (cookieless, no consent banner)

1. Cloudflare dashboard → **Analytics & Logs** → **Web Analytics** → **Add a site** → `loftinsulationcalc.com`.
2. Choose the **JS snippet** option and copy the `token` value.
3. Paste it into `src/config/site.ts` → `analyticsToken`. Commit and push.

## 5. Google Search Console

1. Go to https://search.google.com/search-console → **Add property** → **Domain** → `loftinsulationcalc.com`.
2. Google shows a TXT record. Add it in Cloudflare **DNS** → **Add record** → Type `TXT`, Name `@`, then wait a few minutes and click **Verify**.
3. **Sitemaps** → submit `https://loftinsulationcalc.com/sitemap.xml`.
4. **URL Inspection** → request indexing for `/`, `/uk`, `/de`, `/fr` and the attic/loft pages.

Search Console groups the language versions through the `hreflang` tags the site already outputs, so you do not need separate properties per country.

## 6. Email (optional)

The site lists `hello@loftinsulationcalc.com`. Set it up for free with Cloudflare **Email Routing**: forward it to your personal inbox.

## Updating prices and data

Market data lives in `src/markets/<us|uk|de|fr>/index.ts`. Every product has a `priceDate`. After you change numbers:

```bash
npm run check    # lint + typecheck + tests (data integrity tests catch most mistakes)
npm run build
```

Then commit and push. Cloudflare redeploys automatically.
