import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "Meeting Time Finder",
  description: "Free meeting time finder for scheduling across multiple time zones and working hours.",
  alternates: { canonical: "https://aztools.in/tools/meeting-time-finder" },
  openGraph: {
    title: "Meeting Time Finder - AZ Tools",
    description: "Find common meeting times across global time zones.",
    url: "https://aztools.in/tools/meeting-time-finder",
    type: "website",
  },
};

export default function Page() {
  return <Client />;
}
