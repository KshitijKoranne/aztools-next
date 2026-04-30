import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "Pomodoro Timer",
  description:
    "Free Pomodoro timer with configurable focus sessions, break reminders, task tracking, sound alerts, and focus statistics.",
  keywords: ["pomodoro timer", "focus timer", "productivity timer", "work timer", "break timer"],
  alternates: { canonical: "https://aztools.in/tools/pomodoro-timer" },
  openGraph: {
    title: "Pomodoro Timer - AZ Tools",
    description: "Stay focused with configurable Pomodoro work sessions, breaks, task tracking, and statistics.",
    url: "https://aztools.in/tools/pomodoro-timer",
    type: "website",
  },
};

export default function Page() {
  return <Client />;
}
