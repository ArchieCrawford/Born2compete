import type { Metadata } from "next";
import { SportHub } from "@/components/SportHub";

export const metadata: Metadata = { title: "Football Recruiting" };

export default function Page() {
  return <SportHub sport="football" />;
}
