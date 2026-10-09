import type {
  Article,
  CampEvent,
  ForumBoard,
  ForumThread,
  PortalEntry,
  Prospect,
  Sport,
  TimelineEvent,
} from "./types";
import { TEAMS } from "./teams";

/* ---------- deterministic RNG ---------- */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

class Rng {
  private r: () => number;
  constructor(seed: number) {
    this.r = mulberry32(seed);
  }
  next() {
    return this.r();
  }
  int(min: number, max: number) {
    return Math.floor(this.r() * (max - min + 1)) + min;
  }
  pick<T>(arr: readonly T[]): T {
    return arr[Math.floor(this.r() * arr.length)];
  }
  chance(p: number) {
    return this.r() < p;
  }
  shuffle<T>(arr: T[]): T[] {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(this.r() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
}

/* ---------- pools ---------- */
const FIRST = [
  "Jaylen", "Marcus", "Caleb", "Elijah", "Isaiah", "Jordan", "Malik", "Tyler", "Brandon", "Devin",
  "Cameron", "Xavier", "Jamal", "Trevor", "Darius", "Kyle", "Mason", "Logan", "Ethan", "Noah",
  "Dominic", "Andre", "Jayden", "Carter", "Tristan", "Micah", "Zion", "Kendrick", "Amari", "Jalen",
  "Deshawn", "Terrell", "Kobe", "Josiah", "Bryce", "Chase", "Dylan", "Hunter", "Jaxon", "Keon",
  "Landon", "Nolan", "Omari", "Quincy", "Ryder", "Shamar", "Tavion", "Uriah", "Vince", "Wyatt",
  "Aiden", "Blake", "Cole", "Dax", "Emmanuel", "Fabian", "Gavin", "Hayden", "Ivan", "Jace",
  "Kaden", "Luca", "Miles", "Nico", "Owen", "Preston", "Reese", "Silas", "Titus", "Zeke",
];
const LAST = [
  "Williams", "Johnson", "Brown", "Jones", "Davis", "Miller", "Wilson", "Moore", "Taylor", "Anderson",
  "Thomas", "Jackson", "White", "Harris", "Martin", "Thompson", "Robinson", "Clark", "Lewis", "Walker",
  "Hall", "Allen", "Young", "King", "Wright", "Scott", "Green", "Baker", "Adams", "Nelson",
  "Carter", "Mitchell", "Roberts", "Turner", "Phillips", "Campbell", "Parker", "Evans", "Edwards", "Collins",
  "Stewart", "Sanchez", "Morris", "Reed", "Cook", "Bell", "Bailey", "Cooper", "Richardson", "Cox",
  "Howard", "Ward", "Torres", "Peterson", "Gray", "Ramirez", "James", "Watson", "Brooks", "Kelly",
  "Sanders", "Price", "Bennett", "Wood", "Barnes", "Ross", "Henderson", "Coleman", "Jenkins", "Perry",
  "Powell", "Long", "Patterson", "Hughes", "Flores", "Washington", "Butler", "Simmons", "Foster", "Bryant",
];

const STATES: Record<string, { name: string; cities: string[]; weight: number }> = {
  TX: { name: "Texas", cities: ["Houston", "Dallas", "Austin", "San Antonio", "Katy", "Frisco", "Cypress", "Duncanville", "Humble", "Allen"], weight: 14 },
  FL: { name: "Florida", cities: ["Miami", "Tampa", "Orlando", "Jacksonville", "Fort Lauderdale", "Lakeland", "Bradenton", "Hollywood", "Ocala", "Pompano Beach"], weight: 13 },
  GA: { name: "Georgia", cities: ["Atlanta", "Buford", "Marietta", "Savannah", "Macon", "Lawrenceville", "Valdosta", "Cartersville", "Milton", "Carrollton"], weight: 11 },
  CA: { name: "California", cities: ["Los Angeles", "Bellflower", "Santa Ana", "San Diego", "Oakland", "Fresno", "Corona", "Folsom", "Mission Viejo", "Concord"], weight: 10 },
  AL: { name: "Alabama", cities: ["Birmingham", "Mobile", "Huntsville", "Montgomery", "Hoover", "Tuscaloosa", "Pinson", "Saraland"], weight: 6 },
  LA: { name: "Louisiana", cities: ["New Orleans", "Baton Rouge", "Shreveport", "Lafayette", "Metairie", "Monroe"], weight: 5 },
  OH: { name: "Ohio", cities: ["Columbus", "Cleveland", "Cincinnati", "Akron", "Dayton", "Massillon", "Toledo"], weight: 5 },
  NC: { name: "North Carolina", cities: ["Charlotte", "Raleigh", "Greensboro", "Durham", "Fayetteville", "Matthews"], weight: 4 },
  TN: { name: "Tennessee", cities: ["Nashville", "Memphis", "Knoxville", "Chattanooga", "Murfreesboro"], weight: 4 },
  SC: { name: "South Carolina", cities: ["Columbia", "Greenville", "Charleston", "Rock Hill", "Spartanburg"], weight: 3 },
  MS: { name: "Mississippi", cities: ["Jackson", "Gulfport", "Hattiesburg", "Starkville", "Oxford"], weight: 3 },
  PA: { name: "Pennsylvania", cities: ["Philadelphia", "Pittsburgh", "Harrisburg", "Erie", "Allentown"], weight: 4 },
  MI: { name: "Michigan", cities: ["Detroit", "Grand Rapids", "Ann Arbor", "Flint", "Belleville"], weight: 3 },
  VA: { name: "Virginia", cities: ["Richmond", "Norfolk", "Virginia Beach", "Chesapeake", "Alexandria"], weight: 3 },
  MD: { name: "Maryland", cities: ["Baltimore", "Olney", "Owings Mills", "Hyattsville"], weight: 2 },
  NJ: { name: "New Jersey", cities: ["Newark", "Paterson", "Montvale", "Oradell"], weight: 2 },
  AZ: { name: "Arizona", cities: ["Phoenix", "Chandler", "Scottsdale", "Mesa"], weight: 2 },
  OK: { name: "Oklahoma", cities: ["Oklahoma City", "Tulsa", "Norman", "Bixby"], weight: 2 },
  WA: { name: "Washington", cities: ["Seattle", "Tacoma", "Bellevue", "Spokane"], weight: 2 },
  IL: { name: "Illinois", cities: ["Chicago", "Naperville", "Peoria", "Rockford"], weight: 2 },
  IN: { name: "Indiana", cities: ["Indianapolis", "Fort Wayne", "Carmel"], weight: 1 },
  MO: { name: "Missouri", cities: ["St. Louis", "Kansas City", "Columbia"], weight: 2 },
  AR: { name: "Arkansas", cities: ["Little Rock", "Fayetteville", "Bentonville"], weight: 1 },
  KY: { name: "Kentucky", cities: ["Louisville", "Lexington", "Bowling Green"], weight: 1 },
  NV: { name: "Nevada", cities: ["Las Vegas", "Henderson", "Reno"], weight: 2 },
  UT: { name: "Utah", cities: ["Salt Lake City", "Provo", "Lehi"], weight: 1 },
  CO: { name: "Colorado", cities: ["Denver", "Aurora", "Colorado Springs"], weight: 1 },
  HI: { name: "Hawaii", cities: ["Honolulu", "Kahuku"], weight: 1 },
  OR: { name: "Oregon", cities: ["Portland", "Eugene", "Beaverton"], weight: 1 },
  NY: { name: "New York", cities: ["New York", "Buffalo", "Rochester"], weight: 1 },
  WI: { name: "Wisconsin", cities: ["Milwaukee", "Madison"], weight: 1 },
  MN: { name: "Minnesota", cities: ["Minneapolis", "St. Paul"], weight: 1 },
  KS: { name: "Kansas", cities: ["Wichita", "Olathe"], weight: 1 },
  NE: { name: "Nebraska", cities: ["Omaha", "Lincoln"], weight: 1 },
  IA: { name: "Iowa", cities: ["Des Moines", "Cedar Rapids"], weight: 1 },
  DC: { name: "Washington D.C.", cities: ["Washington"], weight: 1 },
};
export const STATE_LIST = Object.entries(STATES).map(([code, v]) => ({ code, name: v.name })).sort((a, b) => a.name.localeCompare(b.name));

const HS_PREFIX = ["North", "South", "East", "West", "Central", "Lake", "Mount", "St.", "Bishop", "Grand"];
const HS_SUFFIX = ["High", "Prep", "Academy", "Catholic", "Christian", "County High", "Senior High", "Community High"];
const HS_NAMES = ["Westlake", "Duncanville", "Mater Dei", "IMG", "St. Frances", "Buford", "Hoover", "Grayson", "Cedar Hill", "Colquitt County", "Centennial", "Chaminade", "DeSoto", "North Shore", "Carrollton", "Lipscomb", "Thompson", "Venice", "Milton", "Sierra Canyon"];

export const FOOTBALL_POSITIONS = ["QB", "RB", "WR", "TE", "OT", "IOL", "EDGE", "DL", "LB", "CB", "S", "ATH", "K", "P"] as const;
export const BASKETBALL_POSITIONS = ["PG", "SG", "SF", "PF", "C"] as const;
const FB_POS_WEIGHT: Record<string, number> = { QB: 6, RB: 8, WR: 14, TE: 5, OT: 8, IOL: 7, EDGE: 9, DL: 9, LB: 8, CB: 11, S: 8, ATH: 5, K: 1, P: 1 };

const ANALYSTS = ["Adam Gorney", "Greg Smith", "Marshall Levenson", "Charles Power", "Sam Spiegelman", "Josh Helmholdt", "Rob Cassidy", "Jamie Shaw", "Cole Patterson", "Jason Jordan"];
const FORUM_USERS = ["TideFan88", "DawgNation4Life", "BuckeyeBorn", "HookEmHorns", "GeauxTigers", "QuackAttack", "Hail2Victors", "GigEm", "IrishEyes", "WeAre", "VolNation", "WarEagleWes", "GatorBait", "CanesRule", "NoleNation", "TigerRag", "FightOn", "BoomerSooner", "HottyToddy", "CockyFan", "RecruitingJunkie", "PortalWatcher", "FiveStarFan", "CrystalBaller", "CoachK77", "BlueChipBob", "FilmRoomFred", "GridironGuru"];

const fmt = (d: Date) => d.toISOString().slice(0, 10);
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

function weightedState(r: Rng) {
  const entries = Object.entries(STATES);
  const total = entries.reduce((a, [, v]) => a + v.weight, 0);
  let x = r.next() * total;
  for (const [code, v] of entries) {
    x -= v.weight;
    if (x <= 0) return { code, ...v };
  }
  return { code: "TX", ...STATES.TX };
}

function weightedPos(r: Rng, sport: Sport) {
  if (sport === "basketball") return r.pick(BASKETBALL_POSITIONS);
  const total = Object.values(FB_POS_WEIGHT).reduce((a, b) => a + b, 0);
  let x = r.next() * total;
  for (const [p, w] of Object.entries(FB_POS_WEIGHT)) {
    x -= w;
    if (x <= 0) return p;
  }
  return "WR";
}

function weightedTeam(r: Rng, state: string) {
  const pool = TEAMS.map((t) => ({ t, w: Math.pow(t.pull, 6) * (t.state === state ? 2.5 : 1) }));
  const total = pool.reduce((a, b) => a + b.w, 0);
  let x = r.next() * total;
  for (const { t, w } of pool) {
    x -= w;
    if (x <= 0) return t;
  }
  return TEAMS[0];
}

function sizeFor(r: Rng, sport: Sport, pos: string): [number, number] {
  if (sport === "basketball") {
    const base: Record<string, [number, number]> = { PG: [73, 180], SG: [76, 190], SF: [79, 205], PF: [81, 225], C: [83, 240] };
    const [h, w] = base[pos];
    return [h + r.int(-2, 2), w + r.int(-12, 15)];
  }
  const base: Record<string, [number, number]> = {
    QB: [74, 205], RB: [70, 200], WR: [73, 185], TE: [77, 235], OT: [78, 300], IOL: [76, 305],
    EDGE: [76, 245], DL: [76, 285], LB: [74, 225], CB: [72, 180], S: [73, 190], ATH: [73, 195], K: [72, 185], P: [74, 195],
  };
  const [h, w] = base[pos];
  return [h + r.int(-2, 2), w + r.int(-15, 20)];
}

/* ---------- prospects ---------- */
function genProspects(sport: Sport, year: number, count: number, seed: number, startId: number): Prospect[] {
  const r = new Rng(seed);
  const now = new Date("2026-10-09");
  const monthsToSigning = (year - 2026) * 12 + 2; // Dec signing day
  const commitPct = Math.max(0.08, 0.92 - monthsToSigning * 0.065);
  const usedNames = new Set<string>();
  const list: Prospect[] = [];

  for (let i = 0; i < count; i++) {
    let first = r.pick(FIRST);
    let last = r.pick(LAST);
    while (usedNames.has(first + last)) {
      first = r.pick(FIRST);
      last = r.pick(LAST);
    }
    usedNames.add(first + last);
    const st = weightedState(r);
    const city = r.pick(st.cities);
    const pos = weightedPos(r, sport);
    const [h, w] = sizeFor(r, sport, pos);
    const hs = r.chance(0.5)
      ? `${r.pick(HS_NAMES)} ${r.pick(["High", "Prep", "Academy"])}`
      : `${r.pick(HS_PREFIX)} ${city.split(" ")[0]} ${r.pick(HS_SUFFIX)}`;

    // rating curve: rank-based, descending
    const t = i / count;
    const rating = Math.round((99.6 - 20 * Math.pow(t, 0.55) + r.next() * 0.25) * 100) / 100;
    const stars: 2 | 3 | 4 | 5 = rating >= 98 ? 5 : rating >= 90 ? 4 : rating >= 82 ? 3 : 2;

    const committed = r.chance(commitPct * (stars >= 4 ? 1.05 : 0.9));
    const team = weightedTeam(r, st.code);
    const nOffers = Math.min(TEAMS.length, stars === 5 ? r.int(25, 40) : stars === 4 ? r.int(12, 28) : r.int(3, 14));
    const offerTeams = r.shuffle(TEAMS).slice(0, nOffers);
    if (committed && !offerTeams.includes(team)) offerTeams[0] = team;
    const offers = offerTeams.map((ot) => {
      const d = new Date(now);
      d.setDate(d.getDate() - r.int(60, 700));
      return { teamSlug: ot.slug, date: fmt(d) };
    }).sort((a, b) => a.date.localeCompare(b.date));

    const timeline: TimelineEvent[] = offers.slice(0, 6).map((o) => ({
      date: o.date,
      type: "offer" as const,
      text: `Received offer from ${TEAMS.find((x) => x.slug === o.teamSlug)!.name}`,
    }));
    for (let v = 0; v < r.int(1, 4); v++) {
      const vt = r.pick(offerTeams);
      const d = new Date(now);
      d.setDate(d.getDate() - r.int(10, 300));
      timeline.push({ date: fmt(d), type: "visit", text: `${r.chance(0.5) ? "Official" : "Unofficial"} visit to ${vt.name}` });
    }
    if (r.chance(0.35)) {
      const d = new Date(now);
      d.setDate(d.getDate() - r.int(30, 400));
      timeline.push({ date: fmt(d), type: "camp", text: `Earned an invite at the Rivals Camp Series ${r.pick(["Dallas", "Atlanta", "Miami", "Los Angeles", "Charlotte"])} stop` });
    }
    let commitDate: string | null = null;
    if (committed) {
      const d = new Date(now);
      d.setDate(d.getDate() - r.int(3, 400));
      commitDate = fmt(d);
      timeline.push({ date: commitDate, type: "commit", text: `Committed to ${team.name}` });
    }
    const rd = new Date(now);
    rd.setDate(rd.getDate() - r.int(1, 40));
    timeline.push({ date: fmt(rd), type: "ranking", text: `Rivals rankings update: now No. ${i + 1} nationally` });
    timeline.sort((a, b) => b.date.localeCompare(a.date));

    const predictions = committed
      ? []
      : r.shuffle(ANALYSTS).slice(0, r.int(0, 4)).map((an) => {
          const d = new Date(now);
          d.setDate(d.getDate() - r.int(1, 90));
          return { analyst: an, teamSlug: r.pick(offerTeams).slug, confidence: r.int(5, 10), date: fmt(d) };
        });

    const posLong = sport === "football" ? pos : pos;
    const bio = r.pick([
      `${first} ${last} is a ${stars}-star ${posLong} out of ${city}, ${st.name}, where ${r.pick(["his explosiveness", "his length and physicality", "his football IQ", "his motor", "his elite production"])} has made him one of the most coveted prospects in the ${year} class.`,
      `A ${year} ${posLong} from ${hs}, ${last} ${r.pick(["projects as an early-impact player", "has drawn comparisons to recent first-round picks", "is viewed by Rivals scouts as a program-changer", "is one of the fastest risers in the cycle"])} after a dominant junior campaign.`,
      `${last} checks in at ${Math.floor(h / 12)}-${h % 12}, ${w} pounds and ${r.pick(["plays with a nasty edge", "shows rare twitch for his size", "has the frame to add good weight", "tested among the best at his position on the camp circuit"])}. Programs across the country have made him a priority.`,
    ]);

    const nil = Math.round((stars === 5 ? 900000 + r.next() * 2500000 : stars === 4 ? 150000 + r.next() * 700000 : 20000 + r.next() * 120000) / 1000) * 1000;

    list.push({
      slug: slugify(`${first}-${last}-${startId + i}`),
      id: startId + i,
      firstName: first,
      lastName: last,
      sport,
      year,
      position: pos,
      heightIn: h,
      weightLb: w,
      hometown: city,
      state: st.code,
      highSchool: hs,
      rating,
      stars,
      nationalRank: i + 1,
      positionRank: 0,
      stateRank: 0,
      committedTo: committed ? team.slug : null,
      commitDate,
      offers,
      timeline,
      predictions,
      bio,
      nilValue: nil,
    });
  }

  // position & state ranks
  const posCount: Record<string, number> = {};
  const stCount: Record<string, number> = {};
  for (const p of list) {
    posCount[p.position] = (posCount[p.position] ?? 0) + 1;
    stCount[p.state] = (stCount[p.state] ?? 0) + 1;
    p.positionRank = posCount[p.position];
    p.stateRank = stCount[p.state];
  }
  return list;
}

export const PROSPECTS: Prospect[] = [
  ...genProspects("football", 2026, 300, 2026001, 1000),
  ...genProspects("football", 2027, 250, 2027001, 2000),
  ...genProspects("football", 2028, 100, 2028001, 3000),
  ...genProspects("basketball", 2026, 150, 2026002, 4000),
  ...genProspects("basketball", 2027, 100, 2027002, 5000),
];

/* ---------- articles ---------- */
const AUTHORS = ["Adam Gorney", "Greg Smith", "Marshall Levenson", "Charles Power", "Sam Spiegelman", "Josh Helmholdt", "Rob Cassidy", "Jamie Shaw", "Travis Rodgers", "Nick Harris"];

function genArticles(): Article[] {
  const r = new Rng(777);
  const now = new Date("2026-10-09T14:00:00Z");
  const fb26 = PROSPECTS.filter((p) => p.sport === "football" && p.year === 2026);
  const fb27 = PROSPECTS.filter((p) => p.sport === "football" && p.year === 2027);
  const bb26 = PROSPECTS.filter((p) => p.sport === "basketball" && p.year === 2026);
  const out: Article[] = [];
  let id = 1;

  const push = (a: Omit<Article, "id" | "slug" | "publishedAt" | "body"> & { hoursAgo: number }) => {
    const d = new Date(now.getTime() - a.hoursAgo * 3600 * 1000);
    const body = genBody(r, a.title, a.teamSlug, a.prospectSlug);
    out.push({ ...a, id, slug: slugify(`${a.title}-${id}`), publishedAt: d.toISOString(), body });
    id++;
  };

  const tname = (slug: string | null) => (slug ? TEAMS.find((t) => t.slug === slug)!.name : "");

  // rankings-week pieces
  push({ title: "Rivals250 Update: Biggest risers and fallers in the new 2026 rankings", dek: "Our national analysts break down the movement after a busy fall evaluation period, including three new five-stars.", category: "Rankings", sport: "football", author: "Adam Gorney", teamSlug: null, prospectSlug: fb26[2].slug, premium: false, tag: "Rivals250", hoursAgo: 2 });
  push({ title: "Rivals Rankings Week: Position-by-position thoughts on the 2027 Rivals250", dek: "From a loaded quarterback group to a thin tight end crop, here is what stood out at every position.", category: "Rankings", sport: "football", author: "Adam Gorney", teamSlug: null, prospectSlug: fb27[0].slug, premium: false, tag: "Rivals250", hoursAgo: 5 });
  push({ title: "Rivals150: New No. 1 emerges in the 2026 basketball rankings", dek: "A summer on the Nike EYBL circuit reshaped the top 10 and the top spot has a new owner.", category: "Rankings", sport: "basketball", author: "Rob Cassidy", teamSlug: null, prospectSlug: bb26[0].slug, premium: false, tag: "Rivals150", hoursAgo: 9 });

  // commitment stories
  const committed = r.shuffle(fb26.filter((p) => p.committedTo && p.stars >= 4)).slice(0, 10);
  committed.forEach((p, i) => {
    push({
      title: `${p.stars}-star ${p.position} ${p.firstName} ${p.lastName} commits to ${tname(p.committedTo)}`,
      dek: `The ${p.hometown}, ${p.state} standout chose the ${TEAMS.find((t) => t.slug === p.committedTo)!.nickname} over ${r.int(3, 9)} other finalists. Here's why, and what it means for the class.`,
      category: "Commitments",
      sport: "football",
      author: r.pick(AUTHORS),
      teamSlug: p.committedTo,
      prospectSlug: p.slug,
      premium: i % 3 === 1,
      tag: "Commitment",
      hoursAgo: 12 + i * 11,
    });
  });

  // visit / recruiting intel
  const unc = r.shuffle(fb26.filter((p) => !p.committedTo && p.stars >= 4)).slice(0, 8);
  unc.forEach((p, i) => {
    const offer = p.offers[r.int(0, p.offers.length - 1)];
    const t = TEAMS.find((x) => x.slug === offer.teamSlug)!;
    push({
      title: r.pick([
        `Where things stand for ${p.stars}-star ${p.position} ${p.firstName} ${p.lastName} after ${t.name} visit`,
        `${t.name} makes a big move for ${p.stars}-star ${p.position} ${p.firstName} ${p.lastName}`,
        `Rivals FutureCast: Analysts weigh in on ${p.firstName} ${p.lastName}'s recruitment`,
        `${p.firstName} ${p.lastName} sets commitment date, names top ${r.int(3, 6)}`,
      ]),
      dek: `${p.lastName} is one of the most coveted uncommitted prospects in the ${p.year} class. Rivals has the latest intel on where his recruitment is headed.`,
      category: "Recruiting",
      sport: "football",
      author: r.pick(AUTHORS),
      teamSlug: t.slug,
      prospectSlug: p.slug,
      premium: i % 2 === 0,
      tag: "Intel",
      hoursAgo: 20 + i * 13,
    });
  });

  // team class pieces
  r.shuffle(TEAMS.filter((t) => t.pull > 0.8)).slice(0, 8).forEach((t, i) => {
    push({
      title: r.pick([
        `${t.name} recruiting: Where the ${t.nickname} stand in the 2026 team rankings`,
        `Three targets ${t.name} must land to finish with a top-5 class`,
        `${t.siteName} Mailbag: ${t.name} recruiting questions answered`,
        `${t.name} hosts a monster official visit weekend: full recap`,
      ]),
      dek: `A closer look at ${t.name}'s class, the board, and who could be next to pledge.`,
      category: "Team Recruiting",
      sport: "football",
      author: r.pick(AUTHORS),
      teamSlug: t.slug,
      prospectSlug: null,
      premium: true,
      tag: t.siteName,
      hoursAgo: 30 + i * 17,
    });
  });

  // portal + camps + misc
  push({ title: "Transfer Portal Watch: 10 names to monitor before the winter window opens", dek: "Playing time, NIL and coaching changes are already shaping the next portal cycle.", category: "Transfer Portal", sport: "football", author: "Charles Power", teamSlug: null, prospectSlug: null, premium: false, tag: "Portal", hoursAgo: 15 });
  push({ title: "Rivals Camp Series: Full MVP list and top performers from the Dallas stop", dek: "More than 300 prospects competed in front of Rivals analysts. These are the names that stood out.", category: "Camps", sport: "football", author: "Greg Smith", teamSlug: null, prospectSlug: fb27[7].slug, premium: false, tag: "Camp Series", hoursAgo: 40 });
  push({ title: "Rivals Five-Star: Elite 2027 prospects set for invite-only showcase", dek: "The top 100 juniors in the country head to Atlanta for the premier event on the recruiting calendar.", category: "Camps", sport: "football", author: "Marshall Levenson", teamSlug: null, prospectSlug: fb27[1].slug, premium: false, tag: "Five-Star", hoursAgo: 55 });
  push({ title: "Basketball recruiting: 5 uncommitted seniors who could commit before the early signing period", dek: "With the November window around the corner, these decisions could reshape the top of the Rivals150.", category: "Recruiting", sport: "basketball", author: "Jamie Shaw", teamSlug: null, prospectSlug: bb26[3].slug, premium: false, tag: "Rivals150", hoursAgo: 27 });
  push({ title: "Rivals Roundtable: Which program is positioned to win the 2027 recruiting cycle?", dek: "Our analysts debate the early favorites and the sleeper programs stacking commitments.", category: "Rankings", sport: "football", author: "Rivals Staff", teamSlug: null, prospectSlug: null, premium: false, tag: "Roundtable", hoursAgo: 70 });
  push({ title: "High school football: Rivals Top 25 national rankings after Week 7", dek: "Two unbeaten powers collide this weekend in a top-five showdown.", category: "High School", sport: "football", author: "Nick Harris", teamSlug: null, prospectSlug: null, premium: false, tag: "HS Top 25", hoursAgo: 80 });

  return out.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

function genBody(r: Rng, title: string, teamSlug: string | null, prospectSlug: string | null): string[] {
  const team = teamSlug ? TEAMS.find((t) => t.slug === teamSlug)! : r.pick(TEAMS);
  const p = prospectSlug ? PROSPECTS.find((x) => x.slug === prospectSlug) : undefined;
  const who = p ? `${p.firstName} ${p.lastName}` : "the staff";
  const paras = [
    `${title.split(":")[0]}. ${p ? `${who}, the ${p.stars}-star ${p.position} out of ${p.highSchool} in ${p.hometown}, ${p.state}, ` : "The latest cycle "}has been one of the biggest storylines of the fall, and the Rivals team has been tracking every twist.`,
    `"${r.pick([
      "It came down to relationships and development,",
      "They showed me a real plan,",
      "The culture there is different,",
      "I knew it was home the second I stepped on campus,",
    ])}" ${p ? p.lastName : "one prospect"} told Rivals. "${r.pick([
      "I'm ready to get to work.",
      "The staff has been consistent with me from day one.",
      "I can see myself playing early there.",
      "They recruited me like a priority.",
    ])}"`,
    `${team.name} has ${r.pick(["surged", "been steady", "made a late push", "been the program to beat"])} in this recruitment, and the ${team.nickname} staff ${r.pick(["prioritized", "identified", "zeroed in on"])} ${p ? p.lastName : "this group"} ${r.pick(["early in the process", "after a strong junior season", "following a standout camp performance"])}. The ${team.conference} program currently sits ${r.int(1, 25) <= 10 ? "inside the top 10" : "just outside the top 15"} of the Rivals team rankings.`,
    `Rivals national recruiting director Adam Gorney: "${r.pick([
      "This is a prospect with a legitimate early-impact ceiling.",
      "The tape speaks for itself, and the testing numbers back it up.",
      "Programs don't recruit this hard unless they believe he changes a room.",
      "Expect the momentum here to carry through signing day.",
    ])}"`,
    `What's next: ${r.pick([
      "Rivals will have more from the family in the coming days.",
      "Keep an eye on the FutureCast as the picture becomes clearer.",
      "Several official visits remain on the calendar this fall.",
      "A decision is expected before the early signing period.",
    ])} Subscribers can follow every development on the ${team.siteName} message board.`,
  ];
  return paras;
}

export const ARTICLES: Article[] = genArticles();

/* ---------- forums ---------- */
function genForums(): { boards: ForumBoard[]; threads: ForumThread[] } {
  const r = new Rng(4242);
  const now = new Date("2026-10-09T14:00:00Z");
  const boards: ForumBoard[] = [
    { slug: "rivals-national", name: "Rivals National Recruiting", description: "Rankings debates, commitment reactions and national recruiting talk.", teamSlug: null, threads: 0, posts: 0 },
    { slug: "transfer-portal", name: "Transfer Portal Central", description: "Portal entries, landing spots, NIL and roster building.", teamSlug: null, threads: 0, posts: 0 },
    { slug: "basketball-recruiting", name: "Basketball Recruiting", description: "Rivals150 talk, grassroots circuit and commitments.", teamSlug: null, threads: 0, posts: 0 },
    { slug: "high-school", name: "High School Football", description: "Scores, state rankings and game-of-the-week discussion.", teamSlug: null, threads: 0, posts: 0 },
    ...TEAMS.map((t) => ({ slug: `${t.slug}-board`, name: `${t.siteName} Board`, description: `The ${t.name} ${t.nickname} fan community on Rivals.`, teamSlug: t.slug, threads: 0, posts: 0 })),
  ];
  const threads: ForumThread[] = [];
  let tid = 1;
  const addThread = (boardSlug: string, title: string, pinned = false, hoursAgo = r.int(1, 240)) => {
    const created = new Date(now.getTime() - (hoursAgo + r.int(1, 300)) * 3600 * 1000);
    const last = new Date(now.getTime() - hoursAgo * 3600 * 1000);
    const n = r.int(2, 9);
    const posts = Array.from({ length: n }, (_, i) => ({
      id: i + 1,
      author: r.pick(FORUM_USERS),
      date: new Date(created.getTime() + ((last.getTime() - created.getTime()) * i) / Math.max(1, n - 1)).toISOString(),
      body: r.pick([
        "Hearing good things from folks close to the program. This one feels like it's trending the right way.",
        "Nobody panics until signing day. Been here before.",
        "If we land him, the class jumps three or four spots in the team rankings easily.",
        "The staff has been on this kid since his sophomore year. Relationships matter.",
        "Portal is going to be wild this year. NIL changes everything.",
        "Watched his film last night. Explosive, plays through the whistle, projects at the next level.",
        "Any update on the official visit? Heard the weekend went great.",
        "Trust the process. The board tells you everything you need to know.",
        "Crystal ball says yes. Rivals FutureCast says yes. I say yes.",
        "He's a lock. Book it.",
      ]),
    }));
    const t: ForumThread = {
      slug: slugify(`${title}-${tid}`),
      id: tid++,
      boardSlug,
      title,
      author: posts[0].author,
      createdAt: created.toISOString(),
      lastPostAt: last.toISOString(),
      replies: r.int(n, 400),
      views: r.int(500, 40000),
      pinned,
      posts,
    };
    threads.push(t);
  };

  const fb26 = PROSPECTS.filter((p) => p.sport === "football" && p.year === 2026);
  addThread("rivals-national", "OFFICIAL: Rivals250 update reaction thread", true, 1);
  addThread("rivals-national", "Who finishes with the No. 1 class in 2026?", false, 3);
  addThread("rivals-national", `Is ${fb26[0].firstName} ${fb26[0].lastName} the best prospect since...?`, false, 6);
  addThread("rivals-national", "Early signing period predictions", false, 12);
  addThread("rivals-national", "Five-stars still uncommitted: where do they land?", false, 20);
  addThread("transfer-portal", "Winter window: biggest names expected to enter", true, 2);
  addThread("transfer-portal", "QB carousel thread", false, 8);
  addThread("transfer-portal", "NIL valuations are getting out of hand", false, 30);
  addThread("basketball-recruiting", "Rivals150 update discussion", true, 4);
  addThread("basketball-recruiting", "Early signing period: who commits first?", false, 15);
  addThread("high-school", "Week 8 Game of the Week picks", false, 5);
  addThread("high-school", "State playoff brackets are out", false, 24);

  for (const t of TEAMS) {
    const commits = fb26.filter((p) => p.committedTo === t.slug);
    addThread(`${t.slug}-board`, `${t.siteName} Insider Thread: latest recruiting intel`, true, r.int(1, 6));
    addThread(`${t.slug}-board`, `${t.name} 2026 class tracker (${commits.length} commits)`, true, r.int(2, 24));
    if (commits[0]) addThread(`${t.slug}-board`, `${commits[0].firstName} ${commits[0].lastName} commitment reaction`, false, r.int(5, 100));
    addThread(`${t.slug}-board`, `Official visit weekend recap`, false, r.int(10, 150));
    addThread(`${t.slug}-board`, `Game thread: ${t.nickname} vs. ${r.pick(TEAMS).nickname}`, false, r.int(20, 200));
  }

  for (const b of boards) {
    const bt = threads.filter((t) => t.boardSlug === b.slug);
    b.threads = bt.length + r.int(800, 12000);
    b.posts = b.threads * r.int(8, 30);
  }
  threads.sort((a, b) => b.lastPostAt.localeCompare(a.lastPostAt));
  return { boards, threads };
}

const forums = genForums();
export const FORUM_BOARDS: ForumBoard[] = forums.boards;
export const FORUM_THREADS: ForumThread[] = forums.threads;

/* ---------- transfer portal ---------- */
function genPortal(): PortalEntry[] {
  const r = new Rng(9090);
  const now = new Date("2026-10-09");
  const out: PortalEntry[] = [];
  const used = new Set<string>();
  for (let i = 0; i < 120; i++) {
    const sport: Sport = i % 4 === 3 ? "basketball" : "football";
    let name = `${r.pick(FIRST)} ${r.pick(LAST)}`;
    while (used.has(name)) name = `${r.pick(FIRST)} ${r.pick(LAST)}`;
    used.add(name);
    const pos = weightedPos(r, sport);
    const [h, w] = sizeFor(r, sport, pos);
    const from = r.pick(TEAMS);
    let to = r.pick(TEAMS);
    while (to.slug === from.slug) to = r.pick(TEAMS);
    const rating = Math.round((97.5 - 14 * Math.pow(i / 120, 0.6) + r.next()) * 100) / 100;
    const stars: 3 | 4 | 5 = rating >= 95 ? 5 : rating >= 88 ? 4 : 3;
    const statusRoll = r.next();
    const status: PortalEntry["status"] = statusRoll < 0.45 ? "Entered" : statusRoll < 0.9 ? "Committed" : "Withdrawn";
    const d = new Date(now);
    d.setDate(d.getDate() - r.int(0, 120));
    const st = weightedState(r);
    out.push({
      id: i + 1,
      slug: slugify(`${name}-${i + 1}`),
      name,
      sport,
      position: pos,
      fromTeam: from.slug,
      toTeam: status === "Committed" ? to.slug : null,
      status,
      rating,
      stars,
      eligibility: r.pick(["Freshman", "Redshirt Freshman", "Sophomore", "Redshirt Sophomore", "Junior", "Redshirt Junior", "Senior", "Graduate"]),
      enteredAt: fmt(d),
      nilValue: Math.round((stars === 5 ? 800000 + r.next() * 2200000 : stars === 4 ? 200000 + r.next() * 900000 : 40000 + r.next() * 250000) / 1000) * 1000,
      heightIn: h,
      weightLb: w,
      hometown: `${r.pick(st.cities)}, ${st.code}`,
    });
  }
  return out.sort((a, b) => b.enteredAt.localeCompare(a.enteredAt));
}
export const PORTAL: PortalEntry[] = genPortal();

/* ---------- camps ---------- */
export const CAMPS: CampEvent[] = [
  { slug: "rcs-dallas-2027", name: "Rivals Camp Series: Dallas", city: "Dallas", state: "TX", date: "2027-03-14", type: "Camp Series", sport: "football", description: "The Camp Series kicks off in the heart of Texas with the state's deepest talent pool." },
  { slug: "rcs-atlanta-2027", name: "Rivals Camp Series: Atlanta", city: "Atlanta", state: "GA", date: "2027-03-21", type: "Camp Series", sport: "football", description: "Georgia's elite prospects compete for invites to the Rivals Five-Star." },
  { slug: "rcs-miami-2027", name: "Rivals Camp Series: Miami", city: "Miami", state: "FL", date: "2027-03-28", type: "Camp Series", sport: "football", description: "South Florida speed takes center stage." },
  { slug: "rcs-los-angeles-2027", name: "Rivals Camp Series: Los Angeles", city: "Los Angeles", state: "CA", date: "2027-04-11", type: "Camp Series", sport: "football", description: "The West Coast's top quarterbacks and skill talent." },
  { slug: "rcs-charlotte-2027", name: "Rivals Camp Series: Charlotte", city: "Charlotte", state: "NC", date: "2027-04-18", type: "Camp Series", sport: "football", description: "Carolinas and Virginia prospects battle for MVP honors." },
  { slug: "rcs-new-jersey-2027", name: "Rivals Camp Series: New Jersey", city: "East Rutherford", state: "NJ", date: "2027-04-25", type: "Camp Series", sport: "football", description: "The Northeast's premier showcase." },
  { slug: "rcs-ohio-2027", name: "Rivals Camp Series: Ohio", city: "Columbus", state: "OH", date: "2027-05-02", type: "Camp Series", sport: "football", description: "Midwest linemen and linebackers headline the Columbus stop." },
  { slug: "underclassman-challenge-2027", name: "Rivals Underclassman Challenge", city: "Atlanta", state: "GA", date: "2027-06-19", type: "Underclassman Challenge", sport: "football", description: "The nation's top freshmen and sophomores earn their first national exposure." },
  { slug: "five-star-2027", name: "Rivals Five-Star", city: "Atlanta", state: "GA", date: "2027-06-26", type: "Five-Star", sport: "football", description: "Invite-only. The 100 best rising seniors in America in one place." },
  { slug: "rivals-hoops-showcase-2027", name: "Rivals Hoops Showcase", city: "Las Vegas", state: "NV", date: "2027-07-10", type: "Showcase", sport: "basketball", description: "Elite grassroots prospects in front of Rivals basketball analysts." },
];
