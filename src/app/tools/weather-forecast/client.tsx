"use client";

import { useState } from "react";
import { CloudSun, Search } from "lucide-react";
import { toast } from "sonner";

import { ToolLayout } from "@/components/layouts/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface WeatherDay {
  date: string;
  max: number;
  min: number;
  rain: number;
  wind: number;
}

interface WeatherResult {
  place: {
    name: string;
    region?: string;
    country?: string;
    latitude: number;
    longitude: number;
    timezone?: string;
  };
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    precipitation: number;
    wind_speed_10m: number;
  };
  units: {
    temperature: string;
    wind: string;
    rain: string;
  };
  daily: WeatherDay[];
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", { weekday: "short", month: "short", day: "numeric" }).format(new Date(value));
}

export default function Client() {
  const [query, setQuery] = useState("Mumbai");
  const [result, setResult] = useState<WeatherResult | null>(null);
  const [busy, setBusy] = useState(false);

  async function lookupWeather() {
    if (query.trim().length < 2) return toast.error("Enter a city or postal code.");
    setBusy(true);
    try {
      const response = await fetch(`/api/live-data/weather?q=${encodeURIComponent(query.trim())}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Weather lookup failed.");
      setResult(data);
      toast.success("Forecast loaded.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not fetch weather.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <ToolLayout toolId="weather-forecast">
      <div className="mx-auto max-w-5xl space-y-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><CloudSun className="h-5 w-5" />Weather Forecast</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-[1fr_auto]">
              <div className="space-y-2">
                <Label>City or postal code</Label>
                <Input value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => event.key === "Enter" && lookupWeather()} placeholder="Mumbai, London, Tokyo" />
              </div>
              <Button onClick={lookupWeather} disabled={busy} className="self-end">
                <Search className="h-4 w-4" />
                {busy ? "Checking..." : "Get Forecast"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {result && (
          <>
            <Card>
              <CardContent className="grid gap-4 py-5 md:grid-cols-4">
                <div className="md:col-span-2">
                  <div className="text-sm font-semibold text-muted-foreground">{[result.place.region, result.place.country].filter(Boolean).join(", ")}</div>
                  <div className="mt-1 text-3xl font-black">{result.place.name}</div>
                  <div className="mt-2 text-xs text-muted-foreground">{result.place.latitude.toFixed(2)}, {result.place.longitude.toFixed(2)} · {result.place.timezone}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Temperature</div>
                  <div className="text-3xl font-black">{Math.round(result.current.temperature_2m)}{result.units.temperature}</div>
                  <div className="text-sm text-muted-foreground">Feels {Math.round(result.current.apparent_temperature)}{result.units.temperature}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Wind / humidity</div>
                  <div className="text-2xl font-black">{Math.round(result.current.wind_speed_10m)} {result.units.wind}</div>
                  <div className="text-sm text-muted-foreground">{result.current.relative_humidity_2m}% humidity</div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-3 md:grid-cols-7">
              {result.daily.map((day) => (
                <Card key={day.date}>
                  <CardContent className="py-4">
                    <div className="text-sm font-black">{formatDate(day.date)}</div>
                    <div className="mt-3 text-2xl font-black">{Math.round(day.max)}{result.units.temperature}</div>
                    <div className="text-sm text-muted-foreground">Low {Math.round(day.min)}{result.units.temperature}</div>
                    <div className="mt-3 text-xs text-muted-foreground">Rain {day.rain} mm</div>
                    <div className="text-xs text-muted-foreground">Wind {Math.round(day.wind)} {result.units.wind}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </ToolLayout>
  );
}
