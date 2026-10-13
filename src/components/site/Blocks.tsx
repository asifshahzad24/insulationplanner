import Link from "next/link";
import type { Faq as FaqItem } from "@/lib/content";

export function JsonLd({ data }: { data: (object | null)[] }) {
  return (
    <>
      {data.filter(Boolean).map((d, i) => (
        <script
          key={i}
          type="application/ld+json"
          // JSON.stringify output is safe here; "<" is escaped to avoid closing the script tag.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(d).replace(/</g, "\\u003c") }}
        />
      ))}
    </>
  );
}

export function Breadcrumbs({ items }: { items: { name: string; href: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4 text-[12.5px] text-night-text">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((it, i) => (
          <li key={it.href} className="flex items-center gap-1.5">
            {i > 0 ? <span aria-hidden>/</span> : null}
            {i < items.length - 1 ? (
              <Link href={it.href} className="hover:text-white">
                {it.name}
              </Link>
            ) : (
              <span aria-current="page" className="text-white/80">
                {it.name}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function Faq({ title, faqs }: { title: string; faqs: FaqItem[] }) {
  if (!faqs.length) return null;
  return (
    <section className="mt-16 max-w-3xl" aria-labelledby="faq-title">
      <h2 id="faq-title" className="font-display text-[1.6rem] font-bold tracking-tight text-ink">
        {title}
      </h2>
      <div className="mt-5 divide-y divide-line rounded-2xl border border-line bg-surface">
        {faqs.map((f) => (
          <details key={f.q} className="group px-5 py-4">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-semibold text-ink">
              <span>{f.q}</span>
              <span aria-hidden className="mt-0.5 text-faint transition group-open:rotate-45">
                +
              </span>
            </summary>
            <div className="prose mt-3 text-[15px]" dangerouslySetInnerHTML={{ __html: f.html }} />
          </details>
        ))}
      </div>
    </section>
  );
}

export function RelatedLinks({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  if (!links.length) return null;
  return (
    <section className="mt-16" aria-labelledby="related-title">
      <h2 id="related-title" className="font-display text-[1.6rem] font-bold tracking-tight text-ink">
        {title}
      </h2>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="group flex items-center justify-between rounded-xl border border-line bg-surface px-4 py-3.5 text-[15px] font-medium text-ink transition hover:border-ink"
            >
              {l.label}
              <span aria-hidden className="text-faint transition group-hover:translate-x-0.5 group-hover:text-ink">
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
