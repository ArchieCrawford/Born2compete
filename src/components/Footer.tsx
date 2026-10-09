import Link from "next/link";
import { TEAMS } from "@/lib/teams";

export function Footer() {
  const cols = [
    { title: "Recruiting", links: [["Football Rankings", "/rankings/player/football/2026"], ["Basketball Rankings", "/rankings/player/basketball/2026"], ["Team Rankings", "/rankings/team/football/2026"], ["FutureCast", "/futurecast"], ["Camp Series", "/camps"]] },
    { title: "Transfer Portal", links: [["Portal Feed", "/transfer-portal"], ["Portal Team Rankings", "/transfer-portal?view=teams"], ["Basketball Portal", "/transfer-portal?sport=basketball"]] },
    { title: "Community", links: [["All Forums", "/forums"], ["National Recruiting Board", "/forums/rivals-national"], ["Portal Central", "/forums/transfer-portal"], ["Team Sites", "/teams"]] },
    { title: "Company", links: [["Subscribe", "/subscribe"], ["About", "/about"], ["Contact", "/about#contact"], ["Advertise", "/about#advertise"]] },
  ];
  return (
    <footer className="mt-12 bg-navy text-white/80">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        {cols.map((c) => (
          <div key={c.title}>
            <div className="mb-2 font-display text-lg font-bold uppercase tracking-wide text-white">{c.title}</div>
            <ul className="space-y-1 text-sm">
              {c.links.map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="hover:text-white hover:underline">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="mb-2 text-xs font-bold uppercase tracking-widest text-white/60">Team Sites</div>
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs">
            {TEAMS.map((t) => (
              <Link key={t.slug} href={`/teams/${t.slug}`} className="hover:text-white hover:underline">{t.siteName}</Link>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">
        © 2026 Born2Compete. All prospect, team and portal data on this site is simulated demo content.
      </div>
    </footer>
  );
}
