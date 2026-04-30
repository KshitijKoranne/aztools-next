import type { Metadata } from "next";
import Client from "./client";
export const metadata: Metadata = {
  title: "BMI Calculator",
  description: "Free BMI calculator. Calculate your Body Mass Index in metric or imperial units and see your healthy weight range.",
  keywords: ["BMI calculator","body mass index","weight calculator","health calculator"],
  alternates: { canonical: "https://aztools.in/tools/bmi-calculator" },
  openGraph: { title: "BMI Calculator - AZ Tools", description: "Free BMI calculator. Calculate your Body Mass Index in metric or imperial units and see your healthy weight range.", url: "https://aztools.in/tools/bmi-calculator", type: "website" },
};
export default function Page() { return <Client />; }
