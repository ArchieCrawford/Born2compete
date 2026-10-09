import Link from "next/link";

export function SectionTitle({ children, href, action }: { children: React.ReactNode; href?: string; action?: string }) {
  return (
    <div className="mb-3 flex items-end justify-between border-b-2 border-navy pb-1">
      <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-navy">{children}</h2>
      {href && (
        <Link href={href} className="text-xs font-semibold uppercase tracking-wider text-brand hover:underline">
          {action ?? "View all"} →
        </Link>
      )}
    </div>
  );
}

export function PageTitle({ kicker, title, sub }: { kicker?: string; title: string; sub?: React.ReactNode }) {
  return (
    <div className="mb-5">
      {kicker && <div className="text-xs font-bold uppercase tracking-widest text-brand">{kicker}</div>}
      <h1 className="font-display text-4xl font-bold uppercase leading-none tracking-wide text-navy sm:text-5xl">{title}</h1>
      {sub && <div className="mt-2 text-sm text-gray-600">{sub}</div>}
    </div>
  );
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded border border-line bg-white ${className}`}>{children}</div>;
}

export function Badge({ children, tone = "gray" }: { children: React.ReactNode; tone?: "gray" | "red" | "green" | "navy" | "gold" }) {
  const tones = {
    gray: "bg-gray-100 text-gray-700",
    red: "bg-brand text-white",
    green: "bg-emerald-100 text-emerald-800",
    navy: "bg-navy text-white",
    gold: "bg-gold text-navy",
  };
  return <span className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${tones[tone]}`}>{children}</span>;
}

export function PremiumTag() {
  return <Badge tone="gold">Premium</Badge>;
}

export function Breadcrumbs({ items }: { items: { href?: string; label: string }[] }) {
  return (
    <nav className="mb-3 text-xs text-gray-500" aria-label="Breadcrumb">
      {items.map((it, i) => (
        <span key={i}>
          {i > 0 && <span className="mx-1.5">/</span>}
          {it.href ? <Link href={it.href} className="hover:text-brand hover:underline">{it.label}</Link> : <span className="text-gray-700">{it.label}</span>}
        </span>
      ))}
    </nav>
  );
}

export function Pagination({ page, pages, makeHref }: { page: number; pages: number; makeHref: (p: number) => string }) {
  if (pages <= 1) return null;
  const items: number[] = [];
  for (let p = Math.max(1, page - 2); p <= Math.min(pages, page + 2); p++) items.push(p);
  return (
    <div className="mt-4 flex items-center justify-center gap-1 text-sm">
      {page > 1 && <Link href={makeHref(page - 1)} className="rounded border border-line bg-white px-3 py-1 hover:bg-gray-50">Prev</Link>}
      {items[0] > 1 && <Link href={makeHref(1)} className="rounded border border-line bg-white px-3 py-1 hover:bg-gray-50">1</Link>}
      {items[0] > 2 && <span className="px-1">…</span>}
      {items.map((p) => (
        <Link key={p} href={makeHref(p)} className={`rounded border px-3 py-1 ${p === page ? "border-navy bg-navy text-white" : "border-line bg-white hover:bg-gray-50"}`}>
          {p}
        </Link>
      ))}
      {items[items.length - 1] < pages - 1 && <span className="px-1">…</span>}
      {items[items.length - 1] < pages && <Link href={makeHref(pages)} className="rounded border border-line bg-white px-3 py-1 hover:bg-gray-50">{pages}</Link>}
      {page < pages && <Link href={makeHref(page + 1)} className="rounded border border-line bg-white px-3 py-1 hover:bg-gray-50">Next</Link>}
    </div>
  );
}

export function SubscribeBox({ siteName }: { siteName?: string }) {
  return (
    <div className="rounded border border-line bg-gradient-to-br from-navy to-navy-2 p-4 text-white">
      <div className="text-xs font-bold uppercase tracking-widest text-gold">Premium</div>
      <div className="mt-1 font-display text-2xl font-bold uppercase leading-tight">
        {siteName ? `Join ${siteName}` : "Join Born2Compete"}
      </div>
      <p className="mt-2 text-sm text-white/80">Insider recruiting intel, the full rankings database, FutureCast predictions and the best fan community in college sports.</p>
      <Link href="/subscribe" className="mt-3 inline-block rounded bg-brand px-4 py-2 font-display text-base font-bold uppercase tracking-wide hover:bg-brand-2">
        Subscribe now
      </Link>
    </div>
  );
}
