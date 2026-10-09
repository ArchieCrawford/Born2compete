import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBoard, getThread, allThreads, TEAM_BY_SLUG, fmtNum, fmtDate, getThreads } from "@/lib/data";
import { Avatar } from "@/components/Avatar";
import { Breadcrumbs, SubscribeBox, Card } from "@/components/ui";

export function generateStaticParams() {
  return allThreads().map((t) => ({ board: t.boardSlug, thread: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ board: string; thread: string }> }): Promise<Metadata> {
  const { board, thread } = await params;
  return { title: getThread(board, thread)?.title ?? "Thread" };
}

export default async function ThreadPage({ params }: { params: Promise<{ board: string; thread: string }> }) {
  const { board, thread } = await params;
  const b = getBoard(board);
  const t = getThread(board, thread);
  if (!b || !t) notFound();
  const team = b.teamSlug ? TEAM_BY_SLUG[b.teamSlug] : null;
  const more = getThreads(board, 8).filter((x) => x.slug !== t.slug).slice(0, 6);
  return (
    <div className="mx-auto max-w-7xl px-4 py-5">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/forums", label: "Forums" }, { href: `/forums/${b.slug}`, label: b.name }, { label: t.title }]} />
      <h1 className="font-display text-3xl font-bold uppercase leading-tight text-navy sm:text-4xl">{t.title}</h1>
      <div className="mb-4 text-sm text-gray-500">Started by <b>{t.author}</b> · {fmtDate(t.createdAt)} · {fmtNum(t.replies)} replies · {fmtNum(t.views)} views</div>
      <div className="grid gap-6 lg:grid-cols-4">
        <div className="space-y-3 lg:col-span-3">
          {t.posts.map((p, i) => (
            <article key={p.id} className="flex gap-3 rounded border border-line bg-white p-4">
              <div className="w-24 shrink-0 text-center">
                <Avatar name={p.author} size={48} className="mx-auto" />
                <div className="mt-1 truncate text-xs font-bold">{p.author}</div>
                <div className="text-[10px] uppercase tracking-wider text-gray-400">{i === 0 ? "OP" : "Member"}</div>
              </div>
              <div className="flex-1">
                <div className="mb-2 flex items-center justify-between text-xs text-gray-500"><span>#{p.id}</span><span>{fmtDate(p.date, { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })}</span></div>
                <p className="text-[15px] leading-7 text-gray-800">{p.body}</p>
              </div>
            </article>
          ))}
          <Card className="p-5 text-center">
            <div className="font-display text-xl font-bold uppercase text-navy">{fmtNum(t.replies - t.posts.length)} more replies</div>
            <p className="mt-1 text-sm text-gray-600">Subscribe to read the full thread and post on the {b.name}.</p>
            <Link href="/subscribe" className="mt-3 inline-block rounded bg-brand px-5 py-2 font-display text-lg font-bold uppercase text-white hover:bg-brand-2">Join the conversation</Link>
          </Card>
        </div>
        <aside className="space-y-5">
          <SubscribeBox siteName={team?.siteName} />
          <Card>
            <div className="border-b border-line bg-gray-50 px-3 py-2 font-display text-lg font-bold uppercase text-navy">More from this board</div>
            <ul className="divide-y divide-line">
              {more.map((m) => <li key={m.slug} className="px-3 py-2"><Link href={`/forums/${b.slug}/${m.slug}`} className="text-sm font-semibold leading-snug hover:text-brand">{m.title}</Link></li>)}
            </ul>
          </Card>
        </aside>
      </div>
    </div>
  );
}
