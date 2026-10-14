import Link from "next/link";
import type { MarketId } from "@/engine/types";
import type { Dict } from "@/i18n";
import { MARKET_IDS, MARKETS } from "@/markets/meta";
import { Wordmark } from "./Wordmark";

export interface NavLink {
  href: string;
  label: string;
}

export function Header({
  market,
  dict,
  nav,
  switcher,
  dark = true,
}: {
  market: MarketId;
  dict: Dict;
  nav: NavLink[];
  switcher: Record<MarketId, string>;
  dark?: boolean;
}) {
  const home = MARKETS[market].prefix || "/";
  const text = dark ? "text-night-text" : "text-muted";
  return (
    <header className={`no-print relative z-30 ${dark ? "text-white" : "border-b border-line bg-surface text-ink"}`}>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-4 sm:gap-4 sm:px-6">
        <Link href={home} className="shrink-0">
          <Wordmark tone={dark ? "dark" : "light"} />
        </Link>

        <nav aria-label={dict.nav.menu} className={`hidden items-center gap-5 whitespace-nowrap text-[13.5px] lg:flex ${text}`}>
          {nav.map((l) => (
            <Link key={l.href} href={l.href} className={dark ? "hover:text-white" : "hover:text-ink"}>
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* On small phones the switcher moves into the menu so the bar never overflows. */}
          <div className="hidden sm:block">
            <CountrySwitcher market={market} switcher={switcher} label={dict.nav.country} dark={dark} />
          </div>
          <details className="relative lg:hidden">
            <summary
              className={`flex cursor-pointer list-none items-center rounded-lg border px-2.5 py-1.5 text-[13px] font-medium ${
                dark ? "border-white/20" : "border-line-2"
              }`}
            >
              {dict.nav.menu}
            </summary>
            <div className="absolute right-0 mt-2 w-60 rounded-xl border border-line bg-surface p-2 text-ink shadow-xl">
              {nav.map((l) => (
                <Link key={l.href} href={l.href} className="block rounded-lg px-3 py-2 text-sm hover:bg-canvas">
                  {l.label}
                </Link>
              ))}
              <div className="mt-2 border-t border-line px-3 pb-1 pt-3 sm:hidden">
                <p className="mb-2 text-xs font-medium text-muted">{dict.nav.country}</p>
                <CountrySwitcher market={market} switcher={switcher} label={dict.nav.country} dark={false} />
              </div>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}

function CountrySwitcher({
  market,
  switcher,
  label,
  dark,
}: {
  market: MarketId;
  switcher: Record<MarketId, string>;
  label: string;
  dark: boolean;
}) {
  return (
    <nav aria-label={label} className={`flex rounded-[10px] border p-[3px] text-[12px] font-semibold ${dark ? "border-white/15" : "border-line-2"}`}>
      {MARKET_IDS.map((id) => {
        const active = id === market;
        // Plain <a>: each market has its own root layout, so switching is a full page load anyway.
        return (
          <a
            key={id}
            href={switcher[id]}
            hrefLang={MARKETS[id].lang}
            aria-current={active ? "true" : undefined}
            title={MARKETS[id].name}
            className={`rounded-[7px] px-1.5 py-1 transition sm:px-2 ${
              active ? (dark ? "bg-white text-night" : "bg-ink text-white") : dark ? "text-night-text hover:text-white" : "text-muted hover:text-ink"
            }`}
          >
            {MARKETS[id].code}
          </a>
        );
      })}
    </nav>
  );
}
