import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTeamRankings, isSport, YEARS, SPORTS, prospectName } from "@/lib/data";
import { FilterBar } from "@/components/Filters";
import { PageTitle, SubscribeBox } from "@/components/ui";
import { TopProspectsWidget, RecentCommitsWidget } from "@/components/widgets";
import { TeamLogo } from "@/components/TeamLogo";
import { Stars } from "@/components/Stars";

export function generateStaticParams() {
  return SPORTS.flatMap((s) => YEARS[s.slug].map((y) => ({ sport: s.slug, year: String(y) })));
}

export async function generateMetadata({ params }: { params: Promise<{ sport: string; year: string }> }): Promise<Metadata> {
  const { sport, year } = await params;
  return { title: `${year} ${sport} Team Recruiting Rankings` };
}

export default async function TeamRankings({ params, searchParams }: { params: Promise<{ sport: string; year: string }>; searchParams: Promise<{ conference?: string }> }) {
  const { sport, year: ys } = await params;
  const { conference } = await searchParams;
  const year = Number(ys);
  if (!isSport(sport) || !YEARS[sport].includes(year)) notFound();
  const all = getTeamRankings(sport, year);
  const confs = Array.from(new Set(all.map((r) => r.team.conference))).sort();
  const rows = conference ? all.filter((r) => r.team.conference === conference) : all;

  return (
    <div className="mx-auto max-w-7xl px-4 py-5">
      <PageTitle kicker={`${sport} recruiting`} title={`${year} Team Rankings`} sub="Class rankings are computed from every commitment's rating, with elite prospects weighted most heavily." />
      <div className="mb-3 flex gap-2 text-sm">
        <Link href={`/rankings/player/${sport}/${year}`} className="rounded border border-line bg-white px-3 py-1 font-bold hover:border-brand">Player Rankings</Link>
        <span className="rounded bg-navy px-3 py-1 font-bold text-white">Team Rankings</span>
      </div>
      <FilterBar
        basePath="/rankings/team/{sport}/{year}"
        query={conference ? { conference } : {}}
        pathFilters={[
          { name: "sport", label: "Sport", value: sport, options: SPORTS.map((s) => ({ value: s.slug, label: s.name })) },
          { name: "year", label: "Class", value: String(year), options: YEARS[sport].map((y) => ({ value: String(y), label: String(y) })) },
        ]}
        filters={[{ name: "conference", label: "Conference", value: conference ?? "", allLabel: "All", options: confs.map((c) => ({ value: c, label: c })) }]}
      />
      <div className="grid gap-6 lg:grid-cols-4">
        <div className="overflow-x-auto rounded border border-line bg-white lg:col-span-3">
          <table className="table-rank w-full min-w-[760px] text-sm">
            <thead className="bg-navy text-left font-display text-sm uppercase tracking-wider text-white">
              <tr>
                <th className="w-12 text-center">Rk</th>
                <th>Team</th>
                <th className="w-16 text-center">Cmts</th>
                <th className="w-12 text-center">5★</th>
                <th className="w-12 text-center">4★</th>
                <th className="w-12 text-center">3★</th>
                <th className="w-20 text-center">Avg</th>
                <th className="w-20 text-right">Points</th>
                <th>Top Commit</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.team.slug} className="border-t border-line">
                  <td className="text-center font-display text-lg font-bold text-navy">{conference ? i + 1 : r.rank}</td>
                  <td>
                    <Link href={`/teams/${r.team.slug}`} className="flex items-center gap-2.5 font-semibold hover:text-brand">
                      <TeamLogo team={r.team} size={30} />
                      <span>
                        {r.team.name}
                        <span className="block text-[11px] font-normal text-gray-500">{r.team.conference}{conference && ` · National #${r.rank}`}</span>
                      </span>
                    </Link>
                  </td>
                  <td className="text-center"><Link href={`/rankings/player/${sport}/${year}?team=${r.team.slug}`} className="font-semibold hover:text-brand">{r.commits.length}</Link></td>
                  <td className="text-center">{r.fiveStars}</td>
                  <td className="text-center">{r.fourStars}</td>
                  <td className="text-center">{r.threeStars}</td>
                  <td className="text-center">{r.avgRating ? r.avgRating.toFixed(2) : "—"}</td>
                  <td className="text-right font-display text-base font-bold text-navy">{r.points}</td>
                  <td>
                    {r.topCommit ? (
                      <Link href={`/prospects/${r.topCommit.slug}`} className="flex items-center gap-1.5 hover:text-brand">
                        <Stars n={r.topCommit.stars} size={10} />
                        <span className="font-semibold">{prospectName(r.topCommit)}</span>
                        <span className="text-xs text-gray-500">{r.topCommit.position}</span>
                      </Link>
                    ) : <span className="text-gray-400">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <aside className="space-y-5">
          <SubscribeBox />
          <TopProspectsWidget sport={sport} year={year} />
          <RecentCommitsWidget sport={sport} />
        </aside>
      </div>
    </div>
  );
}
