import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "World Clock",
  description: "Free world clock for displaying current time across multiple global time zones.",
  alternates: { canonical: "https://aztools.in/tools/world-clock" },
  openGraph: {
    title: "World Clock - AZ Tools",
    description: "Track current time across multiple global cities and time zones.",
    url: "https://aztools.in/tools/world-clock",
    type: "website",
  },
};

export default function Page() {
  return <Client />;
}
