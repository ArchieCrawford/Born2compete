import type { Metadata } from "next";
import Link from "next/link";
import { getPortal, getPortalTeamRankings, isSport, positionsFor, TEAM_BY_SLUG, TEAMS, fmtDate, fmtMoney, heightStr, SPORTS } from "@/lib/data";
import { FilterBar } from "@/components/Filters";
import { PageTitle, Badge, SubscribeBox, Card } from "@/components/ui";
import { TeamLogo } from "@/components/TeamLogo";
import { Stars } from "@/components/Stars";
import { Avatar } from "@/components/Avatar";
import { HotThreadsWidget } from "@/components/widgets";

export const metadata: Metadata = { title: "Transfer Portal" };

type SP = { sport?: string; position?: string; status?: string; team?: string; view?: string };

export default async function PortalPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const sport = isSport(sp.sport ?? "") ? (sp.sport as "football" | "basketball") : "football";
  const list = getPortal({ sport, position: sp.position, status: sp.status, team: sp.team });
  const teamRows = getPortalTeamRankings(sport);
  const query: Record<string, string> = Object.fromEntries(Object.entries(sp).filter(([, v]) => v) as [string, string][]);
  const view = sp.view === "teams" ? "teams" : "feed";

  return (
    <div className="mx-auto max-w-7xl px-4 py-5">
      <PageTitle kicker="Roster movement" title="Transfer Portal" sub="Every entry, commitment and withdrawal, with ratings and NIL valuations. Updated continuously." />
      <div className="mb-3 flex gap-2 text-sm">
        <Link href={`/transfer-portal?${new URLSearchParams({ ...query, view: "feed" })}`} className={`rounded px-3 py-1 font-bold ${view === "feed" ? "bg-navy text-white" : "border border-line bg-white hover:border-brand"}`}>Portal Feed</Link>
        <Link href={`/transfer-portal?${new URLSearchParams({ ...query, view: "teams" })}`} className={`rounded px-3 py-1 font-bold ${view === "teams" ? "bg-navy text-white" : "border border-line bg-white hover:border-brand"}`}>Portal Team Rankings</Link>
      </div>
      <FilterBar
        basePath="/transfer-portal"
        query={query}
        filters={[
          { name: "sport", label: "Sport", value: sp.sport ?? "football", options: SPORTS.map((s) => ({ value: s.slug, label: s.name })) },
          { name: "position", label: "Position", value: sp.position ?? "", allLabel: "All", options: positionsFor(sport).map((p) => ({ value: p, label: p })) },
          { name: "status", label: "Status", value: sp.status ?? "", allLabel: "All", options: ["Entered", "Committed", "Withdrawn"].map((s) => ({ value: s, label: s })) },
          { name: "team", label: "Team", value: sp.team ?? "", allLabel: "All", options: TEAMS.map((t) => ({ value: t.slug, label: t.name })) },
        ]}
      />
      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-3">
          {view === "feed" ? (
            <div className="overflow-x-auto rounded border border-line bg-white">
              <table className="table-rank w-full min-w-[760px] text-sm">
                <thead className="bg-navy text-left font-display text-sm uppercase tracking-wider text-white">
                  <tr><th>Player</th><th className="w-14">Pos</th><th className="w-24">Ht / Wt</th><th className="w-28">Rating</th><th>From</th><th>To</th><th className="w-24">Status</th><th className="w-24 text-right">NIL</th><th className="w-24 text-right">Entered</th></tr>
                </thead>
                <tbody>
                  {list.map((e) => (
                    <tr key={e.id} className="border-t border-line">
                      <td><Link href={`/transfer-portal/${e.slug}`} className="flex items-center gap-2 font-semibold hover:text-brand"><Avatar name={e.name} size={32} />{e.name}<span className="block text-[11px] font-normal text-gray-500">{e.eligibility}</span></Link></td>
                      <td className="font-semibold">{e.position}</td>
                      <td className="whitespace-nowrap">{heightStr(e.heightIn)} / {e.weightLb}</td>
                      <td><span className="flex items-center gap-1.5"><Stars n={e.stars} size={10} /><span className="font-display text-base font-bold text-navy">{e.rating.toFixed(2)}</span></span></td>
                      <td><Link href={`/teams/${e.fromTeam}`} className="flex items-center gap-1.5 hover:text-brand"><TeamLogo team={TEAM_BY_SLUG[e.fromTeam]} size={22} />{TEAM_BY_SLUG[e.fromTeam].name}</Link></td>
                      <td>{e.toTeam ? <Link href={`/teams/${e.toTeam}`} className="flex items-center gap-1.5 hover:text-brand"><TeamLogo team={TEAM_BY_SLUG[e.toTeam]} size={22} />{TEAM_BY_SLUG[e.toTeam].name}</Link> : <span className="text-gray-400">Undecided</span>}</td>
                      <td><Badge tone={e.status === "Committed" ? "green" : e.status === "Withdrawn" ? "gray" : "navy"}>{e.status}</Badge></td>
                      <td className="text-right font-semibold">{fmtMoney(e.nilValue)}</td>
                      <td className="text-right text-gray-500">{fmtDate(e.enteredAt, { month: "numeric", day: "numeric", year: "2-digit" })}</td>
                    </tr>
                  ))}
                  {list.length === 0 && <tr><td colSpan={9} className="py-8 text-center text-gray-500">No portal entries match those filters.</td></tr>}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto rounded border border-line bg-white">
              <table className="table-rank w-full min-w-[640px] text-sm">
                <thead className="bg-navy text-left font-display text-sm uppercase tracking-wider text-white">
                  <tr><th className="w-12 text-center">Rk</th><th>Team</th><th className="w-20 text-center">In</th><th className="w-20 text-center">Out</th><th className="w-28 text-right">Incoming NIL</th><th className="w-24 text-right">Points</th></tr>
                </thead>
                <tbody>
                  {teamRows.map((r, i) => (
                    <tr key={r.team.slug} className="border-t border-line">
                      <td className="text-center font-display text-lg font-bold text-navy">{i + 1}</td>
                      <td><Link href={`/teams/${r.team.slug}`} className="flex items-center gap-2.5 font-semibold hover:text-brand"><TeamLogo team={r.team} size={30} />{r.team.name}<span className="text-xs font-normal text-gray-500">{r.team.conference}</span></Link></td>
                      <td className="text-center text-emerald-700">{r.incoming.length}</td>
                      <td className="text-center text-brand">{r.outgoing.length}</td>
                      <td className="text-right">{fmtMoney(r.nil)}</td>
                      <td className="text-right font-display text-base font-bold text-navy">{r.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <aside className="space-y-5">
          <SubscribeBox />
          <Card>
            <div className="border-b border-line bg-gray-50 px-3 py-2"><h3 className="font-display text-lg font-bold uppercase text-navy">Portal at a glance</h3></div>
            <dl className="grid grid-cols-2 gap-y-2 p-3 text-sm">
              <dt className="text-gray-500">Entries</dt><dd className="font-semibold">{getPortal({ sport }).length}</dd>
              <dt className="text-gray-500">Committed</dt><dd className="font-semibold">{getPortal({ sport, status: "Committed" }).length}</dd>
              <dt className="text-gray-500">Still available</dt><dd className="font-semibold">{getPortal({ sport, status: "Entered" }).length}</dd>
              <dt className="text-gray-500">Withdrawn</dt><dd className="font-semibold">{getPortal({ sport, status: "Withdrawn" }).length}</dd>
            </dl>
          </Card>
          <HotThreadsWidget boardSlug="transfer-portal" />
        </aside>
      </div>
    </div>
  );
}
