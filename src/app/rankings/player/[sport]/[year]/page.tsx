import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProspects, isSport, YEARS, SPORTS, positionsFor, STATE_LIST, rankingLabel, TEAMS } from "@/lib/data";
import { ProspectTable } from "@/components/prospects";
import { FilterBar } from "@/components/Filters";
import { PageTitle, Pagination, SubscribeBox } from "@/components/ui";
import { TeamRankingsWidget, RecentCommitsWidget } from "@/components/widgets";

type SP = { position?: string; state?: string; stars?: string; status?: string; team?: string; page?: string };

export function generateStaticParams() {
  return SPORTS.flatMap((s) => YEARS[s.slug].map((y) => ({ sport: s.slug, year: String(y) })));
}

export async function generateMetadata({ params }: { params: Promise<{ sport: string; year: string }> }): Promise<Metadata> {
  const { sport, year } = await params;
  return { title: isSport(sport) ? `${year} ${rankingLabel(sport)} Player Rankings` : "Rankings" };
}

export default async function PlayerRankings({ params, searchParams }: { params: Promise<{ sport: string; year: string }>; searchParams: Promise<SP> }) {
  const { sport, year: ys } = await params;
  const sp = await searchParams;
  const year = Number(ys);
  if (!isSport(sport) || !YEARS[sport].includes(year)) notFound();

  const PER = 50;
  const page = Math.max(1, Number(sp.page ?? 1) || 1);
  const list = getProspects({ sport, year, position: sp.position, state: sp.state, stars: sp.stars ? Number(sp.stars) : undefined, status: sp.status as "committed" | "uncommitted" | undefined, team: sp.team });
  const pages = Math.max(1, Math.ceil(list.length / PER));
  const slice = list.slice((page - 1) * PER, page * PER);
  const query: Record<string, string> = Object.fromEntries(Object.entries(sp).filter(([k, v]) => v && k !== "page") as [string, string][]);
  const makeHref = (p: number) => {
    const q = new URLSearchParams(query);
    if (p > 1) q.set("page", String(p));
    return `/rankings/player/${sport}/${year}${q.toString() ? `?${q}` : ""}`;
  };
  const filtered = !!(sp.position || sp.state || sp.stars || sp.status || sp.team);
  const showRank = sp.position && !sp.state ? "position" : sp.state && !sp.position ? "state" : filtered ? "index" : "national";

  return (
    <div className="mx-auto max-w-7xl px-4 py-5">
      <PageTitle
        kicker={`${sport} recruiting`}
        title={`${year} ${rankingLabel(sport)}${sp.position ? ` · ${sp.position}` : ""}${sp.state ? ` · ${STATE_LIST.find((s) => s.code === sp.state)?.name}` : ""}`}
        sub={<>The definitive {sport} prospect rankings for the class of {year}. {list.length.toLocaleString()} prospects{filtered ? " match your filters" : " ranked"}.</>}
      />
      <div className="mb-3 flex gap-2 text-sm">
        <span className="rounded bg-navy px-3 py-1 font-bold text-white">Player Rankings</span>
        <Link href={`/rankings/team/${sport}/${year}`} className="rounded border border-line bg-white px-3 py-1 font-bold hover:border-brand">Team Rankings</Link>
      </div>
      <FilterBar
        basePath="/rankings/player/{sport}/{year}"
        query={query}
        pathFilters={[
          { name: "sport", label: "Sport", value: sport, options: SPORTS.map((s) => ({ value: s.slug, label: s.name })) },
          { name: "year", label: "Class", value: String(year), options: YEARS[sport].map((y) => ({ value: String(y), label: String(y) })) },
        ]}
        filters={[
          { name: "position", label: "Position", value: sp.position ?? "", allLabel: "All", options: positionsFor(sport).map((p) => ({ value: p, label: p })) },
          { name: "state", label: "State", value: sp.state ?? "", allLabel: "All", options: STATE_LIST.map((s) => ({ value: s.code, label: s.name })) },
          { name: "stars", label: "Stars", value: sp.stars ?? "", allLabel: "All", options: [5, 4, 3, 2].map((s) => ({ value: String(s), label: `${s}★` })) },
          { name: "status", label: "Status", value: sp.status ?? "", allLabel: "All", options: [{ value: "committed", label: "Committed" }, { value: "uncommitted", label: "Uncommitted" }] },
          { name: "team", label: "Team", value: sp.team ?? "", allLabel: "All", options: TEAMS.map((t) => ({ value: t.slug, label: t.name })) },
        ]}
      />
      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <ProspectTable prospects={slice} showRank={showRank} startIndex={(page - 1) * PER} />
          <Pagination page={page} pages={pages} makeHref={makeHref} />
        </div>
        <aside className="space-y-5">
          <SubscribeBox />
          <TeamRankingsWidget sport={sport} year={year} />
          <RecentCommitsWidget sport={sport} />
        </aside>
      </div>
    </div>
  );
}
