export type Sport = "football" | "basketball";

export type Position = string;

export interface Team {
  slug: string;
  name: string;
  nickname: string;
  abbr: string;
  conference: string;
  primary: string;
  secondary: string;
  siteName: string;
  state: string;
  /** relative recruiting pull, 0-1 */
  pull: number;
}

export interface Offer {
  teamSlug: string;
  date: string;
}

export interface TimelineEvent {
  date: string;
  type: "offer" | "visit" | "commit" | "decommit" | "ranking" | "camp";
  text: string;
}

export interface Prediction {
  analyst: string;
  teamSlug: string;
  confidence: number; // 1-10
  date: string;
}

export interface Prospect {
  slug: string;
  id: number;
  firstName: string;
  lastName: string;
  sport: Sport;
  year: number;
  position: Position;
  heightIn: number;
  weightLb: number;
  hometown: string;
  state: string;
  highSchool: string;
  rating: number; // 0-100
  stars: 2 | 3 | 4 | 5;
  nationalRank: number;
  positionRank: number;
  stateRank: number;
  committedTo: string | null;
  commitDate: string | null;
  offers: Offer[];
  timeline: TimelineEvent[];
  predictions: Prediction[];
  bio: string;
  nilValue: number;
}

export interface Article {
  slug: string;
  id: number;
  title: string;
  dek: string;
  category: string;
  sport: Sport | "general";
  author: string;
  publishedAt: string;
  teamSlug: string | null;
  prospectSlug: string | null;
  premium: boolean;
  body: string[];
  tag: string;
}

export interface ForumBoard {
  slug: string;
  name: string;
  description: string;
  teamSlug: string | null;
  threads: number;
  posts: number;
}

export interface ForumPost {
  id: number;
  author: string;
  date: string;
  body: string;
}

export interface ForumThread {
  slug: string;
  id: number;
  boardSlug: string;
  title: string;
  author: string;
  createdAt: string;
  lastPostAt: string;
  replies: number;
  views: number;
  pinned: boolean;
  posts: ForumPost[];
}

export interface PortalEntry {
  id: number;
  slug: string;
  name: string;
  sport: Sport;
  position: Position;
  fromTeam: string;
  toTeam: string | null;
  status: "Entered" | "Committed" | "Withdrawn";
  rating: number;
  stars: 3 | 4 | 5;
  eligibility: string;
  enteredAt: string;
  nilValue: number;
  heightIn: number;
  weightLb: number;
  hometown: string;
}

export interface CampEvent {
  slug: string;
  name: string;
  city: string;
  state: string;
  date: string;
  type: "Camp Series" | "Five-Star" | "Underclassman Challenge" | "Showcase";
  sport: Sport;
  description: string;
}
