import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "Weather Forecast",
  description: "Get a live 7-day weather forecast for any city using free Open-Meteo data.",
  keywords: ["weather forecast", "city weather", "open meteo weather", "free weather tool"],
  alternates: { canonical: "https://aztools.in/tools/weather-forecast" },
  openGraph: { title: "Weather Forecast - AZ Tools", description: "Check live weather forecasts by city.", url: "https://aztools.in/tools/weather-forecast", type: "website" },
};

export default function Page() {
  return <Client />;
}
