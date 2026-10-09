import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticle, getArticles, getProspect, TEAM_BY_SLUG, fmtDate } from "@/lib/data";
import { ARTICLES } from "@/lib/seed";
import { ArticleRow } from "@/components/articles";
import { ProspectCard } from "@/components/prospects";
import { Breadcrumbs, PremiumTag, SubscribeBox } from "@/components/ui";
import { TopProspectsWidget, HotThreadsWidget } from "@/components/widgets";
import { TeamLogo } from "@/components/TeamLogo";

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const a = getArticle((await params).slug);
  return { title: a?.title ?? "Article", description: a?.dek };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) notFound();
  const team = a.teamSlug ? TEAM_BY_SLUG[a.teamSlug] : null;
  const prospect = a.prospectSlug ? getProspect(a.prospectSlug) : undefined;
  const related = getArticles({ category: a.category }).filter((x) => x.slug !== a.slug).slice(0, 5);
  const paywalled = a.premium;
  const body = paywalled ? a.body.slice(0, 2) : a.body;

  return (
    <div className="mx-auto max-w-7xl px-4 py-5">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/news", label: "News" }, { href: `/news?category=${encodeURIComponent(a.category)}`, label: a.category }, { label: a.title }]} />
      <div className="grid gap-6 lg:grid-cols-3">
        <article className="lg:col-span-2">
          <div className="rounded border border-line bg-white p-5 sm:p-7">
            <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wider text-gray-500">
              <span className="font-bold text-brand">{a.category}</span>
              {team && <><span>·</span><Link href={`/teams/${team.slug}`} className="flex items-center gap-1 hover:text-brand"><TeamLogo team={team} size={16} />{team.siteName}</Link></>}
              {a.premium && <PremiumTag />}
            </div>
            <h1 className="font-display text-4xl font-bold uppercase leading-none tracking-wide text-navy sm:text-5xl">{a.title}</h1>
            <p className="mt-3 text-lg text-gray-700">{a.dek}</p>
            <div className="mt-4 flex items-center gap-3 border-y border-line py-3 text-sm text-gray-600">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-navy font-display font-bold text-white">{a.author.split(" ").map((s) => s[0]).join("")}</span>
              <div>
                <div className="font-semibold text-gray-900">{a.author}</div>
                <div className="text-xs">{fmtDate(a.publishedAt, { month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })}</div>
              </div>
            </div>
            <div className="prose-sm mt-5 max-w-none space-y-4 text-[15px] leading-7 text-gray-800">
              {body.map((p, i) => <p key={i}>{p}</p>)}
            </div>
            {paywalled && (
              <div className="relative mt-2">
                <div className="h-24 bg-gradient-to-b from-white to-gray-100" />
                <div className="rounded border border-gold/50 bg-amber-50 p-5 text-center">
                  <div className="font-display text-2xl font-bold uppercase text-navy">This story is for subscribers</div>
                  <p className="mt-1 text-sm text-gray-700">Unlock the full article, every premium story, FutureCast picks and the message boards.</p>
                  <Link href="/subscribe" className="mt-3 inline-block rounded bg-brand px-5 py-2 font-display text-lg font-bold uppercase text-white hover:bg-brand-2">Subscribe</Link>
                  <div className="mt-2 text-xs text-gray-500">Already a member? <Link href="/login" className="underline">Log in</Link></div>
                </div>
              </div>
            )}
          </div>
          {prospect && (
            <section className="mt-6">
              <h2 className="mb-2 font-display text-xl font-bold uppercase text-navy">Featured Prospect</h2>
              <ProspectCard p={prospect} />
            </section>
          )}
          <section className="mt-6">
            <h2 className="mb-1 font-display text-xl font-bold uppercase text-navy">More in {a.category}</h2>
            <div className="divide-y divide-line rounded border border-line bg-white px-3">
              {related.map((r) => <ArticleRow key={r.slug} article={r} compact />)}
            </div>
          </section>
        </article>
        <aside className="space-y-5">
          <SubscribeBox siteName={team?.siteName} />
          <TopProspectsWidget sport={a.sport === "basketball" ? "basketball" : "football"} />
          <HotThreadsWidget boardSlug={team ? `${team.slug}-board` : undefined} />
        </aside>
      </div>
    </div>
  );
}
