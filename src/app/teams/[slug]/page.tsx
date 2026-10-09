import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TEAMS, TEAM_BY_SLUG, getTeamRank, getProspects, getArticles, getPortal, getThreads, YEARS, prospectName, heightStr, fmtDate, timeAgo, latestPredictions } from "@/lib/data";
import { TeamLogo } from "@/components/TeamLogo";
import { Stars } from "@/components/Stars";
import { Avatar } from "@/components/Avatar";
import { ArticleRow, ArticleCard } from "@/components/articles";
import { Card, SectionTitle, SubscribeBox, Badge } from "@/components/ui";

export function generateStaticParams() {
  return TEAMS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const t = TEAM_BY_SLUG[(await params).slug];
  return { title: t ? `${t.siteName} - ${t.name} ${t.nickname} Recruiting` : "Team" };
}

export default async function TeamPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ year?: string; sport?: string }> }) {
  const { slug } = await params;
  const sp = await searchParams;
  const t = TEAM_BY_SLUG[slug];
  if (!t) notFound();
  const sport = sp.sport === "basketball" ? "basketball" : "football";
  const year = YEARS[sport].includes(Number(sp.year)) ? Number(sp.year) : YEARS[sport][0];
  const rank = getTeamRank(t.slug, sport, year)!;
  const news = getArticles({ team: t.slug });
  const portal = getPortal({ team: t.slug, limit: 8 });
  const threads = getThreads(`${t.slug}-board`, 6);
  const targets = getProspects({ sport, year, status: "uncommitted" }).filter((p) => p.offers.some((o) => o.teamSlug === t.slug)).slice(0, 8);
  const picks = latestPredictions(200).filter((pr) => pr.teamSlug === t.slug).slice(0, 5);

  return (
    <div>
      <div className="text-white" style={{ background: `linear-gradient(135deg, ${t.primary} 0%, #0b1a33 85%)` }}>
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 sm:flex-row sm:items-center">
          <TeamLogo team={t} size={84} className="ring-4 ring-white/20" />
          <div className="flex-1">
            <div className="text-xs font-bold uppercase tracking-widest text-white/70">{t.conference} · {t.name} {t.nickname}</div>
            <h1 className="font-display text-5xl font-bold uppercase leading-none tracking-wide">{t.siteName}</h1>
            <div className="mt-1 text-sm text-white/80">Insider coverage of {t.name} football and basketball recruiting.</div>
          </div>
          <div className="flex gap-2 text-center">
            <div className="rounded bg-white/10 px-4 py-2"><div className="text-[10px] font-bold uppercase tracking-wider text-white/70">{year} Class</div><div className="font-display text-3xl font-bold">#{rank.rank}</div></div>
            <div className="rounded bg-white/10 px-4 py-2"><div className="text-[10px] font-bold uppercase tracking-wider text-white/70">Commits</div><div className="font-display text-3xl font-bold">{rank.commits.length}</div></div>
            <div className="rounded bg-white/10 px-4 py-2"><div className="text-[10px] font-bold uppercase tracking-wider text-white/70">Points</div><div className="font-display text-3xl font-bold">{rank.points}</div></div>
          </div>
        </div>
        <div className="border-t border-white/10 bg-black/20">
          <nav className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 text-sm font-bold uppercase tracking-wider">
            {[["#news", "News"], ["#commits", "Commits"], ["#targets", "Targets"], ["#portal", "Portal"], [`/forums/${t.slug}-board`, "Message Board"], ["/subscribe", "Subscribe"]].map(([h, l]) => (
              <Link key={h} href={h} className="whitespace-nowrap px-3 py-2.5 hover:bg-white/10">{l}</Link>
            ))}
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-5">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <section id="news">
              <SectionTitle href="/news">{t.siteName} News</SectionTitle>
              {news.length ? (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">{news.slice(0, 2).map((a) => <ArticleCard key={a.slug} article={a} />)}</div>
                  <div className="mt-3 divide-y divide-line rounded border border-line bg-white px-3">{news.slice(2).map((a) => <ArticleRow key={a.slug} article={a} compact />)}</div>
                </>
              ) : (
                <Card className="p-5 text-sm text-gray-600">No team-specific stories yet. National coverage mentioning {t.name} appears on the <Link href="/news" className="text-brand underline">news feed</Link>.</Card>
              )}
            </section>

            <section id="commits">
              <SectionTitle href={`/rankings/team/${sport}/${year}`} action="Team rankings">{year} {sport} Commits ({rank.commits.length})</SectionTitle>
              <div className="mb-3 flex flex-wrap gap-2 text-xs">
                {(["football", "basketball"] as const).map((s) => YEARS[s].map((y) => (
                  <Link key={s + y} href={`/teams/${t.slug}?sport=${s}&year=${y}#commits`} className={`rounded border px-2.5 py-1 font-bold uppercase tracking-wider ${s === sport && y === year ? "border-navy bg-navy text-white" : "border-line bg-white hover:border-brand"}`}>{y} {s === "football" ? "FB" : "BB"}</Link>
                )))}
              </div>
              <div className="mb-3 grid grid-cols-4 gap-2 text-center text-sm">
                {[["5★", rank.fiveStars], ["4★", rank.fourStars], ["3★", rank.threeStars], ["Avg", rank.avgRating ? rank.avgRating.toFixed(2) : "—"]].map(([l, v]) => (
                  <div key={String(l)} className="rounded border border-line bg-white py-2"><div className="text-[10px] font-bold uppercase tracking-wider text-gray-500">{l}</div><div className="font-display text-2xl font-bold text-navy">{v}</div></div>
                ))}
              </div>
              <div className="overflow-x-auto rounded border border-line bg-white">
                <table className="table-rank w-full min-w-[600px] text-sm">
                  <thead className="bg-gray-50 text-left text-[11px] uppercase tracking-wider text-gray-500"><tr><th>Player</th><th>Pos</th><th>Ht/Wt</th><th>Hometown</th><th>Rating</th><th>Nat.</th><th>Committed</th></tr></thead>
                  <tbody className="divide-y divide-line">
                    {rank.commits.map((p) => (
                      <tr key={p.slug}>
                        <td><Link href={`/prospects/${p.slug}`} className="flex items-center gap-2 font-semibold hover:text-brand"><Avatar name={prospectName(p)} size={30} />{prospectName(p)}</Link></td>
                        <td className="font-semibold">{p.position}</td>
                        <td className="whitespace-nowrap">{heightStr(p.heightIn)} / {p.weightLb}</td>
                        <td>{p.hometown}, {p.state}</td>
                        <td><span className="flex items-center gap-1.5"><Stars n={p.stars} size={10} /><span className="font-bold">{p.rating.toFixed(2)}</span></span></td>
                        <td>#{p.nationalRank}</td>
                        <td className="text-gray-500">{fmtDate(p.commitDate!, { month: "numeric", day: "numeric", year: "2-digit" })}</td>
                      </tr>
                    ))}
                    {rank.commits.length === 0 && <tr><td colSpan={7} className="py-6 text-center text-gray-500">No commitments yet for this class.</td></tr>}
                  </tbody>
                </table>
              </div>
            </section>

            <section id="targets">
              <SectionTitle href={`/rankings/player/${sport}/${year}?status=uncommitted`} action="All uncommitted">Top Uncommitted Targets</SectionTitle>
              <div className="grid gap-2 sm:grid-cols-2">
                {targets.map((p) => (
                  <Link key={p.slug} href={`/prospects/${p.slug}`} className="flex items-center gap-3 rounded border border-line bg-white p-2.5 hover:border-brand">
                    <Avatar name={prospectName(p)} size={40} />
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-semibold">{prospectName(p)}</div>
                      <div className="flex items-center gap-1.5 text-[11px] text-gray-500"><Stars n={p.stars} size={9} /> {p.position} · #{p.nationalRank} nat. · {p.offers.length} offers</div>
                    </div>
                    {p.predictions.some((pr) => pr.teamSlug === t.slug) && <Badge tone="gold">FC pick</Badge>}
                  </Link>
                ))}
              </div>
            </section>

            <section id="portal">
              <SectionTitle href={`/transfer-portal`} action="Portal feed">Transfer Portal Activity</SectionTitle>
              <div className="overflow-hidden rounded border border-line bg-white">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-left text-[11px] uppercase tracking-wider text-gray-500"><tr><th className="px-3 py-2">Player</th><th>Pos</th><th>Direction</th><th>Status</th><th className="pr-3 text-right">Date</th></tr></thead>
                  <tbody className="divide-y divide-line">
                    {portal.map((e) => {
                      const incoming = e.toTeam === t.slug;
                      const other = TEAM_BY_SLUG[incoming ? e.fromTeam : e.toTeam ?? e.fromTeam];
                      return (
                        <tr key={e.id}>
                          <td className="px-3 py-2"><Link href={`/transfer-portal/${e.slug}`} className="font-semibold hover:text-brand">{e.name}</Link><div className="flex items-center gap-1 text-[11px] text-gray-500"><Stars n={e.stars} size={9} />{e.eligibility}</div></td>
                          <td className="font-semibold">{e.position}</td>
                          <td>{incoming ? <span className="flex items-center gap-1 text-emerald-700">↓ In from <TeamLogo team={other} size={16} />{other.abbr}</span> : <span className="flex items-center gap-1 text-brand">↑ Out {e.toTeam ? <>to <TeamLogo team={other} size={16} />{other.abbr}</> : "(undecided)"}</span>}</td>
                          <td><Badge tone={e.status === "Committed" ? "green" : e.status === "Withdrawn" ? "gray" : "navy"}>{e.status}</Badge></td>
                          <td className="pr-3 text-right text-gray-500">{fmtDate(e.enteredAt, { month: "numeric", day: "numeric" })}</td>
                        </tr>
                      );
                    })}
                    {portal.length === 0 && <tr><td colSpan={5} className="py-6 text-center text-gray-500">No portal movement logged.</td></tr>}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          <aside className="space-y-5">
            <SubscribeBox siteName={t.siteName} />
            <Card>
              <div className="flex items-center justify-between border-b border-line bg-gray-50 px-3 py-2"><h3 className="font-display text-lg font-bold uppercase text-navy">{t.siteName} Board</h3><Link href={`/forums/${t.slug}-board`} className="text-[11px] font-bold uppercase tracking-wider text-brand hover:underline">Enter →</Link></div>
              <ul className="divide-y divide-line">
                {threads.map((th) => (
                  <li key={th.slug} className="px-3 py-2">
                    <Link href={`/forums/${th.boardSlug}/${th.slug}`} className="block text-sm font-semibold leading-snug hover:text-brand">{th.pinned && <span className="mr-1 text-brand">📌</span>}{th.title}</Link>
                    <div className="text-[11px] text-gray-500">{th.replies} replies · {timeAgo(th.lastPostAt)}</div>
                  </li>
                ))}
              </ul>
            </Card>
            <Card>
              <div className="border-b border-line bg-gray-50 px-3 py-2"><h3 className="font-display text-lg font-bold uppercase text-navy">FutureCast: {t.abbr}</h3></div>
              {picks.length ? (
                <ul className="divide-y divide-line">
                  {picks.map((pr, i) => (
                    <li key={i} className="flex items-center gap-2.5 px-3 py-2 text-sm">
                      <Avatar name={prospectName(pr.prospect)} size={28} />
                      <div className="min-w-0 flex-1"><Link href={`/prospects/${pr.prospect.slug}`} className="block truncate font-semibold hover:text-brand">{prospectName(pr.prospect)}</Link><div className="text-[11px] text-gray-500">{pr.analyst} · {pr.confidence}/10</div></div>
                    </li>
                  ))}
                </ul>
              ) : <div className="p-3 text-sm text-gray-500">No active predictions.</div>}
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}
