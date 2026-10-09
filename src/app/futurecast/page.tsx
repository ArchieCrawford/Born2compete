import type { Metadata } from "next";
import Link from "next/link";
import { latestPredictions, TEAM_BY_SLUG, prospectName, fmtDate, getProspects } from "@/lib/data";
import { Avatar } from "@/components/Avatar";
import { Stars } from "@/components/Stars";
import { TeamLogo } from "@/components/TeamLogo";
import { PageTitle, SubscribeBox, Card } from "@/components/ui";

export const metadata: Metadata = { title: "FutureCast" };

export default function FutureCastPage() {
  const picks = latestPredictions(60);
  const byAnalyst = picks.reduce<Record<string, number>>((a, p) => ((a[p.analyst] = (a[p.analyst] ?? 0) + 1), a), {});
  const leaders = Object.entries(byAnalyst).sort((a, b) => b[1] - a[1]);
  const open = getProspects({ sport: "football", year: 2026, status: "uncommitted" }).slice(0, 10);
  return (
    <div className="mx-auto max-w-7xl px-4 py-5">
      <PageTitle kicker="Predictions" title="FutureCast" sub="Where our analysts and team-site insiders think top prospects are headed, with a confidence score on every pick." />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded border border-line bg-white">
            <table className="w-full text-sm">
              <thead className="bg-navy text-left font-display text-sm uppercase tracking-wider text-white"><tr><th className="px-3 py-2">Prospect</th><th>Pick</th><th>Analyst</th><th className="w-20 text-center">Conf.</th><th className="w-24 pr-3 text-right">Date</th></tr></thead>
              <tbody className="divide-y divide-line">
                {picks.map((p, i) => {
                  const t = TEAM_BY_SLUG[p.teamSlug];
                  return (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-3 py-2"><Link href={`/prospects/${p.prospect.slug}`} className="flex items-center gap-2"><Avatar name={prospectName(p.prospect)} size={32} /><span><span className="block font-semibold hover:text-brand">{prospectName(p.prospect)}</span><span className="flex items-center gap-1 text-[11px] text-gray-500"><Stars n={p.prospect.stars} size={9} /> {p.prospect.position} · {p.prospect.year} · #{p.prospect.nationalRank}</span></span></Link></td>
                      <td><Link href={`/teams/${t.slug}`} className="flex items-center gap-1.5 font-semibold hover:text-brand"><TeamLogo team={t} size={22} />{t.name}</Link></td>
                      <td className="text-gray-700">{p.analyst}</td>
                      <td className="text-center"><span className="inline-block rounded bg-gray-100 px-2 py-0.5 font-display text-base font-bold text-navy">{p.confidence}</span></td>
                      <td className="pr-3 text-right text-gray-500">{fmtDate(p.date, { month: "numeric", day: "numeric" })}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <aside className="space-y-5">
          <SubscribeBox />
          <Card>
            <div className="border-b border-line bg-gray-50 px-3 py-2 font-display text-lg font-bold uppercase text-navy">Most Active Analysts</div>
            <ul className="divide-y divide-line">{leaders.map(([a, n]) => <li key={a} className="flex justify-between px-3 py-2 text-sm"><span className="font-semibold">{a}</span><span className="text-gray-500">{n} picks</span></li>)}</ul>
          </Card>
          <Card>
            <div className="border-b border-line bg-gray-50 px-3 py-2 font-display text-lg font-bold uppercase text-navy">Top Uncommitted</div>
            <ul className="divide-y divide-line">{open.map((p) => <li key={p.slug} className="flex items-center gap-2 px-3 py-2 text-sm"><span className="w-6 text-center font-display font-bold text-gray-400">{p.nationalRank}</span><Link href={`/prospects/${p.slug}`} className="flex-1 truncate font-semibold hover:text-brand">{prospectName(p)}</Link><span className="text-xs text-gray-500">{p.position}</span></li>)}</ul>
          </Card>
        </aside>
      </div>
    </div>
  );
}
