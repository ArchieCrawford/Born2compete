import type { Metadata } from "next";
import { Barlow_Condensed, Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TeamBar } from "@/components/TeamBar";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const barlow = Barlow_Condensed({ variable: "--font-barlow", subsets: ["latin"], weight: ["500", "600", "700", "800"] });

export const metadata: Metadata = {
  title: { default: "Born2Compete | College Recruiting, Rankings & Transfer Portal", template: "%s | Born2Compete" },
  description: "Football and basketball recruiting rankings, commitments, transfer portal tracking, team sites and fan forums.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${barlow.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Header />
        <TeamBar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
