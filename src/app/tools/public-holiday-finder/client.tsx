"use client";

import { useState } from "react";
import { CalendarDays, Search } from "lucide-react";
import { toast } from "sonner";

import { ToolLayout } from "@/components/layouts/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Holiday {
  date: string;
  localName: string;
  name: string;
  countryCode: string;
  global: boolean;
  types: string[];
}

interface HolidayResult {
  country: string;
  year: number;
  holidays: Holiday[];
}

function prettyDate(value: string) {
  return new Intl.DateTimeFormat("en", { weekday: "short", month: "short", day: "numeric" }).format(new Date(value));
}

export default function Client() {
  const [country, setCountry] = useState("US");
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [result, setResult] = useState<HolidayResult | null>(null);
  const [busy, setBusy] = useState(false);

  async function findHolidays() {
    setBusy(true);
    try {
      const response = await fetch(`/api/live-data/holidays?country=${encodeURIComponent(country)}&year=${encodeURIComponent(year)}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Holiday lookup failed.");
      setResult(data);
      toast.success(`${data.holidays.length} holidays loaded.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not fetch holidays.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <ToolLayout toolId="public-holiday-finder">
      <div className="mx-auto max-w-5xl space-y-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><CalendarDays className="h-5 w-5" />Public Holiday Finder</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
              <div className="space-y-2">
                <Label>Country code</Label>
                <Input value={country} onChange={(event) => setCountry(event.target.value.toUpperCase())} maxLength={2} placeholder="US" />
              </div>
              <div className="space-y-2">
                <Label>Year</Label>
                <Input type="number" value={year} onChange={(event) => setYear(event.target.value)} min="1970" max={new Date().getFullYear() + 5} />
              </div>
              <Button onClick={findHolidays} disabled={busy} className="self-end">
                <Search className="h-4 w-4" />
                {busy ? "Finding..." : "Find Holidays"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {result && (
          <Card>
            <CardHeader><CardTitle>{result.country} holidays in {result.year}</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {result.holidays.map((holiday) => (
                <div key={`${holiday.date}-${holiday.name}`} className="grid gap-2 rounded-md border bg-muted/30 p-3 md:grid-cols-[9rem_1fr_auto] md:items-center">
                  <div className="font-mono text-sm font-bold text-primary">{prettyDate(holiday.date)}</div>
                  <div>
                    <div className="font-black">{holiday.name}</div>
                    <div className="text-sm text-muted-foreground">{holiday.localName}</div>
                  </div>
                  <div className="text-xs font-bold uppercase text-muted-foreground">{holiday.types?.join(", ") || (holiday.global ? "Public" : "Regional")}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </ToolLayout>
  );
}
