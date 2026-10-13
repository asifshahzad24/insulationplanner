import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { fontVariables } from "./fonts";
import { LogoMark } from "@/components/site/Logo";
import { site } from "@/config/site";
import { MARKET_IDS, MARKETS } from "@/markets/meta";
import { getDict } from "@/i18n";

export const metadata: Metadata = {
  title: `404 — ${site.name}`,
  robots: { index: false },
};

// Unmatched URLs across all markets land here (one 404.html for the whole static site).
export default function GlobalNotFound() {
  const en = getDict("us").page;
  return (
    <html lang="en" className={`${fontVariables} antialiased`}>
      <body className="min-h-dvh bg-night text-white">
        <main className="relative mx-auto flex min-h-dvh max-w-3xl flex-col justify-center overflow-hidden px-6 py-16">
          <div aria-hidden className="thermal-glow pointer-events-none absolute -right-40 top-10 h-[420px] w-[620px]" />
          <Link href="/" className="relative mb-10 flex items-center gap-2.5 font-display text-lg font-extrabold">
            <LogoMark className="size-7" /> {site.name}
          </Link>
          <p className="relative font-mono text-sm text-[#fdba74]">404</p>
          <h1 className="relative mt-2 font-display text-5xl font-extrabold tracking-tight">{en.notFoundTitle}</h1>
          <p className="relative mt-4 max-w-lg text-lg text-night-text">{en.notFoundBody}</p>
          <ul className="relative mt-8 flex flex-wrap gap-3">
            {MARKET_IDS.map((id) => (
              <li key={id}>
                <Link
                  href={MARKETS[id].prefix || "/"}
                  hrefLang={MARKETS[id].lang}
                  className="inline-flex rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-night hover:bg-white/90"
                >
                  {getDict(id).page.notFoundCta} · {MARKETS[id].code}
                </Link>
              </li>
            ))}
          </ul>
        </main>
      </body>
    </html>
  );
}
