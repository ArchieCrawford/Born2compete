import Link from "next/link";
import { getProspects, getTeamRankings, getThreads, latestPredictions, recentCommits, rankingLabel, TEAM_BY_SLUG, timeAgo, fmtDate, prospectName, getBoard } from "@/lib/data";
import type { Sport } from "@/lib/types";
import { ProspectMiniRow } from "./prospects";
import { TeamLogo } from "./TeamLogo";
import { Avatar } from "./Avatar";
import { Stars } from "./Stars";
import { Card } from "./ui";

function WidgetHead({ title, href, action = "Full list" }: { title: string; href?: string; action?: string }) {
  return (
    <div className="flex items-center justify-between border-b border-line bg-gray-50 px-3 py-2">
      <h3 className="font-display text-lg font-bold uppercase tracking-wide text-navy">{title}</h3>
      {href && <Link href={href} className="text-[11px] font-bold uppercase tracking-wider text-brand hover:underline">{action} →</Link>}
    </div>
  );
}

export function TopProspectsWidget({ sport = "football", year = 2026, limit = 10 }: { sport?: Sport; year?: number; limit?: number }) {
  const list = getProspects({ sport, year }).slice(0, limit);
  return (
    <Card>
      <WidgetHead title={`${year} ${rankingLabel(sport)}`} href={`/rankings/player/${sport}/${year}`} />
      <ul className="divide-y divide-line px-3">
        {list.map((p) => <ProspectMiniRow key={p.slug} p={p} />)}
      </ul>
    </Card>
  );
}

export function TeamRankingsWidget({ sport = "football", year = 2026, limit = 10 }: { sport?: Sport; year?: number; limit?: number }) {
  const rows = getTeamRankings(sport, year).slice(0, limit);
  return (
    <Card>
      <WidgetHead title={`${year} Team Rankings`} href={`/rankings/team/${sport}/${year}`} />
      <table className="w-full text-sm">
        <thead className="text-[10px] uppercase tracking-wider text-gray-500">
          <tr><th className="w-8 py-1 text-center">Rk</th><th className="text-left">Team</th><th className="w-12 text-center">Cmts</th><th className="w-14 pr-3 text-right">Pts</th></tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.map((r) => (
            <tr key={r.team.slug}>
              <td className="py-1.5 text-center font-display text-base font-bold text-gray-400">{r.rank}</td>
              <td>
                <Link href={`/teams/${r.team.slug}`} className="flex items-center gap-2 font-semibold hover:text-brand">
                  <TeamLogo team={r.team} size={22} />{r.team.name}
                </Link>
              </td>
              <td className="text-center text-gray-700">{r.commits.length}</td>
              <td className="pr-3 text-right font-semibold text-navy">{r.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

export function RecentCommitsWidget({ sport = "football", limit = 8 }: { sport?: Sport; limit?: number }) {
  const list = recentCommits(limit, sport);
  return (
    <Card>
      <WidgetHead title="Latest Commitments" href={`/rankings/player/${sport}/2026?status=committed`} action="All commits" />
      <ul className="divide-y divide-line">
        {list.map((p) => {
          const t = TEAM_BY_SLUG[p.committedTo!];
          return (
            <li key={p.slug} className="flex items-center gap-2.5 px-3 py-2">
              <TeamLogo team={t} size={30} />
              <div className="min-w-0 flex-1">
                <Link href={`/prospects/${p.slug}`} className="block truncate text-sm font-semibold hover:text-brand">{prospectName(p)}</Link>
                <div className="flex items-center gap-1.5 text-[11px] text-gray-500"><Stars n={p.stars} size={9} /> {p.position} · {p.year} · {t.name}</div>
              </div>
              <span className="text-[11px] text-gray-400">{fmtDate(p.commitDate!, { month: "numeric", day: "numeric" })}</span>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

export function FutureCastWidget({ limit = 6 }: { limit?: number }) {
  const list = latestPredictions(limit);
  return (
    <Card>
      <WidgetHead title="FutureCast" href="/futurecast" action="All picks" />
      <ul className="divide-y divide-line">
        {list.map((pr, i) => {
          const t = TEAM_BY_SLUG[pr.teamSlug];
          return (
            <li key={i} className="flex items-center gap-2.5 px-3 py-2 text-sm">
              <Avatar name={prospectName(pr.prospect)} size={30} />
              <div className="min-w-0 flex-1">
                <div className="truncate">
                  <span className="font-semibold">{pr.analyst}</span> <span className="text-gray-500">picks</span>{" "}
                  <Link href={`/prospects/${pr.prospect.slug}`} className="font-semibold hover:text-brand">{prospectName(pr.prospect)}</Link>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                  <TeamLogo team={t} size={14} /> to {t.name} · confidence {pr.confidence}/10
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

export function HotThreadsWidget({ boardSlug, limit = 6 }: { boardSlug?: string; limit?: number }) {
  const list = getThreads(boardSlug, limit);
  return (
    <Card>
      <WidgetHead title={boardSlug ? "Message Board" : "Hot on the Boards"} href={boardSlug ? `/forums/${boardSlug}` : "/forums"} action="Forums" />
      <ul className="divide-y divide-line">
        {list.map((t) => (
          <li key={t.slug} className="px-3 py-2">
            <Link href={`/forums/${t.boardSlug}/${t.slug}`} className="block text-sm font-semibold leading-snug hover:text-brand">
              {t.pinned && <span className="mr-1 text-brand">📌</span>}{t.title}
            </Link>
            <div className="text-[11px] text-gray-500">
              {!boardSlug && <span>{getBoard(t.boardSlug)?.name} · </span>}
              {t.replies} replies · {timeAgo(t.lastPostAt)}
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
