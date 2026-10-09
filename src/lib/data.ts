import { ARTICLES, CAMPS, FORUM_BOARDS, FORUM_THREADS, PORTAL, PROSPECTS, STATE_LIST, FOOTBALL_POSITIONS, BASKETBALL_POSITIONS } from "./seed";
import { TEAMS, TEAM_BY_SLUG } from "./teams";
import type { Article, ForumBoard, ForumThread, PortalEntry, Prospect, Sport, Team } from "./types";

export { TEAMS, TEAM_BY_SLUG, STATE_LIST, FOOTBALL_POSITIONS, BASKETBALL_POSITIONS, CAMPS };

export const SPORTS: { slug: Sport; name: string; short: string }[] = [
  { slug: "football", name: "Football", short: "FB" },
  { slug: "basketball", name: "Basketball", short: "BB" },
];

export const YEARS: Record<Sport, number[]> = {
  football: [2026, 2027, 2028],
  basketball: [2026, 2027],
};

export function isSport(s: string): s is Sport {
  return s === "football" || s === "basketball";
}

export function positionsFor(sport: Sport): readonly string[] {
  return sport === "football" ? FOOTBALL_POSITIONS : BASKETBALL_POSITIONS;
}

export function rankingLabel(sport: Sport) {
  return sport === "football" ? "Rivals250" : "Rivals150";
}

/* ---------- prospects ---------- */
export interface ProspectFilter {
  sport: Sport;
  year: number;
  position?: string;
  state?: string;
  stars?: number;
  status?: "committed" | "uncommitted";
  team?: string;
}

export function getProspects(f: ProspectFilter): Prospect[] {
  return PROSPECTS.filter(
    (p) =>
      p.sport === f.sport &&
      p.year === f.year &&
      (!f.position || p.position === f.position) &&
      (!f.state || p.state === f.state) &&
      (!f.stars || p.stars === f.stars) &&
      (!f.status || (f.status === "committed" ? !!p.committedTo : !p.committedTo)) &&
      (!f.team || p.committedTo === f.team),
  );
}

export function getProspect(slug: string): Prospect | undefined {
  return PROSPECTS.find((p) => p.slug === slug);
}

export function allProspects(): Prospect[] {
  return PROSPECTS;
}

export function prospectName(p: Prospect) {
  return `${p.firstName} ${p.lastName}`;
}

export function heightStr(inches: number) {
  return `${Math.floor(inches / 12)}-${inches % 12}`;
}

/* ---------- team rankings ---------- */
export interface TeamRanking {
  rank: number;
  team: Team;
  commits: Prospect[];
  fiveStars: number;
  fourStars: number;
  threeStars: number;
  avgRating: number;
  points: number;
  topCommit: Prospect | null;
}

function commitPoints(p: Prospect) {
  // Rivals-style: heavily reward elite commits; count all commits with a diminishing floor
  const base = Math.max(0, p.rating - 70);
  const starBonus = p.stars === 5 ? 120 : p.stars === 4 ? 45 : p.stars === 3 ? 8 : 0;
  return base * 3 + starBonus;
}

export function getTeamRankings(sport: Sport, year: number): TeamRanking[] {
  const rows = TEAMS.map((team) => {
    const commits = PROSPECTS.filter((p) => p.sport === sport && p.year === year && p.committedTo === team.slug).sort((a, b) => a.nationalRank - b.nationalRank);
    const sorted = commits.slice().sort((a, b) => b.rating - a.rating);
    const top = sorted.slice(0, sport === "football" ? 20 : 6);
    const points = Math.round(top.reduce((a, p) => a + commitPoints(p), 0) + Math.max(0, commits.length - top.length) * 5);
    const avg = commits.length ? commits.reduce((a, p) => a + p.rating, 0) / commits.length : 0;
    return {
      rank: 0,
      team,
      commits,
      fiveStars: commits.filter((p) => p.stars === 5).length,
      fourStars: commits.filter((p) => p.stars === 4).length,
      threeStars: commits.filter((p) => p.stars === 3).length,
      avgRating: Math.round(avg * 100) / 100,
      points,
      topCommit: commits[0] ?? null,
    };
  });
  rows.sort((a, b) => b.points - a.points || b.avgRating - a.avgRating);
  rows.forEach((r, i) => (r.rank = i + 1));
  return rows;
}

export function getTeamRank(teamSlug: string, sport: Sport, year: number): TeamRanking | undefined {
  return getTeamRankings(sport, year).find((r) => r.team.slug === teamSlug);
}

/* ---------- articles ---------- */
export function getArticles(opts: { sport?: Sport | "general"; category?: string; team?: string; limit?: number; prospect?: string } = {}): Article[] {
  let list = ARTICLES;
  if (opts.sport) list = list.filter((a) => a.sport === opts.sport);
  if (opts.category) list = list.filter((a) => a.category === opts.category);
  if (opts.team) list = list.filter((a) => a.teamSlug === opts.team);
  if (opts.prospect) list = list.filter((a) => a.prospectSlug === opts.prospect);
  return opts.limit ? list.slice(0, opts.limit) : list;
}

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

export const ARTICLE_CATEGORIES = Array.from(new Set(ARTICLES.map((a) => a.category)));

/* ---------- forums ---------- */
export function getBoards(): ForumBoard[] {
  return FORUM_BOARDS;
}
export function getBoard(slug: string): ForumBoard | undefined {
  return FORUM_BOARDS.find((b) => b.slug === slug);
}
export function getThreads(boardSlug?: string, limit?: number): ForumThread[] {
  let list = FORUM_THREADS;
  if (boardSlug) list = list.filter((t) => t.boardSlug === boardSlug);
  list = list.slice().sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.lastPostAt.localeCompare(a.lastPostAt));
  return limit ? list.slice(0, limit) : list;
}
export function getThread(boardSlug: string, slug: string): ForumThread | undefined {
  return FORUM_THREADS.find((t) => t.boardSlug === boardSlug && t.slug === slug);
}
export function allThreads(): ForumThread[] {
  return FORUM_THREADS;
}

/* ---------- portal ---------- */
export function getPortal(opts: { sport?: Sport; position?: string; status?: string; team?: string; limit?: number } = {}): PortalEntry[] {
  let list = PORTAL;
  if (opts.sport) list = list.filter((e) => e.sport === opts.sport);
  if (opts.position) list = list.filter((e) => e.position === opts.position);
  if (opts.status) list = list.filter((e) => e.status === opts.status);
  if (opts.team) list = list.filter((e) => e.fromTeam === opts.team || e.toTeam === opts.team);
  return opts.limit ? list.slice(0, opts.limit) : list;
}

export function getPortalTeamRankings(sport: Sport) {
  const rows = TEAMS.map((team) => {
    const incoming = PORTAL.filter((e) => e.sport === sport && e.toTeam === team.slug);
    const outgoing = PORTAL.filter((e) => e.sport === sport && e.fromTeam === team.slug);
    const points = incoming.reduce((a, e) => a + Math.max(0, e.rating - 75) * 3, 0) - outgoing.reduce((a, e) => a + Math.max(0, e.rating - 75), 0);
    return { team, incoming, outgoing, points: Math.round(points), nil: incoming.reduce((a, e) => a + e.nilValue, 0) };
  }).filter((r) => r.incoming.length || r.outgoing.length);
  rows.sort((a, b) => b.points - a.points);
  return rows;
}

/* ---------- search ---------- */
export function search(q: string) {
  const s = q.trim().toLowerCase();
  if (!s) return { prospects: [], teams: [], articles: [], portal: [], threads: [] };
  const prospects = PROSPECTS.filter((p) => `${p.firstName} ${p.lastName} ${p.highSchool} ${p.hometown}`.toLowerCase().includes(s)).slice(0, 25);
  const teams = TEAMS.filter((t) => `${t.name} ${t.nickname} ${t.siteName} ${t.abbr}`.toLowerCase().includes(s)).slice(0, 10);
  const articles = ARTICLES.filter((a) => `${a.title} ${a.dek}`.toLowerCase().includes(s)).slice(0, 15);
  const portal = PORTAL.filter((e) => e.name.toLowerCase().includes(s)).slice(0, 10);
  const threads = FORUM_THREADS.filter((t) => t.title.toLowerCase().includes(s)).slice(0, 10);
  return { prospects, teams, articles, portal, threads };
}

/* ---------- home widgets ---------- */
export function trendingProspects(limit = 8): Prospect[] {
  // mix of uncommitted top guys and recent commits
  const fb = PROSPECTS.filter((p) => p.sport === "football" && p.year === 2026);
  const recent = fb.filter((p) => p.commitDate).sort((a, b) => b.commitDate!.localeCompare(a.commitDate!)).slice(0, 4);
  const hot = fb.filter((p) => !p.committedTo && p.stars === 5).slice(0, 4);
  return [...hot, ...recent].slice(0, limit);
}

export function recentCommits(limit = 10, sport: Sport = "football"): Prospect[] {
  return PROSPECTS.filter((p) => p.sport === sport && p.commitDate)
    .sort((a, b) => b.commitDate!.localeCompare(a.commitDate!) || a.nationalRank - b.nationalRank)
    .slice(0, limit);
}

export function latestPredictions(limit = 10) {
  return PROSPECTS.flatMap((p) => p.predictions.map((pr) => ({ prospect: p, ...pr })))
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit);
}

/* ---------- formatting ---------- */
export function fmtDate(iso: string, opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" }) {
  return new Date(iso.length === 10 ? iso + "T12:00:00Z" : iso).toLocaleDateString("en-US", { ...opts, timeZone: "UTC" });
}

export function timeAgo(iso: string, now = new Date("2026-10-09T15:00:00Z")) {
  const diff = (now.getTime() - new Date(iso).getTime()) / 1000;
  if (diff < 3600) return `${Math.max(1, Math.floor(diff / 60))}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 86400 * 14) return `${Math.floor(diff / 86400)}d ago`;
  return fmtDate(iso);
}

export function fmtMoney(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${n}`;
}

export function fmtNum(n: number) {
  return n.toLocaleString("en-US");
}
