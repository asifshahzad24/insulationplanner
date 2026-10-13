import Link from "next/link";
import { site } from "@/config/site";
import type { MarketId } from "@/engine/types";
import { tpl, type Dict } from "@/i18n";
import { MARKET_IDS, MARKETS } from "@/markets/meta";
import type { NavLink } from "./Header";
import { LogoMark } from "./Logo";

export function Footer({
  market,
  dict,
  tools,
  company,
  legal,
}: {
  market: MarketId;
  dict: Dict;
  tools: NavLink[];
  company: NavLink[];
  legal: NavLink[];
}) {
  const f = dict.footer;
  return (
    <footer className="no-print mt-20 border-t border-line bg-surface">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5 font-display text-[17px] font-extrabold tracking-tight">
            <LogoMark className="size-6" />
            {site.name}
          </div>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">{f.blurb}</p>
          <p className="mt-4 text-sm text-muted">
            <a className="underline-offset-4 hover:text-ink hover:underline" href={`mailto:${site.email}`}>
              {site.email}
            </a>
          </p>
        </div>
        <FooterCol title={f.calculators} links={tools} />
        <FooterCol title={f.company} links={company} />
        <div>
          <FooterCol title={f.legal} links={legal} />
          <h2 className="mt-6 text-xs font-semibold uppercase tracking-wider text-faint">{f.countries}</h2>
          <ul className="mt-3 flex flex-wrap gap-2 text-sm">
            {MARKET_IDS.map((id) => (
              <li key={id}>
                <a
                  href={MARKETS[id].prefix || "/"}
                  hrefLang={MARKETS[id].lang}
                  aria-current={id === market ? "true" : undefined}
                  className={`rounded-md border px-2 py-0.5 ${id === market ? "border-ink text-ink" : "border-line text-muted hover:text-ink"}`}
                >
                  {MARKETS[id].name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-xs text-faint sm:flex-row sm:justify-between sm:px-6">
          <span>{tpl(f.rights, { year: new Date(site.updated).getFullYear(), site: site.name })}</span>
          <span>{f.disclaimer}</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: NavLink[] }) {
  return (
    <div>
      <h2 className="text-xs font-semibold uppercase tracking-wider text-faint">{title}</h2>
      <ul className="mt-3 space-y-2 text-sm">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-muted underline-offset-4 hover:text-ink hover:underline">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
