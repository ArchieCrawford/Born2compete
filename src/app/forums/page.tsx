import type { Metadata } from "next";
import Link from "next/link";
import { getBoards, getThreads, TEAM_BY_SLUG, fmtNum, timeAgo } from "@/lib/data";
import { TeamLogo } from "@/components/TeamLogo";
import { PageTitle, SubscribeBox, Card } from "@/components/ui";

export const metadata: Metadata = { title: "Forums" };

export default function ForumsPage() {
  const boards = getBoards();
  const national = boards.filter((b) => !b.teamSlug);
  const team = boards.filter((b) => b.teamSlug);
  const hot = getThreads(undefined, 10);
  return (
    <div className="mx-auto max-w-7xl px-4 py-5">
      <PageTitle kicker="Community" title="Message Boards" sub="The largest college sports fan community. Pick a board and join the conversation." />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <BoardTable title="National Boards" rows={national} />
          <BoardTable title="Team Boards" rows={team} />
        </div>
        <aside className="space-y-5">
          <SubscribeBox />
          <Card>
            <div className="border-b border-line bg-gray-50 px-3 py-2 font-display text-lg font-bold uppercase text-navy">Hot Threads</div>
            <ul className="divide-y divide-line">
              {hot.map((t) => (
                <li key={t.slug} className="px-3 py-2">
                  <Link href={`/forums/${t.boardSlug}/${t.slug}`} className="block text-sm font-semibold leading-snug hover:text-brand">{t.title}</Link>
                  <div className="text-[11px] text-gray-500">{t.replies} replies · {timeAgo(t.lastPostAt)}</div>
                </li>
              ))}
            </ul>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function BoardTable({ title, rows }: { title: string; rows: ReturnType<typeof getBoards> }) {
  return (
    <div className="overflow-hidden rounded border border-line bg-white">
      <div className="bg-navy px-4 py-2 font-display text-lg font-bold uppercase tracking-wide text-white">{title}</div>
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-left text-[11px] uppercase tracking-wider text-gray-500"><tr><th className="px-4 py-2">Board</th><th className="w-24 text-right">Threads</th><th className="w-24 pr-4 text-right">Posts</th><th className="hidden w-56 sm:table-cell">Latest</th></tr></thead>
        <tbody className="divide-y divide-line">
          {rows.map((b) => {
            const latest = getThreads(b.slug, 1)[0];
            return (
              <tr key={b.slug} className="hover:bg-gray-50">
                <td className="px-4 py-2.5">
                  <Link href={`/forums/${b.slug}`} className="flex items-center gap-2.5">
                    {b.teamSlug ? <TeamLogo team={TEAM_BY_SLUG[b.teamSlug]} size={30} /> : <span className="grid h-[30px] w-[30px] place-items-center rounded-full bg-brand font-display text-sm font-bold text-white">B2</span>}
                    <span><span className="block font-semibold text-navy hover:text-brand">{b.name}</span><span className="block text-xs text-gray-500">{b.description}</span></span>
                  </Link>
                </td>
                <td className="text-right">{fmtNum(b.threads)}</td>
                <td className="pr-4 text-right">{fmtNum(b.posts)}</td>
                <td className="hidden pr-4 sm:table-cell">{latest && <Link href={`/forums/${b.slug}/${latest.slug}`} className="block truncate text-xs hover:text-brand">{latest.title}<span className="block text-gray-400">{timeAgo(latest.lastPostAt)}</span></Link>}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
