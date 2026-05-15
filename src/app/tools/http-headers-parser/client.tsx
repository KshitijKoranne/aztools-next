"use client";

import { useState } from "react";
import { Copy, RefreshCw, Server } from "lucide-react";
import { toast } from "sonner";

import { ToolLayout } from "@/components/layouts/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface ParsedHeaders {
  startLine: string;
  headers: [string, string][];
  duplicates: string[];
}

function parseHeaders(input: string): ParsedHeaders {
  const lines = input.replace(/\r\n/g, "\n").split("\n").map((line) => line.trimEnd()).filter(Boolean);
  let startLine = "";
  const headerLines = [...lines];

  if (headerLines[0] && !headerLines[0].includes(":")) {
    startLine = headerLines.shift() ?? "";
  }

  const seen = new Map<string, number>();
  const headers: [string, string][] = [];
  for (const line of headerLines) {
    const index = line.indexOf(":");
    if (index === -1) continue;
    const name = line.slice(0, index).trim();
    const value = line.slice(index + 1).trim();
    headers.push([name, value]);
    const key = name.toLowerCase();
    seen.set(key, (seen.get(key) ?? 0) + 1);
  }

  return {
    startLine,
    headers,
    duplicates: Array.from(seen.entries()).filter(([, count]) => count > 1).map(([name]) => name),
  };
}

export default function HttpHeadersParserClient() {
  const [input, setInput] = useState("");
  const [parsed, setParsed] = useState<ParsedHeaders | null>(null);

  function parse() {
    if (!input.trim()) {
      toast.error("Paste headers first.");
      return;
    }
    const result = parseHeaders(input);
    if (result.headers.length === 0) {
      toast.error("No valid header lines found.");
      return;
    }
    setParsed(result);
    toast.success(`${result.headers.length} header${result.headers.length === 1 ? "" : "s"} parsed.`);
  }

  async function copyJson() {
    if (!parsed) return;
    await navigator.clipboard.writeText(JSON.stringify(Object.fromEntries(parsed.headers), null, 2));
    toast.success("Headers copied as JSON.");
  }

  function loadSample() {
    setInput(`HTTP/2 200 OK
content-type: text/html; charset=utf-8
cache-control: public, max-age=3600
server: Vercel
x-frame-options: SAMEORIGIN
set-cookie: session=abc123; HttpOnly; Secure`);
  }

  return (
    <ToolLayout toolId="http-headers-parser">
      <div className="mx-auto max-w-5xl space-y-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Server className="h-5 w-5" /> HTTP Headers Parser</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Textarea value={input} onChange={(event) => setInput(event.target.value)} placeholder="Paste raw request or response headers..." className="min-h-56 font-mono text-sm" />
            <div className="flex flex-wrap gap-2">
              <Button onClick={parse}>Parse Headers</Button>
              <Button variant="outline" onClick={loadSample}>Load Sample</Button>
              <Button variant="outline" onClick={copyJson} disabled={!parsed}><Copy className="mr-2 h-4 w-4" />Copy JSON</Button>
              <Button variant="outline" size="icon" onClick={() => { setInput(""); setParsed(null); }}><RefreshCw className="h-4 w-4" /></Button>
            </div>
          </CardContent>
        </Card>

        {parsed && (
          <Card>
            <CardHeader><CardTitle>Parsed Headers</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {parsed.startLine && (
                <div className="rounded-md border bg-muted/30 p-3">
                  <div className="text-xs font-bold uppercase text-muted-foreground">Start line</div>
                  <div className="mt-1 font-mono text-sm">{parsed.startLine}</div>
                </div>
              )}
              {parsed.duplicates.length > 0 && (
                <div className="rounded-md border bg-muted/30 p-3 text-sm">
                  Duplicate header names: {parsed.duplicates.join(", ")}
                </div>
              )}
              <div className="grid gap-3">
                {parsed.headers.map(([name, value], index) => (
                  <div key={`${name}-${index}`} className="grid gap-2 rounded-md border p-3 md:grid-cols-[14rem_1fr]">
                    <div className="break-all font-mono text-sm font-semibold">{name}</div>
                    <div className="break-all font-mono text-sm text-muted-foreground">{value}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ToolLayout>
  );
}
