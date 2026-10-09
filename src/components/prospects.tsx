import Link from "next/link";
import type { Prospect } from "@/lib/types";
import { TEAM_BY_SLUG, heightStr, prospectName, fmtDate } from "@/lib/data";
import { Stars } from "./Stars";
import { TeamLogo } from "./TeamLogo";
import { Avatar } from "./Avatar";
import { Badge } from "./ui";

export function CommitChip({ p, showDate = false }: { p: Prospect; showDate?: boolean }) {
  if (!p.committedTo) return <span className="text-xs font-semibold uppercase text-gray-400">Uncommitted</span>;
  const t = TEAM_BY_SLUG[p.committedTo];
  return (
    <Link href={`/teams/${t.slug}`} className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-800 hover:text-brand">
      <TeamLogo team={t} size={20} />
      <span>{t.name}</span>
      {showDate && p.commitDate && <span className="text-gray-400">· {fmtDate(p.commitDate, { month: "numeric", day: "numeric", year: "2-digit" })}</span>}
    </Link>
  );
}

export function ProspectTable({ prospects, showRank = "national", startIndex = 0 }: { prospects: Prospect[]; showRank?: "national" | "position" | "state" | "index"; startIndex?: number }) {
  return (
    <div className="overflow-x-auto rounded border border-line bg-white">
      <table className="table-rank w-full min-w-[720px] text-sm">
        <thead className="bg-navy text-left font-display text-sm uppercase tracking-wider text-white">
          <tr>
            <th className="w-12 text-center">Rk</th>
            <th>Player</th>
            <th className="w-16">Pos</th>
            <th className="w-20">Ht / Wt</th>
            <th>Hometown / School</th>
            <th className="w-32">Rating</th>
            <th className="w-20 text-center">Pos Rk</th>
            <th className="w-20 text-center">St Rk</th>
            <th className="w-40">Status</th>
          </tr>
        </thead>
        <tbody>
          {prospects.map((p, i) => (
            <tr key={p.slug} className="border-t border-line">
              <td className="text-center font-display text-lg font-bold text-navy">
                {showRank === "index" ? startIndex + i + 1 : showRank === "position" ? p.positionRank : showRank === "state" ? p.stateRank : p.nationalRank}
              </td>
              <td>
                <Link href={`/prospects/${p.slug}`} className="flex items-center gap-2.5">
                  <Avatar name={prospectName(p)} size={34} />
                  <span className="font-semibold text-gray-900 hover:text-brand">{prospectName(p)}</span>
                </Link>
              </td>
              <td className="font-semibold">{p.position}</td>
              <td className="whitespace-nowrap text-gray-700">{heightStr(p.heightIn)} / {p.weightLb}</td>
              <td className="text-gray-700">
                <div>{p.hometown}, {p.state}</div>
                <div className="text-xs text-gray-500">{p.highSchool}</div>
              </td>
              <td>
                <div className="flex items-center gap-2">
                  <Stars n={p.stars} size={12} />
                  <span className="font-display text-base font-bold text-navy">{p.rating.toFixed(2)}</span>
                </div>
              </td>
              <td className="text-center text-gray-700">{p.positionRank}</td>
              <td className="text-center text-gray-700">{p.stateRank}</td>
              <td><CommitChip p={p} /></td>
            </tr>
          ))}
          {prospects.length === 0 && (
            <tr>
              <td colSpan={9} className="py-8 text-center text-gray-500">No prospects match those filters.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export function ProspectCard({ p, rankLabel }: { p: Prospect; rankLabel?: string }) {
  return (
    <Link href={`/prospects/${p.slug}`} className="group flex items-center gap-3 rounded border border-line bg-white p-3 hover:border-brand">
      <div className="relative">
        <Avatar name={prospectName(p)} size={52} />
        <span className="absolute -bottom-1 -right-1 rounded bg-navy px-1 font-display text-xs font-bold text-white">#{p.nationalRank}</span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <Stars n={p.stars} size={11} />
          <span className="text-xs font-bold text-gray-600">{p.rating.toFixed(2)}</span>
          {rankLabel && <Badge>{rankLabel}</Badge>}
        </div>
        <div className="truncate font-display text-lg font-bold leading-tight text-navy group-hover:text-brand">{prospectName(p)}</div>
        <div className="truncate text-xs text-gray-600">
          {p.position} · {heightStr(p.heightIn)} / {p.weightLb} · {p.hometown}, {p.state}
        </div>
        <div className="mt-1"><CommitChip p={p} /></div>
      </div>
    </Link>
  );
}

export function ProspectMiniRow({ p, rank }: { p: Prospect; rank?: number }) {
  return (
    <li className="flex items-center gap-2.5 py-2">
      <span className="w-6 text-center font-display text-base font-bold text-gray-400">{rank ?? p.nationalRank}</span>
      <Avatar name={prospectName(p)} size={30} />
      <div className="min-w-0 flex-1">
        <Link href={`/prospects/${p.slug}`} className="block truncate text-sm font-semibold text-gray-900 hover:text-brand">{prospectName(p)}</Link>
        <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
          <Stars n={p.stars} size={9} />
          <span>{p.position} · {p.state}</span>
        </div>
      </div>
      {p.committedTo ? <TeamLogo team={TEAM_BY_SLUG[p.committedTo]} size={22} /> : <span className="text-[10px] font-bold uppercase text-gray-300">Open</span>}
    </li>
  );
}
