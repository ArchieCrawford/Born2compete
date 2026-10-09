import type { Metadata } from "next";
import Link from "next/link";
import { TEAMS } from "@/lib/data";
import { PageTitle } from "@/components/ui";

export const metadata: Metadata = { title: "Subscribe" };

const PLANS = [
  { name: "Monthly", price: "$9.95", per: "/month", features: ["One team site + national coverage", "Premium articles and insider intel", "Message board access", "Full rankings database"], cta: "Start monthly" },
  { name: "Annual", price: "$99.95", per: "/year", best: true, features: ["Everything in Monthly", "Two months free", "FutureCast analyst picks", "Camp Series video and evaluations"], cta: "Start annual" },
  { name: "Network", price: "$149.95", per: "/year", features: ["Every team site on the network", "All national and team boards", "Transfer portal alerts", "Priority support"], cta: "Go all access" },
];

export default function SubscribePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-5">
      <PageTitle kicker="Membership" title="Join Born2Compete" sub="Pick a plan, choose your team site, and get the most trusted recruiting coverage in college sports." />
      <div className="grid gap-4 md:grid-cols-3">
        {PLANS.map((p) => (
          <div key={p.name} className={`relative rounded border bg-white p-6 ${p.best ? "border-brand shadow-lg" : "border-line"}`}>
            {p.best && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded bg-brand px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">Most popular</span>}
            <div className="font-display text-2xl font-bold uppercase text-navy">{p.name}</div>
            <div className="mt-1"><span className="font-display text-5xl font-bold text-navy">{p.price}</span><span className="text-sm text-gray-500">{p.per}</span></div>
            <ul className="mt-4 space-y-1.5 text-sm text-gray-700">{p.features.map((f) => <li key={f} className="flex gap-2"><span className="text-emerald-600">✔</span>{f}</li>)}</ul>
            <form className="mt-5" action="/subscribe" method="get">
              <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-gray-500" htmlFor={`team-${p.name}`}>Your team site</label>
              <select id={`team-${p.name}`} name="team" className="mb-3 w-full rounded border border-line px-2 py-2 text-sm">
                {TEAMS.map((t) => <option key={t.slug} value={t.slug}>{t.siteName} ({t.name})</option>)}
              </select>
              <button type="submit" className={`w-full rounded px-4 py-2.5 font-display text-lg font-bold uppercase tracking-wide ${p.best ? "bg-brand text-white hover:bg-brand-2" : "bg-navy text-white hover:bg-navy-2"}`}>{p.cta}</button>
            </form>
          </div>
        ))}
      </div>
      <p className="mt-6 text-center text-xs text-gray-500">This is a demo. No payment is collected. Already a member? <Link href="/login" className="underline">Log in</Link>.</p>
    </div>
  );
}
