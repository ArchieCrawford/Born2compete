import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBoard, getBoards, getThreads, TEAM_BY_SLUG, fmtNum, timeAgo } from "@/lib/data";
import { TeamLogo } from "@/components/TeamLogo";
import { Avatar } from "@/components/Avatar";
import { Breadcrumbs, PageTitle, SubscribeBox } from "@/components/ui";

export function generateStaticParams() {
  return getBoards().map((b) => ({ board: b.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ board: string }> }): Promise<Metadata> {
  return { title: getBoard((await params).board)?.name ?? "Board" };
}

export default async function BoardPage({ params }: { params: Promise<{ board: string }> }) {
  const { board } = await params;
  const b = getBoard(board);
  if (!b) notFound();
  const team = b.teamSlug ? TEAM_BY_SLUG[b.teamSlug] : null;
  const threads = getThreads(b.slug);
  return (
    <div className="mx-auto max-w-7xl px-4 py-5">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/forums", label: "Forums" }, { label: b.name }]} />
      <div className="flex items-start gap-4">
        {team && <TeamLogo team={team} size={64} />}
        <PageTitle kicker={team ? `${team.siteName} community` : "National board"} title={b.name} sub={<>{b.description} · {fmtNum(b.threads)} threads · {fmtNum(b.posts)} posts</>} />
      </div>
      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm text-gray-600">Showing {threads.length} recent threads</div>
            <Link href="/subscribe" className="rounded bg-brand px-3 py-1.5 font-display text-base font-bold uppercase text-white hover:bg-brand-2">+ New Thread</Link>
          </div>
          <div className="overflow-hidden rounded border border-line bg-white">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-[11px] uppercase tracking-wider text-gray-500"><tr><th className="px-4 py-2">Thread</th><th className="w-20 text-right">Replies</th><th className="w-20 text-right">Views</th><th className="hidden w-40 pr-4 text-right sm:table-cell">Last post</th></tr></thead>
              <tbody className="divide-y divide-line">
                {threads.map((t) => (
                  <tr key={t.slug} className={`hover:bg-gray-50 ${t.pinned ? "bg-amber-50/50" : ""}`}>
                    <td className="px-4 py-2.5">
                      <Link href={`/forums/${b.slug}/${t.slug}`} className="flex items-center gap-2.5">
                        <Avatar name={t.author} size={30} />
                        <span><span className="block font-semibold text-navy hover:text-brand">{t.pinned && <span className="mr-1 rounded bg-brand px-1 text-[10px] font-bold uppercase text-white">Pinned</span>}{t.title}</span><span className="block text-xs text-gray-500">by {t.author} · {timeAgo(t.createdAt)}</span></span>
                      </Link>
                    </td>
                    <td className="text-right">{fmtNum(t.replies)}</td>
                    <td className="text-right">{fmtNum(t.views)}</td>
                    <td className="hidden pr-4 text-right text-xs text-gray-500 sm:table-cell">{timeAgo(t.lastPostAt)}<span className="block">{t.posts[t.posts.length - 1].author}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <aside><SubscribeBox siteName={team?.siteName} /></aside>
      </div>
    </div>
  );
}
