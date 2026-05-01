"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Copy, Download, Map } from "lucide-react";

import { ToolLayout } from "@/components/layouts/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function escapeXml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export default function Client() {
  const [domain, setDomain] = useState("");
  const [urls, setUrls] = useState("");
  const [output, setOutput] = useState("");

  function normalizeUrl(url: string) {
    if (/^https?:\/\//i.test(url)) return url;
    const base = domain.trim().replace(/\/$/, "");
    const path = url.startsWith("/") ? url : `/${url}`;
    return `${base}${path}`;
  }

  function generate() {
    const list = urls.split("\n").map((url) => url.trim()).filter(Boolean);
    if (list.length === 0) {
      toast.error("Enter at least one URL.");
      return;
    }

    const today = new Date().toISOString().slice(0, 10);
    setOutput(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${list.map((url) => `  <url>
    <loc>${escapeXml(normalizeUrl(url))}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`).join("\n")}
</urlset>`);
    toast.success("Sitemap generated.");
  }

  async function copy() {
    await navigator.clipboard.writeText(output);
    toast.success("Copied.");
  }

  function download() {
    const blob = new Blob([output], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "sitemap.xml";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <ToolLayout toolId="sitemap-generator">
      <div className="mx-auto max-w-5xl space-y-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Map className="h-5 w-5" />Sitemap Generator</CardTitle></CardHeader>
          <CardContent className="grid gap-4">
            <div className="space-y-2"><Label>Domain</Label><Input value={domain} onChange={(event) => setDomain(event.target.value)} placeholder="https://example.com" /></div>
            <div className="space-y-2"><Label>URLs</Label><Textarea value={urls} onChange={(event) => setUrls(event.target.value)} placeholder="/about&#10;/contact&#10;https://example.com/blog" className="min-h-[180px]" /></div>
            <Button onClick={generate}>Generate Sitemap</Button>
          </CardContent>
        </Card>
        {output && <Card><CardHeader><CardTitle className="flex items-center justify-between gap-3">Generated Sitemap<span className="flex gap-2"><Button variant="outline" size="sm" onClick={copy}><Copy className="mr-2 h-4 w-4" />Copy</Button><Button variant="outline" size="sm" onClick={download}><Download className="mr-2 h-4 w-4" />Download</Button></span></CardTitle></CardHeader><CardContent><pre className="overflow-x-auto rounded-md bg-muted p-4 text-sm"><code>{output}</code></pre></CardContent></Card>}
      </div>
    </ToolLayout>
  );
}
