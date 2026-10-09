import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPortal, TEAM_BY_SLUG, fmtDate, fmtMoney, heightStr } from "@/lib/data";
import { PORTAL } from "@/lib/seed";
import { Avatar } from "@/components/Avatar";
import { Stars } from "@/components/Stars";
import { TeamLogo } from "@/components/TeamLogo";
import { Breadcrumbs, Badge, Card, SubscribeBox } from "@/components/ui";

export function generateStaticParams() {
  return PORTAL.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const e = PORTAL.find((x) => x.slug === slug);
  return { title: e ? `${e.name} - Transfer Portal` : "Transfer" };
}

export default async function PortalEntryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const e = PORTAL.find((x) => x.slug === slug);
  if (!e) notFound();
  const from = TEAM_BY_SLUG[e.fromTeam];
  const to = e.toTeam ? TEAM_BY_SLUG[e.toTeam] : null;
  const similar = getPortal({ sport: e.sport, position: e.position }).filter((x) => x.id !== e.id).slice(0, 6);
  return (
    <div className="mx-auto max-w-7xl px-4 py-5">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/transfer-portal", label: "Transfer Portal" }, { label: e.name }]} />
      <div className="rounded border border-line bg-white p-5">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <Avatar name={e.name} size={96} />
          <div className="flex-1">
            <div className="flex items-center gap-2"><Stars n={e.stars} size={16} /><span className="font-display text-2xl font-bold text-navy">{e.rating.toFixed(2)}</span><Badge tone={e.status === "Committed" ? "green" : e.status === "Withdrawn" ? "gray" : "navy"}>{e.status}</Badge></div>
            <h1 className="font-display text-5xl font-bold uppercase leading-none text-navy">{e.name}</h1>
            <div className="mt-1 text-sm text-gray-700"><b>{e.position}</b> · {heightStr(e.heightIn)} / {e.weightLb} · {e.eligibility} · {e.hometown}</div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded bg-gray-50 p-3 text-center"><div className="text-[10px] font-bold uppercase tracking-wider text-gray-500">NIL Valuation</div><div className="font-display text-2xl font-bold text-navy">{fmtMoney(e.nilValue)}</div></div>
            <div className="rounded bg-gray-50 p-3 text-center"><div className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Entered</div><div className="font-display text-2xl font-bold text-navy">{fmtDate(e.enteredAt, { month: "short", day: "numeric" })}</div></div>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-line pt-4">
          <Link href={`/teams/${from.slug}`} className="flex items-center gap-2 rounded border border-line px-3 py-2 hover:border-brand"><TeamLogo team={from} size={32} /><span><span className="block text-[10px] font-bold uppercase tracking-wider text-gray-500">From</span><span className="font-display text-lg font-bold uppercase leading-none text-navy">{from.name}</span></span></Link>
          <span className="font-display text-2xl text-gray-300">→</span>
          {to ? (
            <Link href={`/teams/${to.slug}`} className="flex items-center gap-2 rounded border border-line px-3 py-2 hover:border-brand"><TeamLogo team={to} size={32} /><span><span className="block text-[10px] font-bold uppercase tracking-wider text-gray-500">Committed to</span><span className="font-display text-lg font-bold uppercase leading-none text-navy">{to.name}</span></span></Link>
          ) : <div className="rounded border border-dashed border-line px-3 py-2 text-sm text-gray-600">{e.status === "Withdrawn" ? "Withdrew from the portal" : "Destination undecided"}</div>}
        </div>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <div className="border-b border-line bg-gray-50 px-4 py-2"><h2 className="font-display text-xl font-bold uppercase text-navy">Other {e.position}s in the portal</h2></div>
            <ul className="divide-y divide-line">
              {similar.map((s) => (
                <li key={s.id} className="flex items-center gap-3 px-4 py-2 text-sm">
                  <Avatar name={s.name} size={30} />
                  <Link href={`/transfer-portal/${s.slug}`} className="flex-1 font-semibold hover:text-brand">{s.name}</Link>
                  <Stars n={s.stars} size={10} />
                  <TeamLogo team={TEAM_BY_SLUG[s.fromTeam]} size={20} />
                  <Badge tone={s.status === "Committed" ? "green" : s.status === "Withdrawn" ? "gray" : "navy"}>{s.status}</Badge>
                </li>
              ))}
            </ul>
          </Card>
        </div>
        <aside><SubscribeBox /></aside>
      </div>
    </div>
  );
}
