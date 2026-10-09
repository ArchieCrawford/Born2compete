"use client";
import Link from "next/link";
import { useState } from "react";

const NAV = [
  { href: "/news", label: "News" },
  { href: "/football", label: "Football" },
  { href: "/basketball", label: "Basketball" },
  { href: "/rankings/player/football/2026", label: "Player Rankings" },
  { href: "/rankings/team/football/2026", label: "Team Rankings" },
  { href: "/futurecast", label: "FutureCast" },
  { href: "/transfer-portal", label: "Transfer Portal" },
  { href: "/teams", label: "Team Sites" },
  { href: "/forums", label: "Forums" },
  { href: "/camps", label: "Camps" },
  { href: "/subscribe", label: "Subscribe" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  return (
    <div className="lg:hidden">
      <button onClick={() => setOpen((o) => !o)} aria-label="Toggle navigation" aria-expanded={open} className="rounded p-1.5 hover:bg-white/10">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>
      {open && (
        <div className="absolute inset-x-0 top-full border-t border-white/10 bg-navy shadow-xl">
          <nav className="mx-auto grid max-w-7xl gap-1 px-4 py-3">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className="rounded px-3 py-2 font-display text-lg font-semibold uppercase tracking-wide text-white/90 hover:bg-white/10">
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
