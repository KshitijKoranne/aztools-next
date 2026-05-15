"use client";

import { useState } from "react";
import Image from "next/image";
import { ExternalLink, Globe2, Search } from "lucide-react";
import { toast } from "sonner";

import { ToolLayout } from "@/components/layouts/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Currency {
  name: string;
  symbol?: string;
}

interface Country {
  name: { common: string; official: string };
  capital?: string[];
  region: string;
  subregion?: string;
  population: number;
  area: number;
  currencies?: Record<string, Currency>;
  languages?: Record<string, string>;
  flags?: { png?: string; svg?: string; alt?: string };
  maps?: { googleMaps?: string; openStreetMaps?: string };
  timezones?: string[];
  cca2: string;
  cca3: string;
  borders?: string[];
  latlng?: number[];
}

interface CountryResult {
  countries: Country[];
}

const number = new Intl.NumberFormat("en");

function joinValues(values?: Record<string, string>) {
  return values ? Object.values(values).join(", ") : "Not listed";
}

function currencies(values?: Record<string, Currency>) {
  if (!values) return "Not listed";
  return Object.entries(values).map(([code, currency]) => `${currency.name} (${currency.symbol ?? code})`).join(", ");
}

export default function Client() {
  const [query, setQuery] = useState("India");
  const [result, setResult] = useState<CountryResult | null>(null);
  const [busy, setBusy] = useState(false);

  async function lookupCountry() {
    if (query.trim().length < 2) return toast.error("Enter a country name or ISO code.");
    setBusy(true);
    try {
      const response = await fetch(`/api/live-data/country?q=${encodeURIComponent(query.trim())}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Country lookup failed.");
      setResult(data);
      toast.success(`${data.countries.length} result${data.countries.length === 1 ? "" : "s"} loaded.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not fetch country data.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <ToolLayout toolId="country-info-lookup">
      <div className="mx-auto max-w-5xl space-y-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Globe2 className="h-5 w-5" />Country Info Lookup</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-[1fr_auto]">
              <div className="space-y-2">
                <Label>Country name or ISO code</Label>
                <Input value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => event.key === "Enter" && lookupCountry()} placeholder="India, Japan, US, DE" />
              </div>
              <Button onClick={lookupCountry} disabled={busy} className="self-end">
                <Search className="h-4 w-4" />
                {busy ? "Searching..." : "Lookup"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {result && (
          <div className="grid gap-4">
            {result.countries.map((country) => (
              <Card key={country.cca3}>
                <CardContent className="grid gap-5 py-5 lg:grid-cols-[12rem_1fr]">
                  <div className="space-y-3">
                    {country.flags?.png && (
                      <Image src={country.flags.png} alt={country.flags.alt ?? `${country.name.common} flag`} width={220} height={140} className="rounded-md border object-cover" unoptimized />
                    )}
                    <Button asChild variant="outline" className="w-full">
                      <a href={country.maps?.googleMaps ?? country.maps?.openStreetMaps ?? "#"} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                        Open Map
                      </a>
                    </Button>
                  </div>
                  <div>
                    <div className="text-sm font-bold uppercase text-primary">{country.cca2} / {country.cca3}</div>
                    <h2 className="mt-1 text-3xl font-black">{country.name.common}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">{country.name.official}</p>
                    <div className="mt-5 grid gap-3 md:grid-cols-2">
                      <Info label="Capital" value={country.capital?.join(", ") ?? "Not listed"} />
                      <Info label="Region" value={[country.region, country.subregion].filter(Boolean).join(" / ")} />
                      <Info label="Population" value={number.format(country.population)} />
                      <Info label="Area" value={`${number.format(country.area)} km²`} />
                      <Info label="Currencies" value={currencies(country.currencies)} />
                      <Info label="Languages" value={joinValues(country.languages)} />
                      <Info label="Timezones" value={country.timezones?.join(", ") ?? "Not listed"} />
                      <Info label="Borders" value={country.borders?.join(", ") ?? "None listed"} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border bg-muted/30 p-3">
      <div className="text-xs font-bold uppercase text-muted-foreground">{label}</div>
      <div className="mt-1 text-sm font-semibold">{value}</div>
    </div>
  );
}
