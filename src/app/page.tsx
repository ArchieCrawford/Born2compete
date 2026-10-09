import Link from "next/link";
import { getArticles, trendingProspects, getPortal, TEAM_BY_SLUG, fmtDate, CAMPS } from "@/lib/data";
import { HeroArticle, ArticleCard, ArticleRow, HeadlineList } from "@/components/articles";
import { ProspectCard } from "@/components/prospects";
import { TopProspectsWidget, TeamRankingsWidget, RecentCommitsWidget, FutureCastWidget, HotThreadsWidget } from "@/components/widgets";
import { SectionTitle, SubscribeBox, Badge } from "@/components/ui";
import { TeamLogo } from "@/components/TeamLogo";
import { Stars } from "@/components/Stars";

export default function Home() {
  const articles = getArticles();
  const [hero, ...rest] = articles;
  const secondary = rest.slice(0, 2);
  const headlines = rest.slice(2, 10);
  const feed = rest.slice(10, 22);
  const trending = trendingProspects(6);
  const portal = getPortal({ limit: 6 });
  const hoops = getArticles({ sport: "basketball", limit: 3 });

  return (
    <div className="mx-auto max-w-7xl px-4 py-5">
      {/* top grid */}
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <HeroArticle article={hero} />
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {secondary.map((a) => <ArticleCard key={a.slug} article={a} />)}
          </div>
        </div>
        <div className="rounded border border-line bg-white">
          <div className="border-b border-line bg-gray-50 px-3 py-2 font-display text-lg font-bold uppercase tracking-wide text-navy">Top Headlines</div>
          <div className="px-3"><HeadlineList articles={headlines} /></div>
          <Link href="/news" className="block border-t border-line px-3 py-2 text-center text-xs font-bold uppercase tracking-wider text-brand hover:underline">More news →</Link>
        </div>
      </div>

      {/* trending prospects */}
      <section className="mt-8">
        <SectionTitle href="/rankings/player/football/2026" action="2026 Rivals250">Trending Prospects</SectionTitle>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {trending.map((p) => <ProspectCard key={p.slug} p={p} rankLabel={p.committedTo ? "Committed" : "Hot board"} />)}
        </div>
      </section>

      {/* main feed + sidebar */}
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SectionTitle href="/news">Latest Recruiting News</SectionTitle>
          <div className="divide-y divide-line rounded border border-line bg-white px-3">
            {feed.map((a) => <ArticleRow key={a.slug} article={a} />)}
          </div>

          <section className="mt-8">
            <SectionTitle href="/transfer-portal" action="Portal feed">Transfer Portal</SectionTitle>
            <div className="overflow-hidden rounded border border-line bg-white">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-left text-[11px] uppercase tracking-wider text-gray-500">
                  <tr><th className="px-3 py-2">Player</th><th>Pos</th><th>From</th><th>To</th><th>Status</th><th className="pr-3 text-right">Entered</th></tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {portal.map((e) => (
                    <tr key={e.id}>
                      <td className="px-3 py-2">
                        <Link href={`/transfer-portal/${e.slug}`} className="font-semibold hover:text-brand">{e.name}</Link>
                        <div className="flex items-center gap-1 text-[11px] text-gray-500"><Stars n={e.stars} size={9} /> {e.rating.toFixed(2)}</div>
                      </td>
                      <td className="font-semibold">{e.position}</td>
                      <td><span className="flex items-center gap-1.5"><TeamLogo team={TEAM_BY_SLUG[e.fromTeam]} size={20} />{TEAM_BY_SLUG[e.fromTeam].abbr}</span></td>
                      <td>{e.toTeam ? <span className="flex items-center gap-1.5"><TeamLogo team={TEAM_BY_SLUG[e.toTeam]} size={20} />{TEAM_BY_SLUG[e.toTeam].abbr}</span> : <span className="text-gray-400">—</span>}</td>
                      <td><Badge tone={e.status === "Committed" ? "green" : e.status === "Withdrawn" ? "gray" : "navy"}>{e.status}</Badge></td>
                      <td className="pr-3 text-right text-gray-500">{fmtDate(e.enteredAt, { month: "numeric", day: "numeric" })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mt-8">
            <SectionTitle href="/basketball">Basketball Recruiting</SectionTitle>
            <div className="grid gap-4 sm:grid-cols-3">
              {hoops.map((a) => <ArticleCard key={a.slug} article={a} />)}
            </div>
          </section>

          <section className="mt-8">
            <SectionTitle href="/camps" action="Full schedule">Camp Series</SectionTitle>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {CAMPS.slice(0, 3).map((c) => (
                <Link key={c.slug} href="/camps" className="rounded border border-line bg-white p-3 hover:border-brand">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-brand">{c.type}</div>
                  <div className="font-display text-xl font-bold uppercase leading-tight text-navy">{c.name}</div>
                  <div className="text-xs text-gray-600">{c.city}, {c.state} · {fmtDate(c.date)}</div>
                </Link>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-5">
          <SubscribeBox />
          <TopProspectsWidget />
          <TeamRankingsWidget />
          <RecentCommitsWidget />
          <FutureCastWidget />
          <HotThreadsWidget />
        </aside>
      </div>
    </div>
  );
}
