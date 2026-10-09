import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProspect, allProspects, getProspects, getArticles, TEAM_BY_SLUG, heightStr, prospectName, fmtDate, fmtMoney, rankingLabel, STATE_LIST } from "@/lib/data";
import { Avatar } from "@/components/Avatar";
import { Stars } from "@/components/Stars";
import { TeamLogo } from "@/components/TeamLogo";
import { CommitChip, ProspectMiniRow } from "@/components/prospects";
import { ArticleRow } from "@/components/articles";
import { Breadcrumbs, Card, Badge, SubscribeBox } from "@/components/ui";

export function generateStaticParams() {
  return allProspects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = getProspect((await params).slug);
  return { title: p ? `${prospectName(p)} - ${p.year} ${p.position} Recruiting Profile` : "Prospect" };
}

const ICON: Record<string, string> = { offer: "✉", visit: "✈", commit: "✔", decommit: "✖", ranking: "★", camp: "⛳" };

export default async function ProspectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProspect(slug);
  if (!p) notFound();
  const team = p.committedTo ? TEAM_BY_SLUG[p.committedTo] : null;
  const stateName = STATE_LIST.find((s) => s.code === p.state)?.name ?? p.state;
  const similar = getProspects({ sport: p.sport, year: p.year, position: p.position }).filter((x) => x.slug !== p.slug).slice(0, 6);
  const news = getArticles({ prospect: p.slug });
  const grouped = p.predictions.reduce<Record<string, number>>((acc, pr) => ((acc[pr.teamSlug] = (acc[pr.teamSlug] ?? 0) + 1), acc), {});
  const leaders = Object.entries(grouped).sort((a, b) => b[1] - a[1]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-5">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: `/${p.sport}`, label: p.sport === "football" ? "Football" : "Basketball" }, { href: `/rankings/player/${p.sport}/${p.year}`, label: `${p.year} ${rankingLabel(p.sport)}` }, { label: prospectName(p) }]} />

      {/* header */}
      <div className="overflow-hidden rounded border border-line bg-white">
        <div className="h-2" style={{ background: team ? `linear-gradient(90deg, ${team.primary}, ${team.secondary})` : "linear-gradient(90deg,#0b1a33,#d7263d)" }} />
        <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center">
          <Avatar name={prospectName(p)} size={112} className="ring-4 ring-gray-100" />
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Stars n={p.stars} size={18} />
              <span className="font-display text-2xl font-bold text-navy">{p.rating.toFixed(2)}</span>
              <Badge tone="navy">{p.year} {p.sport}</Badge>
              {p.committedTo ? <Badge tone="green">Committed</Badge> : <Badge tone="red">Uncommitted</Badge>}
            </div>
            <h1 className="mt-1 font-display text-5xl font-bold uppercase leading-none tracking-wide text-navy">{prospectName(p)}</h1>
            <div className="mt-2 text-sm text-gray-700">
              <span className="font-bold">{p.position}</span> · {heightStr(p.heightIn)} / {p.weightLb} lbs · {p.highSchool} · {p.hometown}, {stateName}
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-4">
              {team ? (
                <Link href={`/teams/${team.slug}`} className="flex items-center gap-2 rounded border border-line px-3 py-1.5 hover:border-brand">
                  <TeamLogo team={team} size={30} />
                  <span>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-500">Committed to</span>
                    <span className="font-display text-lg font-bold uppercase leading-none text-navy">{team.name}</span>
                  </span>
                  {p.commitDate && <span className="ml-2 text-xs text-gray-500">{fmtDate(p.commitDate)}</span>}
                </Link>
              ) : (
                <div className="rounded border border-dashed border-line px-3 py-1.5 text-sm text-gray-600">{p.offers.length} offers · decision pending</div>
              )}
              <div className="text-sm"><span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">NIL Valuation</span><div className="font-display text-xl font-bold text-navy">{fmtMoney(p.nilValue)}</div></div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center sm:w-64">
            {[
              ["National", p.nationalRank, `/rankings/player/${p.sport}/${p.year}`],
              [p.position, p.positionRank, `/rankings/player/${p.sport}/${p.year}?position=${p.position}`],
              [p.state, p.stateRank, `/rankings/player/${p.sport}/${p.year}?state=${p.state}`],
            ].map(([label, val, href]) => (
              <Link key={String(label)} href={String(href)} className="rounded bg-navy p-2 text-white hover:bg-navy-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-white/70">{label}</div>
                <div className="font-display text-3xl font-bold leading-none">{val}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="p-5">
            <h2 className="mb-2 font-display text-2xl font-bold uppercase text-navy">Scouting Report</h2>
            <p className="text-[15px] leading-7 text-gray-800">{p.bio}</p>
          </Card>

          <Card>
            <div className="flex items-center justify-between border-b border-line bg-gray-50 px-4 py-2">
              <h2 className="font-display text-xl font-bold uppercase text-navy">FutureCast</h2>
              <Link href="/futurecast" className="text-[11px] font-bold uppercase tracking-wider text-brand hover:underline">How it works</Link>
            </div>
            {p.committedTo ? (
              <div className="p-4 text-sm text-gray-600">FutureCast is closed. {p.lastName} is committed to {team!.name}.</div>
            ) : p.predictions.length === 0 ? (
              <div className="p-4 text-sm text-gray-600">No predictions logged yet. Analysts will weigh in as this recruitment develops.</div>
            ) : (
              <div className="p-4">
                <div className="mb-3 flex flex-wrap gap-2">
                  {leaders.map(([slug, n]) => (
                    <span key={slug} className="flex items-center gap-1.5 rounded-full border border-line px-2 py-1 text-xs font-semibold">
                      <TeamLogo team={TEAM_BY_SLUG[slug]} size={18} />{TEAM_BY_SLUG[slug].name} <span className="text-gray-500">{Math.round((n / p.predictions.length) * 100)}%</span>
                    </span>
                  ))}
                </div>
                <ul className="divide-y divide-line text-sm">
                  {p.predictions.map((pr, i) => (
                    <li key={i} className="flex items-center gap-3 py-2">
                      <TeamLogo team={TEAM_BY_SLUG[pr.teamSlug]} size={26} />
                      <div className="flex-1"><span className="font-semibold">{pr.analyst}</span> <span className="text-gray-500">picks</span> <span className="font-semibold">{TEAM_BY_SLUG[pr.teamSlug].name}</span></div>
                      <div className="text-xs text-gray-500">Confidence {pr.confidence}/10 · {fmtDate(pr.date)}</div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Card>

          <Card>
            <div className="border-b border-line bg-gray-50 px-4 py-2"><h2 className="font-display text-xl font-bold uppercase text-navy">Offers ({p.offers.length})</h2></div>
            <ul className="grid grid-cols-2 gap-x-4 p-4 sm:grid-cols-3 lg:grid-cols-4">
              {p.offers.map((o) => {
                const t = TEAM_BY_SLUG[o.teamSlug];
                return (
                  <li key={o.teamSlug} className="flex items-center gap-2 py-1.5 text-sm">
                    <TeamLogo team={t} size={24} />
                    <Link href={`/teams/${t.slug}`} className={`truncate hover:text-brand ${t.slug === p.committedTo ? "font-bold text-brand" : ""}`}>{t.name}</Link>
                  </li>
                );
              })}
            </ul>
          </Card>

          <Card>
            <div className="border-b border-line bg-gray-50 px-4 py-2"><h2 className="font-display text-xl font-bold uppercase text-navy">Recruiting Timeline</h2></div>
            <ol className="p-4">
              {p.timeline.map((ev, i) => (
                <li key={i} className="relative flex gap-3 pb-4 pl-1 last:pb-0">
                  <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-sm ${ev.type === "commit" ? "bg-emerald-600 text-white" : ev.type === "ranking" ? "bg-gold text-navy" : "bg-gray-200 text-gray-700"}`}>{ICON[ev.type]}</span>
                  <div>
                    <div className="text-sm font-semibold">{ev.text}</div>
                    <div className="text-xs text-gray-500">{fmtDate(ev.date)}</div>
                  </div>
                </li>
              ))}
            </ol>
          </Card>

          {news.length > 0 && (
            <Card className="px-3">
              <h2 className="pt-3 font-display text-xl font-bold uppercase text-navy">Latest News</h2>
              <div className="divide-y divide-line">{news.map((a) => <ArticleRow key={a.slug} article={a} compact />)}</div>
            </Card>
          )}
        </div>

        <aside className="space-y-5">
          <SubscribeBox siteName={team?.siteName} />
          <Card>
            <div className="border-b border-line bg-gray-50 px-3 py-2"><h3 className="font-display text-lg font-bold uppercase text-navy">Vitals</h3></div>
            <dl className="grid grid-cols-2 gap-y-2 p-3 text-sm">
              <dt className="text-gray-500">Class</dt><dd className="font-semibold">{p.year}</dd>
              <dt className="text-gray-500">Position</dt><dd className="font-semibold">{p.position}</dd>
              <dt className="text-gray-500">Height</dt><dd className="font-semibold">{heightStr(p.heightIn)}</dd>
              <dt className="text-gray-500">Weight</dt><dd className="font-semibold">{p.weightLb} lbs</dd>
              <dt className="text-gray-500">High School</dt><dd className="font-semibold">{p.highSchool}</dd>
              <dt className="text-gray-500">Hometown</dt><dd className="font-semibold">{p.hometown}, {p.state}</dd>
              <dt className="text-gray-500">Rating</dt><dd className="font-semibold">{p.rating.toFixed(2)}</dd>
              <dt className="text-gray-500">Status</dt><dd><CommitChip p={p} /></dd>
            </dl>
          </Card>
          <Card>
            <div className="border-b border-line bg-gray-50 px-3 py-2"><h3 className="font-display text-lg font-bold uppercase text-navy">Top {p.year} {p.position}s</h3></div>
            <ul className="divide-y divide-line px-3">{similar.map((s) => <ProspectMiniRow key={s.slug} p={s} rank={s.positionRank} />)}</ul>
          </Card>
        </aside>
      </div>
    </div>
  );
}
