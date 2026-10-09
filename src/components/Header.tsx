import Link from "next/link";
import { SearchBox } from "./SearchBox";
import { MobileNav } from "./MobileNav";

export const NAV = [
  { href: "/news", label: "News" },
  { href: "/football", label: "Football" },
  { href: "/basketball", label: "Basketball" },
  { href: "/rankings/player/football/2026", label: "Rankings" },
  { href: "/transfer-portal", label: "Transfer Portal" },
  { href: "/teams", label: "Team Sites" },
  { href: "/forums", label: "Forums" },
  { href: "/camps", label: "Camps" },
];

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2 ${className}`} aria-label="Born2Compete home">
      <span className="grid h-9 w-9 place-items-center rounded bg-brand font-display text-xl font-extrabold text-white shadow">B2</span>
      <span className="font-display text-2xl font-bold uppercase tracking-wide text-white">
        Born<span className="text-brand">2</span>Compete
      </span>
    </Link>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-navy text-white shadow-md">
      <div className="border-b border-white/10 bg-black/30 text-[11px] uppercase tracking-wider text-white/70">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1">
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline">The home of college recruiting</span>
            <Link href="/futurecast" className="hover:text-white">FutureCast</Link>
            <Link href="/rankings/team/football/2026" className="hover:text-white">Team Rankings</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/subscribe" className="hover:text-white">Subscribe</Link>
            <Link href="/login" className="hover:text-white">Log In</Link>
          </div>
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-2.5">
        <MobileNav />
        <Logo />
        <nav className="ml-4 hidden items-center gap-0.5 lg:flex">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="whitespace-nowrap rounded px-2.5 py-1.5 font-display text-[17px] font-semibold uppercase tracking-wide text-white/90 hover:bg-white/10 hover:text-white">
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-3">
          <SearchBox />
          <Link href="/subscribe" className="hidden rounded bg-brand px-3 py-1.5 font-display text-base font-bold uppercase tracking-wide text-white hover:bg-brand-2 sm:inline-block">
            Join Now
          </Link>
        </div>
      </div>
    </header>
  );
}
