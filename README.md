# Born2Compete

A college recruiting network in the style of Rivals / On3: national player and team
rankings, prospect profiles, commitment tracking, FutureCast predictions, transfer
portal coverage, camp events, a team site for every program and fan message boards.

Built with Next.js (App Router), TypeScript and Tailwind CSS. All data is generated
deterministically at build time from `src/lib/seed.ts`, so the site runs with no
database or external services. Every prospect, article, forum post and portal entry
is simulated demo content.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (prerenders ~1,500 pages)
npm run start
```

## Routes

| Route | What it is |
| --- | --- |
| `/` | Home: hero story, headlines, trending prospects, news feed, portal, sidebar widgets |
| `/news`, `/news/[slug]` | News feed with category filter; article pages with a premium paywall |
| `/football`, `/basketball` | Sport hubs |
| `/rankings/player/[sport]/[year]` | Rivals250 / Rivals150 player rankings with position, state, stars, status and team filters |
| `/rankings/team/[sport]/[year]` | Team class rankings (commits, 5/4/3-star counts, average, points) |
| `/prospects/[slug]` | Prospect profile: ranks, offers, timeline, FutureCast, NIL valuation |
| `/teams`, `/teams/[slug]` | Team site directory and per-team sites (news, commits, targets, portal, board) |
| `/transfer-portal`, `/transfer-portal/[slug]` | Portal feed, portal team rankings and entry pages |
| `/forums`, `/forums/[board]`, `/forums/[board]/[thread]` | Message boards |
| `/futurecast` | Analyst prediction feed |
| `/camps` | Camp Series schedule |
| `/search?q=` | Search across prospects, teams, portal, news and threads |
| `/subscribe`, `/login`, `/about` | Membership, login and company pages |

## Project layout

- `src/lib/types.ts` – data models
- `src/lib/teams.ts` – program directory (colors, conference, site name)
- `src/lib/seed.ts` – deterministic data generator
- `src/lib/data.ts` – query helpers used by pages (swap this layer for a real database later)
- `src/components/` – header, nav, widgets, tables, cards
- `src/app/` – routes

## Deploying to Netlify

The repo includes a `netlify.toml` that uses the official Next.js runtime.

1. In Netlify, choose **Add new site → Import an existing project** and pick
   `ArchieCrawford/Born2compete` on the `master` branch.
2. Netlify reads `netlify.toml`, so leave the build command (`npm run build`) and
   publish directory (`.next`) as detected.
3. Deploy. Every push to `master` triggers a new build.
