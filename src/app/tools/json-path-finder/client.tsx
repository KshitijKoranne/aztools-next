"use client";

import { useMemo, useState } from "react";
import { Copy, Search } from "lucide-react";
import { toast } from "sonner";

import { ToolLayout } from "@/components/layouts/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Match = { path: string; value: string };

const sample = JSON.stringify({ user: { id: 7, name: "Asha", roles: ["admin", "editor"] }, active: true }, null, 2);

function walk(value: unknown, path: string, query: string, matches: Match[]) {
  const text = typeof value === "string" ? value : JSON.stringify(value);
  if (path && (!query || path.toLowerCase().includes(query) || String(text).toLowerCase().includes(query))) {
    matches.push({ path, value: String(text) });
  }
  if (Array.isArray(value)) value.forEach((item, index) => walk(item, `${path}[${index}]`, query, matches));
  else if (value && typeof value === "object") {
    Object.entries(value as Record<string, unknown>).forEach(([key, item]) => {
      const safeKey = /^[a-zA-Z_$][\w$]*$/.test(key) ? `.${key}` : `[${JSON.stringify(key)}]`;
      walk(item, path ? `${path}${safeKey}` : key, query, matches);
    });
  }
}

export default function Client() {
  const [json, setJson] = useState(sample);
  const [query, setQuery] = useState("");
  const result = useMemo(() => {
    try {
      const matches: Match[] = [];
      walk(JSON.parse(json), "", query.trim().toLowerCase(), matches);
      return { matches, error: "" };
    } catch (error) {
      return { matches: [], error: error instanceof Error ? error.message : "Invalid JSON" };
    }
  }, [json, query]);

  async function copy(value: string) {
    await navigator.clipboard.writeText(value);
    toast.success("Copied.");
  }

  return (
    <ToolLayout toolId="json-path-finder">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>JSON Input</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Textarea value={json} onChange={(event) => setJson(event.target.value)} className="min-h-96 font-mono text-sm" />
            <Button variant="outline" onClick={() => setJson(sample)}>Load sample</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Search className="h-5 w-5" />Paths</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search path or value" />
            {result.error ? <p className="text-sm text-destructive">{result.error}</p> : (
              <div className="max-h-96 space-y-2 overflow-auto">
                {result.matches.slice(0, 100).map((match) => (
                  <div key={match.path} className="rounded-md border p-3">
                    <div className="flex items-start justify-between gap-3">
                      <code className="break-all text-sm">{match.path}</code>
                      <Button variant="ghost" size="sm" onClick={() => copy(match.path)}><Copy className="h-4 w-4" /></Button>
                    </div>
                    <p className="mt-1 truncate text-xs text-muted-foreground">{match.value}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
