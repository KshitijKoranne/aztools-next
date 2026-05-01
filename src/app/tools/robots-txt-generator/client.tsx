"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Copy, Download, FileText } from "lucide-react";

import { ToolLayout } from "@/components/layouts/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function Client() {
  const [domain, setDomain] = useState("");
  const [sitemapUrl, setSitemapUrl] = useState("");
  const [disallowPaths, setDisallowPaths] = useState("");
  const [output, setOutput] = useState("");

  function generate() {
    const paths = disallowPaths.split("\n").map((path) => path.trim()).filter(Boolean);
    setOutput(`# robots.txt for ${domain.trim() || "your site"}
User-agent: *
Allow: /
${paths.map((path) => `Disallow: ${path.startsWith("/") ? path : `/${path}`}`).join("\n")}
${sitemapUrl.trim() ? `\nSitemap: ${sitemapUrl.trim()}` : ""}`);
    toast.success("robots.txt generated.");
  }

  async function copy() {
    await navigator.clipboard.writeText(output);
    toast.success("Copied.");
  }

  function download() {
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "robots.txt";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <ToolLayout toolId="robots-txt-generator">
      <div className="mx-auto max-w-5xl space-y-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" />Robots.txt Generator</CardTitle></CardHeader>
          <CardContent className="grid gap-4">
            <div className="space-y-2"><Label>Domain</Label><Input value={domain} onChange={(event) => setDomain(event.target.value)} placeholder="example.com" /></div>
            <div className="space-y-2"><Label>Sitemap URL</Label><Input value={sitemapUrl} onChange={(event) => setSitemapUrl(event.target.value)} placeholder="https://example.com/sitemap.xml" /></div>
            <div className="space-y-2"><Label>Disallow Paths</Label><Textarea value={disallowPaths} onChange={(event) => setDisallowPaths(event.target.value)} placeholder="/admin&#10;/private" className="min-h-[140px]" /></div>
            <Button onClick={generate}>Generate robots.txt</Button>
          </CardContent>
        </Card>
        {output && <Card><CardHeader><CardTitle className="flex items-center justify-between gap-3">Generated robots.txt<span className="flex gap-2"><Button variant="outline" size="sm" onClick={copy}><Copy className="mr-2 h-4 w-4" />Copy</Button><Button variant="outline" size="sm" onClick={download}><Download className="mr-2 h-4 w-4" />Download</Button></span></CardTitle></CardHeader><CardContent><pre className="overflow-x-auto rounded-md bg-muted p-4 text-sm"><code>{output}</code></pre></CardContent></Card>}
      </div>
    </ToolLayout>
  );
}
