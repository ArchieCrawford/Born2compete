import type { Metadata } from "next";
import Link from "next/link";
import { getArticles, ARTICLE_CATEGORIES } from "@/lib/data";
import { ArticleRow } from "@/components/articles";
import { PageTitle, SubscribeBox } from "@/components/ui";
import { RecentCommitsWidget, HotThreadsWidget } from "@/components/widgets";

export const metadata: Metadata = { title: "Recruiting News" };

export default async function NewsPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  const list = getArticles({ category: category || undefined });
  return (
    <div className="mx-auto max-w-7xl px-4 py-5">
      <PageTitle kicker="Latest" title="Recruiting News" sub="Commitments, rankings analysis, visits, portal intel and camp coverage from our national staff." />
      <div className="mb-4 flex flex-wrap gap-2">
        <Link href="/news" className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider ${!category ? "border-navy bg-navy text-white" : "border-line bg-white hover:border-brand"}`}>All</Link>
        {ARTICLE_CATEGORIES.map((c) => (
          <Link key={c} href={`/news?category=${encodeURIComponent(c)}`} className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider ${category === c ? "border-navy bg-navy text-white" : "border-line bg-white hover:border-brand"}`}>{c}</Link>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="divide-y divide-line rounded border border-line bg-white px-3 lg:col-span-2">
          {list.map((a) => <ArticleRow key={a.slug} article={a} />)}
          {list.length === 0 && <p className="py-8 text-center text-gray-500">No stories in this category yet.</p>}
        </div>
        <aside className="space-y-5">
          <SubscribeBox />
          <RecentCommitsWidget />
          <HotThreadsWidget />
        </aside>
      </div>
    </div>
  );
}
