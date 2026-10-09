import type { Metadata } from "next";
import Link from "next/link";
import { TEAMS, getTeamRankings } from "@/lib/data";
import { TeamLogo } from "@/components/TeamLogo";
import { PageTitle } from "@/components/ui";

export const metadata: Metadata = { title: "Team Sites" };

export default function TeamsPage() {
  const ranks = Object.fromEntries(getTeamRankings("football", 2026).map((r) => [r.team.slug, r]));
  const confs = Array.from(new Set(TEAMS.map((t) => t.conference))).sort();
  return (
    <div className="mx-auto max-w-7xl px-4 py-5">
      <PageTitle kicker="Network" title="Team Sites" sub="Every program has a dedicated site with insider coverage, a commit tracker and its own fan message board." />
      {confs.map((c) => (
        <section key={c} className="mb-8">
          <h2 className="mb-3 border-b-2 border-navy pb-1 font-display text-2xl font-bold uppercase text-navy">{c}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {TEAMS.filter((t) => t.conference === c).map((t) => (
              <Link key={t.slug} href={`/teams/${t.slug}`} className="flex items-center gap-3 rounded border border-line bg-white p-3 hover:border-brand">
                <TeamLogo team={t} size={44} />
                <div className="min-w-0">
                  <div className="truncate font-display text-xl font-bold uppercase leading-none text-navy">{t.siteName}</div>
                  <div className="text-xs text-gray-600">{t.name} {t.nickname}</div>
                  <div className="text-[11px] text-gray-500">2026 class: #{ranks[t.slug].rank} · {ranks[t.slug].commits.length} commits</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
