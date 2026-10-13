import Script from "next/script";
import type { ReactNode } from "react";
import { fontVariables } from "@/app/fonts";
import { site } from "@/config/site";
import type { MarketId } from "@/engine/types";
import { getDict } from "@/i18n";
import { MARKETS } from "@/markets/meta";

/** <html>/<body> for one market. Each market has its own root layout so `lang` is right in the static HTML. */
export function RootShell({ market, children }: { market: MarketId; children: ReactNode }) {
  const dict = getDict(market);
  return (
    <html lang={MARKETS[market].lang} className={`${fontVariables} antialiased`}>
      <body className="min-h-dvh">
        <a
          href="#main"
          className="sr-only z-50 rounded-lg bg-ink px-4 py-2 text-white focus:not-sr-only focus:fixed focus:left-3 focus:top-3"
        >
          {dict.site.skip}
        </a>
        {children}
        {site.analyticsToken ? (
          <Script
            src="https://static.cloudflareinsights.com/beacon.min.js"
            strategy="afterInteractive"
            data-cf-beacon={JSON.stringify({ token: site.analyticsToken })}
          />
        ) : null}
      </body>
    </html>
  );
}
