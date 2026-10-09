import type { Metadata } from "next";
import Link from "next/link";
import { search, TEAM_BY_SLUG, getBoard } from "@/lib/data";
import { SearchBox } from "@/components/SearchBox";
import { ProspectTable } from "@/components/prospects";
import { ArticleRow } from "@/components/articles";
import { TeamLogo } from "@/components/TeamLogo";
import { PageTitle, Card, Badge } from "@/components/ui";

export const metadata: Metadata = { title: "Search" };

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const r = search(q);
  const total = r.prospects.length + r.teams.length + r.articles.length + r.portal.length + r.threads.length;
  return (
    <div className="mx-auto max-w-7xl px-4 py-5">
      <PageTitle kicker="Search" title={q ? `Results for “${q}”` : "Search"} sub={q ? `${total} matches` : "Find prospects, teams, portal entries, articles and threads."} />
      <div className="mb-6 max-w-2xl"><SearchBox defaultValue={q} large /></div>
      {q && total === 0 && <Card className="p-6 text-center text-gray-600">Nothing matched. Try a last name, a school, or a team.</Card>}
      {r.teams.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-2 font-display text-xl font-bold uppercase text-navy">Teams</h2>
          <div className="flex flex-wrap gap-2">{r.teams.map((t) => <Link key={t.slug} href={`/teams/${t.slug}`} className="flex items-center gap-2 rounded border border-line bg-white px-3 py-1.5 text-sm font-semibold hover:border-brand"><TeamLogo team={t} size={22} />{t.siteName} <span className="text-gray-400">({t.name})</span></Link>)}</div>
        </section>
      )}
      {r.prospects.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-2 font-display text-xl font-bold uppercase text-navy">Prospects</h2>
          <ProspectTable prospects={r.prospects} />
        </section>
      )}
      {r.portal.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-2 font-display text-xl font-bold uppercase text-navy">Transfer Portal</h2>
          <ul className="divide-y divide-line rounded border border-line bg-white">{r.portal.map((e) => <li key={e.id} className="flex items-center gap-3 px-3 py-2 text-sm"><Link href={`/transfer-portal/${e.slug}`} className="flex-1 font-semibold hover:text-brand">{e.name}</Link><span>{e.position}</span><TeamLogo team={TEAM_BY_SLUG[e.fromTeam]} size={20} /><Badge>{e.status}</Badge></li>)}</ul>
        </section>
      )}
      {r.articles.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-2 font-display text-xl font-bold uppercase text-navy">News</h2>
          <div className="divide-y divide-line rounded border border-line bg-white px-3">{r.articles.map((a) => <ArticleRow key={a.slug} article={a} compact />)}</div>
        </section>
      )}
      {r.threads.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-2 font-display text-xl font-bold uppercase text-navy">Forum Threads</h2>
          <ul className="divide-y divide-line rounded border border-line bg-white">{r.threads.map((t) => <li key={t.slug} className="px-3 py-2 text-sm"><Link href={`/forums/${t.boardSlug}/${t.slug}`} className="font-semibold hover:text-brand">{t.title}</Link><span className="block text-xs text-gray-500">{getBoard(t.boardSlug)?.name}</span></li>)}</ul>
        </section>
      )}
      {!q && <p className="text-sm text-gray-500">Tip: search a prospect&apos;s last name, a high school, or a team site name like &ldquo;{TEAM_BY_SLUG["georgia"].siteName}&rdquo;.</p>}
    </div>
  );
}
