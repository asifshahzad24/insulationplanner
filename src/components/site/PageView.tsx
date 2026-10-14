import Image from "next/image";
import { Calculator } from "@/components/calculator/Calculator";
import { Converter } from "@/components/converter/Converter";
import { site } from "@/config/site";
import { getDict, tpl } from "@/i18n";
import { getContent } from "@/lib/content";
import { ATTIC_DIAGRAM_GROUPS, ATTIC_DIAGRAMS, atticDiagramPath, DIAGRAM_SIZE } from "@/lib/diagrams";
import { fmtDate } from "@/lib/format";
import { absoluteUrl, breadcrumbLd, faqLd, ogImageUrl, siteGraphLd, switcherLinks, webAppLd, type PageImage } from "@/lib/seo";
import { getMarket } from "@/markets";
import { MARKETS } from "@/markets/meta";
import { pathOf, routeByGroup, routesFor, type Group, type RouteEntry } from "@/routes/registry";
import { Breadcrumbs, Faq, JsonLd, RelatedLinks } from "./Blocks";
import { Footer } from "./Footer";
import { Header, type NavLink } from "./Header";
import { PromoVideo } from "./PromoVideo";
import { TargetsTable, ThicknessChart } from "./Widgets";

const linksFor = (entry: RouteEntry, groups: Group[]): NavLink[] =>
  groups
    .map((g) => routeByGroup(entry.market, g))
    .filter((e): e is RouteEntry => Boolean(e))
    .map((e) => ({ href: pathOf(e), label: getContent(e).nav }));

export function PageView({ entry }: { entry: RouteEntry }) {
  const market = getMarket(entry.market);
  const dict = getDict(entry.market);
  const content = getContent(entry);
  const home = routeByGroup(entry.market, "home")!;
  const isTool = entry.kind === "calculator" || entry.kind === "converter";
  const diagram = ATTIC_DIAGRAM_GROUPS.includes(entry.group) ? ATTIC_DIAGRAMS[entry.market] : null;
  const mainImage: PageImage = diagram
    ? { url: absoluteUrl(atticDiagramPath(entry.market)), ...DIAGRAM_SIZE, caption: diagram.alt }
    : { url: ogImageUrl(entry.market), width: 1200, height: 630 };

  const nav = [
    { href: pathOf(home), label: dict.page.home },
    ...linksFor(entry, ["attic", "wall", "floor", "converter", "about", "contact"]),
  ];
  const tools = routesFor(entry.market)
    .filter((e) => e.tool)
    .map((e) => ({ href: pathOf(e), label: getContent(e).nav }));
  const company = linksFor(entry, ["methodology", "faq", "about", "contact"]);
  const legal = linksFor(entry, ["privacy", "terms", "affiliate", "legalNotice"]);
  const related = tools.filter((l) => l.href !== pathOf(entry)).slice(0, 6);

  const crumbs = entry.group === "home" ? [] : [
    { name: dict.page.home, href: pathOf(home) },
    { name: content.nav, href: pathOf(entry) },
  ];

  return (
    <>
      <JsonLd
        data={[
          siteGraphLd(entry, content, mainImage),
          isTool ? webAppLd(entry, content) : null,
          faqLd(content),
          crumbs.length ? breadcrumbLd(crumbs.map((c) => ({ name: c.name, path: c.href }))) : null,
        ]}
      />

      {/* ── Dark thermal hero ──────────────────────────────────────────── */}
      <div className={`relative overflow-hidden bg-night ${isTool ? "pb-28" : "pb-14"}`}>
        {/* Glow anchored to the content column, so it stays beside the heading on wide screens. */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="relative mx-auto h-full max-w-6xl">
            <div className="thermal-glow absolute -right-40 -top-24 h-[420px] w-[620px] max-w-none" />
          </div>
        </div>
        <Header market={entry.market} dict={dict} nav={nav} switcher={switcherLinks(entry)} />
        <div className="relative mx-auto max-w-6xl px-4 pt-6 sm:px-6 sm:pt-10">
          {crumbs.length ? <Breadcrumbs items={crumbs} /> : null}
          {isTool ? <p className="mb-3 font-mono text-[12px] tracking-wide text-[#fdba74]">{dict.hero.eyebrow}</p> : null}
          <h1 className="max-w-3xl font-display text-[2.4rem] font-extrabold leading-[1.02] tracking-[-0.03em] text-white sm:text-[3.4rem]">
            {content.h1}
          </h1>
          {content.intro ? <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-night-text">{content.intro}</p> : null}
        </div>
      </div>

      <main id="main" className="relative mx-auto max-w-6xl px-4 sm:px-6">
        {entry.kind === "calculator" ? (
          <div className="relative z-10 -mt-20">
            <Calculator
              market={market}
              dict={dict}
              preset={entry.preset}
              siteName={site.name}
            />
          </div>
        ) : null}
        {entry.kind === "converter" ? (
          <div className="relative z-10 -mt-20">
            <Converter dict={dict} locale={market.locale} imperialFirst={market.defaultUnits === "imperial"} />
          </div>
        ) : null}

        {entry.group === "home" ? <PromoVideo market={entry.market} dict={dict} /> : null}

        {entry.widget === "targetsTable" ? <TargetsTable market={market} dict={dict} /> : null}
        {entry.widget === "thicknessChart" ? <ThicknessChart market={market} dict={dict} /> : null}

        {diagram ? (
          <figure className="mt-14 max-w-4xl">
            {/* Links to the full-size file so phones can zoom into the labels. */}
            <a href={atticDiagramPath(entry.market)} className="block">
              <Image
                src={atticDiagramPath(entry.market)}
                alt={diagram.alt}
                width={DIAGRAM_SIZE.width}
                height={DIAGRAM_SIZE.height}
                className="block h-auto w-full rounded-[var(--radius-card)] border border-line"
              />
            </a>
            <figcaption className="mt-3 max-w-3xl text-sm leading-relaxed text-muted">{diagram.caption}</figcaption>
          </figure>
        ) : null}

        <article className={`prose ${isTool || entry.widget ? "mt-14" : "mt-10"}`} dangerouslySetInnerHTML={{ __html: content.html }} />

        <Faq title={dict.page.faqTitle} faqs={content.faqs} />
        {isTool || entry.group === "home" ? <RelatedLinks title={dict.page.related} links={related} /> : null}

        <p className="mt-12 text-xs text-faint">
          {tpl(dict.page.updated, { date: fmtDate(MARKETS[entry.market].lang, site.updated) })}
        </p>
      </main>

      <Footer market={entry.market} dict={dict} tools={tools} company={company} legal={legal} />
    </>
  );
}
