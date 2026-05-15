"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { ExternalLink, GitBranch, GitFork, Search, Star } from "lucide-react";
import { toast } from "sonner";

import { ToolLayout } from "@/components/layouts/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RepoResult {
  name: string;
  description?: string;
  url: string;
  homepage?: string;
  language?: string;
  stars: number;
  forks: number;
  watchers: number;
  openIssues: number;
  license: string;
  defaultBranch: string;
  createdAt: string;
  updatedAt: string;
  pushedAt: string;
  topics: string[];
  archived: boolean;
}

const number = new Intl.NumberFormat("en");

function date(value: string) {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(value));
}

export default function Client() {
  const [repo, setRepo] = useState("vercel/next.js");
  const [result, setResult] = useState<RepoResult | null>(null);
  const [busy, setBusy] = useState(false);

  async function inspectRepo() {
    if (!repo.trim()) return toast.error("Enter a public GitHub repository.");
    setBusy(true);
    try {
      const response = await fetch(`/api/live-data/github-repo?repo=${encodeURIComponent(repo.trim())}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "GitHub lookup failed.");
      setResult(data);
      toast.success("Repository loaded.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not fetch repository data.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <ToolLayout toolId="github-repo-inspector">
      <div className="mx-auto max-w-5xl space-y-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><GitBranch className="h-5 w-5" />GitHub Repo Inspector</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-[1fr_auto]">
              <div className="space-y-2">
                <Label>Repository</Label>
                <Input value={repo} onChange={(event) => setRepo(event.target.value)} onKeyDown={(event) => event.key === "Enter" && inspectRepo()} placeholder="owner/repo or GitHub URL" />
              </div>
              <Button onClick={inspectRepo} disabled={busy} className="self-end">
                <Search className="h-4 w-4" />
                {busy ? "Inspecting..." : "Inspect Repo"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {result && (
          <>
            <Card>
              <CardContent className="space-y-5 py-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-sm font-bold uppercase text-primary">
                      <GitBranch className="h-4 w-4" />
                      Public repository
                    </div>
                    <h2 className="mt-2 text-3xl font-black">{result.name}</h2>
                    <p className="mt-2 max-w-3xl text-muted-foreground">{result.description ?? "No description provided."}</p>
                  </div>
                  <Button asChild>
                    <a href={result.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                      Open GitHub
                    </a>
                  </Button>
                </div>
                <div className="grid gap-3 md:grid-cols-4">
                  <Metric icon={<Star className="h-4 w-4" />} label="Stars" value={number.format(result.stars)} />
                  <Metric icon={<GitFork className="h-4 w-4" />} label="Forks" value={number.format(result.forks)} />
                  <Metric label="Open issues" value={number.format(result.openIssues)} />
                  <Metric label="Watchers" value={number.format(result.watchers)} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="grid gap-3 py-5 md:grid-cols-2">
                <Info label="Language" value={result.language ?? "Not listed"} />
                <Info label="License" value={result.license} />
                <Info label="Default branch" value={result.defaultBranch} />
                <Info label="Archived" value={result.archived ? "Yes" : "No"} />
                <Info label="Created" value={date(result.createdAt)} />
                <Info label="Last push" value={date(result.pushedAt)} />
              </CardContent>
            </Card>

            {result.topics.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {result.topics.map((topic) => (
                  <span key={topic} className="rounded-full border bg-muted/30 px-3 py-1 text-sm font-bold text-muted-foreground">{topic}</span>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </ToolLayout>
  );
}

function Metric({ icon, label, value }: { icon?: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-md border bg-muted/30 p-4">
      <div className="flex items-center gap-2 text-xs font-bold uppercase text-muted-foreground">{icon}{label}</div>
      <div className="mt-2 text-2xl font-black">{value}</div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border bg-muted/30 p-3">
      <div className="text-xs font-bold uppercase text-muted-foreground">{label}</div>
      <div className="mt-1 font-semibold">{value}</div>
    </div>
  );
}
