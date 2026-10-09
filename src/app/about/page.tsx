import type { Metadata } from "next";
import { PageTitle } from "@/components/ui";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-5">
      <PageTitle kicker="Company" title="About Born2Compete" />
      <div className="space-y-4 rounded border border-line bg-white p-6 text-[15px] leading-7 text-gray-800">
        <p>Born2Compete is a college recruiting network: national player and team rankings, commitment tracking, transfer portal coverage, camp evaluations, and a team site with its own fan community for every program.</p>
        <p>This build is a demo. Every prospect, article, forum post and portal entry on the site is generated sample content, not reporting about real people.</p>
        <h2 id="contact" className="font-display text-2xl font-bold uppercase text-navy">Contact</h2>
        <p>Editorial, membership and support questions: hello@example.com.</p>
        <h2 id="advertise" className="font-display text-2xl font-bold uppercase text-navy">Advertise</h2>
        <p>Reach the most engaged college sports audience on the web. Sponsorships are available across the national site, team sites and the Camp Series.</p>
      </div>
    </div>
  );
}
