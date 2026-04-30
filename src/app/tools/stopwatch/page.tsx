import type { Metadata } from "next";
import Client from "./client";
export const metadata: Metadata = {
  title: "Stopwatch & Timer",
  description: "Free online stopwatch and countdown timer. Start, pause, and reset with precision, or set a countdown timer for any duration.",
  keywords: ["stopwatch","timer","countdown timer","online stopwatch"],
  alternates: { canonical: "https://aztools.in/tools/stopwatch" },
  openGraph: { title: "Stopwatch & Timer - AZ Tools", description: "Free online stopwatch and countdown timer. Start, pause, and reset with precision, or set a countdown timer for any duration.", url: "https://aztools.in/tools/stopwatch", type: "website" },
};
export default function Page() { return <Client />; }
