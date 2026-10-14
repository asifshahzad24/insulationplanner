# Deploying Loft Insulation Calc

The site is a static export (`out/`). It runs on **Cloudflare** (Workers static assets), on the same account as your domain **loftinsulationcalc.com**. Hosting is free.

## 1. Code on GitHub

The code lives at `https://github.com/asifshahzad24/insulationplanner`, branch `main`. Cloudflare deploys from there.

## 2. Create the Cloudflare project

Cloudflare's dashboard creates **Workers** projects by default, and that is what we use. The repo's `wrangler.jsonc` tells Cloudflare to serve the prebuilt `out/` folder. Without it, Cloudflare tries to treat the site as a Next.js server app (OpenNext) and the build fails.

1. Cloudflare dashboard → **Workers & Pages** → **Create application** → **Import a repository** → pick `insulationplanner`.
2. **Project / Worker name:** `insulationplanner`. This must match `name` in `wrangler.jsonc`.
3. **Build command:** `npm run build`
4. **Deploy command:** `npx wrangler deploy`
5. **Build variables (optional):** `NODE_VERSION` = `22`
6. Deploy. You get a `*.workers.dev` preview URL; check it before connecting the domain.

If the Worker already exists, change these under **Settings → Build → Build configuration**, then **Retry deployment** (or push a new commit).

Every push to `main` redeploys automatically.

*(Alternative: a classic **Pages** project also works, with build command `npm run build` and output directory `out`.)*

## 3. Connect the domain

1. In the Worker → **Settings → Domains & Routes** → **Add → Custom domain** → `loftinsulationcalc.com`. Cloudflare creates the DNS record for you, because the domain is on the same account.
2. Add `www.loftinsulationcalc.com` too.
3. Redirect `www` to the bare domain: **Rules** → **Redirect Rules** → "www → apex", status 301, preserve path and query.
4. SSL/TLS → **Full (strict)**. Edge Certificates → **Always Use HTTPS**: on.

## 4. Analytics (cookieless, no consent banner)

1. Cloudflare dashboard → **Analytics & Logs** → **Web Analytics** → **Add a site** → `loftinsulationcalc.com`.
2. Choose the **JS snippet** option and copy the `token` value.
3. Paste it into `src/config/site.ts` → `analyticsToken`. Commit and push.

## 5. Google Search Console

1. Go to https://search.google.com/search-console → **Add property** → **Domain** → `loftinsulationcalc.com`.
2. Use **Verify with Cloudflare** if Google offers it. Otherwise copy the TXT record into Cloudflare **DNS** → **Add record** → Type `TXT`, Name `@`, wait a few minutes and click **Verify**.
3. **Sitemaps** → submit `https://loftinsulationcalc.com/sitemap.xml`.
4. **URL Inspection** → request indexing for `/`, `/uk`, `/de`, `/fr` and the attic/loft pages.

Search Console groups the language versions through the `hreflang` tags the site already outputs, so you do not need separate properties per country.

## 6. Email

The site lists `info@loftinsulationcalc.com`. Set it up for free with Cloudflare **Email Routing**: forward it to your personal inbox.

## Updating prices and data

Market data lives in `src/markets/<us|uk|de|fr>/index.ts`. Every product has a `priceDate`. After you change numbers:

```bash
npm run check    # lint + typecheck + tests (data integrity tests catch most mistakes)
npm run build
npm run verify   # checks every built page
```

Then commit and push. Cloudflare redeploys automatically.
