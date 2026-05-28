"use client";

import { useState } from "react";
import { ExternalLink, PackageSearch, Search } from "lucide-react";
import { toast } from "sonner";

import { ToolLayout } from "@/components/layouts/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface NpmResult {
  name: string;
  description: string | null;
  latest: string | null;
  license: string | null;
  homepage: string | null;
  repository: string | null;
  versions: number;
  maintainers: string[];
  createdAt: string | null;
  modifiedAt: string | null;
  lastWeekDownloads: number | null;
}

const number = new Intl.NumberFormat("en");

function formatDate(value: string | null) {
  if (!value) return "Not listed";
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(value));
}

export default function Client() {
  const [name, setName] = useState("next");
  const [result, setResult] = useState<NpmResult | null>(null);
  const [busy, setBusy] = useState(false);

  async function inspectPackage() {
    if (!name.trim()) return toast.error("Enter an npm package name.");
    setBusy(true);
    try {
      const response = await fetch(`/api/live-data/npm-package?name=${encodeURIComponent(name.trim())}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Package lookup failed.");
      setResult(data);
      toast.success("Package loaded.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not fetch package data.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <ToolLayout toolId="npm-package-inspector">
      <div className="mx-auto max-w-5xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><PackageSearch className="h-5 w-5" />NPM Package Inspector</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-[1fr_auto]">
            <div className="space-y-2">
              <Label>Package name</Label>
              <Input value={name} onChange={(event) => setName(event.target.value)} onKeyDown={(event) => event.key === "Enter" && inspectPackage()} placeholder="react, next, @types/node" />
            </div>
            <Button onClick={inspectPackage} disabled={busy} className="self-end">
              <Search className="h-4 w-4" />
              {busy ? "Checking..." : "Inspect"}
            </Button>
          </CardContent>
        </Card>

        {result && (
          <>
            <Card>
              <CardContent className="space-y-5 py-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="text-sm font-bold uppercase text-primary">npm registry package</div>
                    <h2 className="mt-2 text-3xl font-black">{result.name}</h2>
                    <p className="mt-2 max-w-3xl text-muted-foreground">{result.description ?? "No description provided."}</p>
                  </div>
                  {result.repository && (
                    <Button asChild variant="outline">
                      <a href={result.repository} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" /> Repository
                      </a>
                    </Button>
                  )}
                </div>
                <div className="grid gap-3 md:grid-cols-4">
                  <Metric label="Latest" value={result.latest ?? "Unknown"} />
                  <Metric label="Versions" value={number.format(result.versions)} />
                  <Metric label="Weekly downloads" value={result.lastWeekDownloads === null ? "Unknown" : number.format(result.lastWeekDownloads)} />
                  <Metric label="License" value={result.license ?? "Not listed"} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="grid gap-3 py-5 md:grid-cols-2">
                <Info label="Created" value={formatDate(result.createdAt)} />
                <Info label="Modified" value={formatDate(result.modifiedAt)} />
                <Info label="Homepage" value={result.homepage ?? "Not listed"} />
                <Info label="Maintainers" value={result.maintainers.length ? result.maintainers.join(", ") : "Not listed"} />
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </ToolLayout>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border bg-muted/30 p-4">
      <div className="text-xs font-bold uppercase text-muted-foreground">{label}</div>
      <div className="mt-2 break-words text-2xl font-black">{value}</div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border bg-muted/30 p-3">
      <div className="text-xs font-bold uppercase text-muted-foreground">{label}</div>
      <div className="mt-1 break-words font-semibold">{value}</div>
    </div>
  );
}
