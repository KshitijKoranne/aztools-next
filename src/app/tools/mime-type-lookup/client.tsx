"use client";

import { useMemo, useState } from "react";
import { Copy, FileText } from "lucide-react";
import { toast } from "sonner";

import { ToolLayout } from "@/components/layouts/tool-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const mimeTypes = [
  ["html", "text/html"], ["css", "text/css"], ["js", "text/javascript"], ["mjs", "text/javascript"],
  ["json", "application/json"], ["xml", "application/xml"], ["txt", "text/plain"], ["csv", "text/csv"],
  ["md", "text/markdown"], ["pdf", "application/pdf"], ["zip", "application/zip"], ["gz", "application/gzip"],
  ["png", "image/png"], ["jpg", "image/jpeg"], ["jpeg", "image/jpeg"], ["webp", "image/webp"],
  ["gif", "image/gif"], ["svg", "image/svg+xml"], ["ico", "image/x-icon"], ["avif", "image/avif"],
  ["mp3", "audio/mpeg"], ["wav", "audio/wav"], ["ogg", "audio/ogg"], ["mp4", "video/mp4"],
  ["webm", "video/webm"], ["mov", "video/quicktime"], ["doc", "application/msword"],
  ["docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
  ["xls", "application/vnd.ms-excel"], ["xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"],
  ["ppt", "application/vnd.ms-powerpoint"], ["pptx", "application/vnd.openxmlformats-officedocument.presentationml.presentation"],
  ["wasm", "application/wasm"], ["woff", "font/woff"], ["woff2", "font/woff2"], ["ttf", "font/ttf"],
] as const;

export default function Client() {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase().replace(/^\./, "");
    if (!q) return mimeTypes;
    return mimeTypes.filter(([ext, type]) => ext.includes(q) || type.toLowerCase().includes(q));
  }, [query]);

  async function copy(value: string) {
    await navigator.clipboard.writeText(value);
    toast.success("Copied.");
  }

  return (
    <ToolLayout toolId="mime-type-lookup">
      <div className="mx-auto max-w-5xl space-y-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" />MIME Type Lookup</CardTitle></CardHeader>
          <CardContent><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by extension or MIME type, e.g. .webp or application/json" /></CardContent>
        </Card>
        <div className="grid gap-3 md:grid-cols-2">
          {filtered.map(([ext, type]) => (
            <Card key={`${ext}-${type}`}>
              <CardContent className="flex flex-wrap items-center justify-between gap-3 pt-6">
                <div>
                  <Badge variant="secondary" className="mb-2">.{ext}</Badge>
                  <div className="break-all font-mono text-sm">{type}</div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => copy(ext)}><Copy className="mr-2 h-4 w-4" />Ext</Button>
                  <Button variant="outline" size="sm" onClick={() => copy(type)}><Copy className="mr-2 h-4 w-4" />Type</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </ToolLayout>
  );
}
