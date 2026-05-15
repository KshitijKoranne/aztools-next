"use client";

import { useState } from "react";
import { Copy, FileCode, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { ToolLayout } from "@/components/layouts/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface MetaItem {
  type: string;
  name: string;
  value: string;
}

function extractMeta(html: string): MetaItem[] {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const items: MetaItem[] = [];
  const title = doc.querySelector("title")?.textContent?.trim();
  if (title) items.push({ type: "title", name: "title", value: title });

  doc.querySelectorAll("meta").forEach((meta) => {
    const name = meta.getAttribute("name") || meta.getAttribute("property") || meta.getAttribute("http-equiv") || "meta";
    const value = meta.getAttribute("content") ?? "";
    if (value) items.push({ type: meta.getAttribute("property")?.startsWith("og:") ? "open graph" : "meta", name, value });
  });

  doc.querySelectorAll("link[rel]").forEach((link) => {
    const rel = link.getAttribute("rel") ?? "link";
    const href = link.getAttribute("href") ?? "";
    if (/canonical|icon|apple-touch-icon|manifest/i.test(rel) && href) {
      items.push({ type: "link", name: rel, value: href });
    }
  });

  return items;
}

export default function HtmlMetaExtractorClient() {
  const [input, setInput] = useState("");
  const [items, setItems] = useState<MetaItem[]>([]);

  function extract() {
    if (!input.trim()) {
      toast.error("Paste HTML first.");
      return;
    }
    const result = extractMeta(input);
    setItems(result);
    toast.success(`${result.length} item${result.length === 1 ? "" : "s"} extracted.`);
  }

  async function copyJson() {
    await navigator.clipboard.writeText(JSON.stringify(items, null, 2));
    toast.success("Metadata copied.");
  }

  function loadSample() {
    setInput(`<!doctype html>
<html>
  <head>
    <title>AZ Tools</title>
    <meta name="description" content="Free online tools for everyday work">
    <meta property="og:title" content="AZ Tools">
    <meta property="og:image" content="https://aztools.in/og-image.png">
    <meta name="twitter:card" content="summary_large_image">
    <link rel="canonical" href="https://aztools.in">
    <link rel="icon" href="/favicon.ico">
  </head>
</html>`);
  }

  return (
    <ToolLayout toolId="html-meta-extractor">
      <div className="mx-auto max-w-6xl space-y-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><FileCode className="h-5 w-5" /> HTML Meta Extractor</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Textarea value={input} onChange={(event) => setInput(event.target.value)} placeholder="Paste full HTML or a head section..." className="min-h-64 font-mono text-sm" />
            <div className="flex flex-wrap gap-2">
              <Button onClick={extract}>Extract Metadata</Button>
              <Button variant="outline" onClick={loadSample}>Load Sample</Button>
              <Button variant="outline" onClick={copyJson} disabled={items.length === 0}><Copy className="mr-2 h-4 w-4" />Copy JSON</Button>
              <Button variant="outline" size="icon" onClick={() => { setInput(""); setItems([]); }}><RefreshCw className="h-4 w-4" /></Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Extracted Items</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {items.length > 0 ? items.map((item, index) => (
              <div key={`${item.name}-${index}`} className="grid gap-2 rounded-md border bg-muted/30 p-3 md:grid-cols-[9rem_14rem_1fr]">
                <div className="text-xs font-bold uppercase text-muted-foreground">{item.type}</div>
                <div className="break-all font-mono text-sm font-semibold">{item.name}</div>
                <div className="break-all text-sm text-muted-foreground">{item.value}</div>
              </div>
            )) : <p className="text-sm text-muted-foreground">Metadata will appear here.</p>}
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
