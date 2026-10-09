import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Log In" };

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <div className="rounded border border-line bg-white p-6">
        <h1 className="font-display text-4xl font-bold uppercase text-navy">Log In</h1>
        <p className="mt-1 text-sm text-gray-600">Access premium content and the message boards.</p>
        <form className="mt-5 space-y-3" action="/" method="get">
          <label className="block text-sm font-semibold">Email<input type="email" name="email" required className="mt-1 w-full rounded border border-line px-3 py-2 font-normal outline-none focus:border-brand" /></label>
          <label className="block text-sm font-semibold">Password<input type="password" name="password" required className="mt-1 w-full rounded border border-line px-3 py-2 font-normal outline-none focus:border-brand" /></label>
          <button type="submit" className="w-full rounded bg-navy px-4 py-2.5 font-display text-lg font-bold uppercase text-white hover:bg-navy-2">Log in</button>
        </form>
        <p className="mt-4 text-center text-xs text-gray-500">Demo only. No account is created. New here? <Link href="/subscribe" className="underline">Subscribe</Link>.</p>
      </div>
    </div>
  );
}
