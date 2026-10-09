import Link from "next/link";
import type { Sport } from "@/lib/types";
import { getArticles, getProspects, getTeamRankings, rankingLabel, YEARS, positionsFor } from "@/lib/data";
import { HeroArticle, ArticleCard, ArticleRow } from "./articles";
import { ProspectCard } from "./prospects";
import { TopProspectsWidget, TeamRankingsWidget, RecentCommitsWidget, FutureCastWidget } from "./widgets";
import { PageTitle, SectionTitle, SubscribeBox } from "./ui";
import { TeamLogo } from "./TeamLogo";

export function SportHub({ sport }: { sport: Sport }) {
  const name = sport === "football" ? "Football" : "Basketball";
  const articles = getArticles({ sport });
  const [hero, ...rest] = articles;
  const year = YEARS[sport][0];
  const top = getProspects({ sport, year }).slice(0, 6);
  const teams = getTeamRankings(sport, year).slice(0, 5);
  return (
    <div className="mx-auto max-w-7xl px-4 py-5">
      <PageTitle kicker="Recruiting" title={`${name} Recruiting`} sub={<>Rankings, commitments and intel across the {YEARS[sport].join(", ")} classes.</>} />
      <div className="mb-5 flex flex-wrap gap-2">
        {YEARS[sport].map((y) => (
          <Link key={y} href={`/rankings/player/${sport}/${y}`} className="rounded border border-line bg-white px-3 py-1.5 text-sm font-bold hover:border-brand">{y} {rankingLabel(sport)}</Link>
        ))}
        <Link href={`/rankings/team/${sport}/${year}`} className="rounded border border-line bg-white px-3 py-1.5 text-sm font-bold hover:border-brand">Team Rankings</Link>
        <Link href={`/transfer-portal?sport=${sport}`} className="rounded border border-line bg-white px-3 py-1.5 text-sm font-bold hover:border-brand">Transfer Portal</Link>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {hero && <HeroArticle article={hero} />}
          <div className="grid gap-4 sm:grid-cols-2">{rest.slice(0, 4).map((a) => <ArticleCard key={a.slug} article={a} />)}</div>
          <section>
            <SectionTitle href={`/rankings/player/${sport}/${year}`} action={`Full ${rankingLabel(sport)}`}>{year} Top Prospects</SectionTitle>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{top.map((p) => <ProspectCard key={p.slug} p={p} />)}</div>
          </section>
          <section>
            <SectionTitle href={`/rankings/team/${sport}/${year}`}>Team Rankings Leaders</SectionTitle>
            <div className="grid gap-3 sm:grid-cols-5">
              {teams.map((r) => (
                <Link key={r.team.slug} href={`/teams/${r.team.slug}`} className="rounded border border-line bg-white p-3 text-center hover:border-brand">
                  <div className="font-display text-3xl font-bold text-gray-300">#{r.rank}</div>
                  <TeamLogo team={r.team} size={44} className="mx-auto" />
                  <div className="mt-1 font-display text-lg font-bold uppercase leading-tight text-navy">{r.team.name}</div>
                  <div className="text-xs text-gray-500">{r.commits.length} commits · {r.points} pts</div>
                </Link>
              ))}
            </div>
          </section>
          <section>
            <SectionTitle href={`/rankings/player/${sport}/${year}`}>Position Rankings</SectionTitle>
            <div className="flex flex-wrap gap-2">
              {positionsFor(sport).map((pos) => (
                <Link key={pos} href={`/rankings/player/${sport}/${year}?position=${pos}`} className="rounded-full border border-line bg-white px-3 py-1 text-sm font-bold hover:border-brand">{pos}</Link>
              ))}
            </div>
          </section>
          <section>
            <SectionTitle href="/news">More {name} News</SectionTitle>
            <div className="divide-y divide-line rounded border border-line bg-white px-3">{rest.slice(4).map((a) => <ArticleRow key={a.slug} article={a} />)}</div>
          </section>
        </div>
        <aside className="space-y-5">
          <SubscribeBox />
          <TopProspectsWidget sport={sport} year={year} />
          <TeamRankingsWidget sport={sport} year={year} />
          <RecentCommitsWidget sport={sport} />
          {sport === "football" && <FutureCastWidget />}
        </aside>
      </div>
    </div>
  );
}
