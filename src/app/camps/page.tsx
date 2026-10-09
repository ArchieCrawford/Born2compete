import type { Metadata } from "next";
import Link from "next/link";
import { CAMPS, getArticles, fmtDate } from "@/lib/data";
import { ArticleRow } from "@/components/articles";
import { PageTitle, SubscribeBox, Badge } from "@/components/ui";

export const metadata: Metadata = { title: "Camp Series" };

export default function CampsPage() {
  const news = getArticles({ category: "Camps" });
  return (
    <div className="mx-auto max-w-7xl px-4 py-5">
      <PageTitle kicker="Events" title="Camp Series" sub="Regional camps feed into the invite-only Five-Star. Our analysts evaluate every rep in person." />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="grid gap-3 sm:grid-cols-2">
            {CAMPS.map((c) => (
              <div key={c.slug} className="rounded border border-line bg-white p-4">
                <div className="mb-1 flex items-center gap-2"><Badge tone={c.type === "Five-Star" ? "gold" : "navy"}>{c.type}</Badge><span className="text-xs text-gray-500">{c.sport}</span></div>
                <div className="font-display text-2xl font-bold uppercase leading-tight text-navy">{c.name}</div>
                <div className="text-sm text-gray-700">{c.city}, {c.state} · {fmtDate(c.date, { weekday: "short", month: "long", day: "numeric", year: "numeric" })}</div>
                <p className="mt-2 text-sm text-gray-600">{c.description}</p>
                <Link href="/subscribe" className="mt-3 inline-block rounded border border-navy px-3 py-1 text-xs font-bold uppercase tracking-wider text-navy hover:bg-navy hover:text-white">Register</Link>
              </div>
            ))}
          </div>
          <section>
            <h2 className="mb-2 border-b-2 border-navy pb-1 font-display text-2xl font-bold uppercase text-navy">Camp Coverage</h2>
            <div className="divide-y divide-line rounded border border-line bg-white px-3">{news.map((a) => <ArticleRow key={a.slug} article={a} />)}</div>
          </section>
        </div>
        <aside><SubscribeBox /></aside>
      </div>
    </div>
  );
}
