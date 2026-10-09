import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <div className="font-display text-8xl font-bold text-gray-200">404</div>
      <h1 className="font-display text-3xl font-bold uppercase text-navy">Incomplete pass</h1>
      <p className="mt-2 text-gray-600">We couldn&apos;t find that page. It may have been moved, or the link is out of date.</p>
      <div className="mt-5 flex justify-center gap-2">
        <Link href="/" className="rounded bg-navy px-4 py-2 font-display font-bold uppercase text-white">Home</Link>
        <Link href="/rankings/player/football/2026" className="rounded border border-line bg-white px-4 py-2 font-display font-bold uppercase text-navy">Rankings</Link>
      </div>
    </div>
  );
}
