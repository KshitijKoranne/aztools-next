"use client";

import { useState } from "react";
import { Copy, Globe2, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { ToolLayout } from "@/components/layouts/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ParsedUrl {
  href: string;
  protocol: string;
  username: string;
  password: string;
  hostname: string;
  port: string;
  pathname: string;
  search: string;
  hash: string;
  origin: string;
  params: [string, string][];
}

export default function UrlParserClient() {
  const [input, setInput] = useState("https://aztools.in/search?q=json&source=home#results");
  const [parsed, setParsed] = useState<ParsedUrl | null>(null);

  function parse() {
    try {
      const url = new URL(input.trim());
      setParsed({
        href: url.href,
        protocol: url.protocol,
        username: url.username,
        password: url.password,
        hostname: url.hostname,
        port: url.port,
        pathname: url.pathname,
        search: url.search,
        hash: url.hash,
        origin: url.origin,
        params: Array.from(url.searchParams.entries()),
      });
      toast.success("URL parsed.");
    } catch {
      toast.error("Enter a valid absolute URL, including https:// or http://.");
    }
  }

  async function copyJson() {
    if (!parsed) return;
    await navigator.clipboard.writeText(JSON.stringify(parsed, null, 2));
    toast.success("Parsed URL copied.");
  }

  return (
    <ToolLayout toolId="url-parser">
      <div className="mx-auto max-w-5xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Globe2 className="h-5 w-5" /> URL Parser</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>URL</Label>
              <Input value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => event.key === "Enter" && parse()} placeholder="https://example.com/path?name=value#section" />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={parse}>Parse URL</Button>
              <Button variant="outline" onClick={copyJson} disabled={!parsed}><Copy className="mr-2 h-4 w-4" />Copy JSON</Button>
              <Button variant="outline" size="icon" onClick={() => { setInput(""); setParsed(null); }}><RefreshCw className="h-4 w-4" /></Button>
            </div>
          </CardContent>
        </Card>

        {parsed && (
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader><CardTitle>Parts</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(parsed).filter(([key]) => key !== "params").map(([key, value]) => (
                  <div key={key} className="rounded-md border bg-muted/30 p-3">
                    <div className="text-xs font-bold uppercase text-muted-foreground">{key}</div>
                    <div className="mt-1 break-all font-mono text-sm">{String(value || "-")}</div>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Query Parameters</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {parsed.params.length > 0 ? parsed.params.map(([key, value], index) => (
                  <div key={`${key}-${index}`} className="grid gap-2 rounded-md border bg-muted/30 p-3 sm:grid-cols-[12rem_1fr]">
                    <div className="break-all font-mono text-sm font-semibold">{key}</div>
                    <div className="break-all font-mono text-sm text-muted-foreground">{value}</div>
                  </div>
                )) : <p className="text-sm text-muted-foreground">No query parameters found.</p>}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
