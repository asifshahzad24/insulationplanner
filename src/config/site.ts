// Site-wide settings. Values marked PLACEHOLDER must be set before launch
// (see the owner checklist in README.md).

export const site = {
  name: "Loft Insulation Calc",
  /** Production domain, no trailing slash. Drives canonical URLs, hreflang and the sitemap. */
  url: "https://loftinsulationcalc.com",
  /** Public contact address (forward it to your inbox with Cloudflare Email Routing). */
  email: "info@loftinsulationcalc.com",
  /** Publisher details, shown in the German Impressum and French mentions légales. */
  owner: {
    name: "Asif Shahzad",
    street: "House 10, Street 50, Jinnah Garden",
    city: "Islamabad 44023",
    country: "Pakistan",
    vatId: "",
  },
  /** Hosting provider named in the privacy policy and legal notices. */
  host: {
    name: "Cloudflare, Inc.",
    address: "101 Townsend St, San Francisco, CA 94107, USA",
  },
  /**
   * Cloudflare Web Analytics token. Leave empty: the site uses Web Analytics "Automatic setup",
   * where Cloudflare injects the beacon at the edge. Setting a token here would add a second beacon.
   */
  analyticsToken: "",
  /** IndexNow key (Bing, Yandex, Seznam…). public/<key>.txt must contain the same value. */
  indexNowKey: "6cd8909b44bf070e67faf659a317ce11",
  /** Date shown as "last updated" on calculator pages. */
  updated: "2026-10-14",
} as const;
