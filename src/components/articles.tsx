import Link from "next/link";
import type { Article } from "@/lib/types";
import { TEAM_BY_SLUG, timeAgo } from "@/lib/data";
import { Badge, PremiumTag } from "./ui";
import { TeamLogo } from "./TeamLogo";

function Art({ article, className = "", big = false }: { article: Article; className?: string; big?: boolean }) {
  const t = article.teamSlug ? TEAM_BY_SLUG[article.teamSlug] : null;
  const seed = article.id * 47;
  const bg = t ? `linear-gradient(135deg, ${t.primary} 0%, #0b1a33 100%)` : `linear-gradient(135deg, hsl(${seed % 360} 50% 28%) 0%, #0b1a33 100%)`;
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ background: bg }} aria-hidden>
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "repeating-linear-gradient(45deg, #fff 0 2px, transparent 2px 18px)" }} />
      {t && <TeamLogo team={t} size={big ? 96 : 44} className="absolute bottom-3 right-3 opacity-90" />}
      <span className={`absolute left-3 top-3 rounded bg-brand px-1.5 py-0.5 font-display font-bold uppercase tracking-wider text-white ${big ? "text-sm" : "text-[10px]"}`}>{article.tag}</span>
    </div>
  );
}

export function HeroArticle({ article }: { article: Article }) {
  return (
    <Link href={`/news/${article.slug}`} className="group relative block overflow-hidden rounded border border-line bg-navy text-white">
      <Art article={article} big className="aspect-[16/9] w-full sm:aspect-[21/10]" />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-5 pt-16">
        <div className="mb-1 flex items-center gap-2 text-xs uppercase tracking-wider text-white/70">
          <span className="font-bold text-gold">{article.category}</span>
          <span>·</span>
          <span>{timeAgo(article.publishedAt)}</span>
          {article.premium && <PremiumTag />}
        </div>
        <h2 className="font-display text-3xl font-bold uppercase leading-none group-hover:underline sm:text-4xl">{article.title}</h2>
        <p className="mt-2 hidden max-w-2xl text-sm text-white/80 sm:block">{article.dek}</p>
        <div className="mt-2 text-xs text-white/60">By {article.author}</div>
      </div>
    </Link>
  );
}

export function ArticleCard({ article }: { article: Article }) {
  return (
    <Link href={`/news/${article.slug}`} className="group block overflow-hidden rounded border border-line bg-white hover:border-brand">
      <Art article={article} className="aspect-[16/9] w-full" />
      <div className="p-3">
        <div className="mb-1 flex items-center gap-2 text-[11px] uppercase tracking-wider text-gray-500">
          <span className="font-bold text-brand">{article.category}</span>
          <span>·</span>
          <span>{timeAgo(article.publishedAt)}</span>
          {article.premium && <PremiumTag />}
        </div>
        <h3 className="font-display text-xl font-bold uppercase leading-tight text-navy group-hover:text-brand">{article.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-gray-600">{article.dek}</p>
      </div>
    </Link>
  );
}

export function ArticleRow({ article, compact = false }: { article: Article; compact?: boolean }) {
  return (
    <Link href={`/news/${article.slug}`} className="group flex gap-3 py-3">
      <Art article={article} className={`shrink-0 rounded ${compact ? "h-16 w-24" : "h-24 w-36"}`} />
      <div className="min-w-0">
        <div className="mb-0.5 flex items-center gap-2 text-[11px] uppercase tracking-wider text-gray-500">
          <span className="font-bold text-brand">{article.category}</span>
          <span>·</span>
          <span>{timeAgo(article.publishedAt)}</span>
          {article.premium && <PremiumTag />}
        </div>
        <h3 className={`font-display font-bold uppercase leading-tight text-navy group-hover:text-brand ${compact ? "text-lg" : "text-xl"}`}>{article.title}</h3>
        {!compact && <p className="mt-1 line-clamp-2 text-sm text-gray-600">{article.dek}</p>}
        <div className="mt-1 text-xs text-gray-500">By {article.author}</div>
      </div>
    </Link>
  );
}

export function HeadlineList({ articles }: { articles: Article[] }) {
  return (
    <ul className="divide-y divide-line">
      {articles.map((a) => (
        <li key={a.slug} className="py-2">
          <Link href={`/news/${a.slug}`} className="group block">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-gray-500">
              <Badge tone="gray">{a.category}</Badge>
              <span>{timeAgo(a.publishedAt)}</span>
            </div>
            <div className="mt-0.5 font-semibold leading-snug text-gray-900 group-hover:text-brand">{a.title}</div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
