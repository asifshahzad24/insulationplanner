// Site-wide settings. Values marked PLACEHOLDER must be set before launch
// (see the owner checklist in README.md).

export const site = {
  name: "Insulation Planner",
  /** Production domain, no trailing slash. Drives canonical URLs, hreflang and the sitemap. */
  url: "https://loftinsulationcalc.com",
  /** PLACEHOLDER: public contact address (create it in Cloudflare Email Routing). */
  email: "hello@loftinsulationcalc.com",
  /** PLACEHOLDER: publisher details, required for the German Impressum and French mentions légales. */
  owner: {
    name: "[Owner / company name]",
    street: "[Street and number]",
    city: "[Postcode City]",
    country: "[Country]",
    vatId: "",
  },
  /** Hosting provider named in the privacy policy and legal notices. */
  host: {
    name: "Cloudflare, Inc.",
    address: "101 Townsend St, San Francisco, CA 94107, USA",
  },
  /** Cloudflare Web Analytics token. Empty = analytics off. */
  analyticsToken: "",
  /** Date shown as "last updated" on calculator pages. */
  updated: "2026-10-14",
} as const;
