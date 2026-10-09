import Link from "next/link";
import { TEAMS } from "@/lib/teams";
import { TeamLogo } from "./TeamLogo";

export function TeamBar() {
  return (
    <div className="border-b border-line bg-white">
      <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-1.5">
        <Link href="/teams" className="shrink-0 rounded bg-navy px-2 py-1 font-display text-xs font-bold uppercase tracking-wider text-white">
          Team Sites
        </Link>
        <div className="no-scrollbar flex items-center gap-1 overflow-x-auto">
          {TEAMS.map((t) => (
            <Link key={t.slug} href={`/teams/${t.slug}`} title={t.siteName} className="flex shrink-0 items-center gap-1.5 rounded px-1.5 py-0.5 text-xs font-semibold text-gray-700 hover:bg-gray-100">
              <TeamLogo team={t} size={20} />
              <span className="hidden xl:inline">{t.abbr}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
