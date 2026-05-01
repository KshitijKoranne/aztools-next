"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Copy, Tags } from "lucide-react";

import { ToolLayout } from "@/components/layouts/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function escapeAttr(value: string) {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

export default function Client() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [keywords, setKeywords] = useState("");
  const [url, setUrl] = useState("");
  const [image, setImage] = useState("");
  const [output, setOutput] = useState("");

  function generate() {
    const safeTitle = escapeAttr(title.trim());
    const safeDescription = escapeAttr(description.trim());
    const safeKeywords = escapeAttr(keywords.trim());
    const safeUrl = escapeAttr(url.trim());
    const safeImage = escapeAttr(image.trim());

    setOutput(`<!-- Primary Meta Tags -->
<title>${safeTitle}</title>
<meta name="title" content="${safeTitle}">
<meta name="description" content="${safeDescription}">
${safeKeywords ? `<meta name="keywords" content="${safeKeywords}">` : ""}
${safeUrl ? `<link rel="canonical" href="${safeUrl}">` : ""}

<!-- Open Graph -->
<meta property="og:type" content="website">
<meta property="og:title" content="${safeTitle}">
<meta property="og:description" content="${safeDescription}">
${safeUrl ? `<meta property="og:url" content="${safeUrl}">` : ""}
${safeImage ? `<meta property="og:image" content="${safeImage}">` : ""}

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${safeTitle}">
<meta name="twitter:description" content="${safeDescription}">
${safeImage ? `<meta name="twitter:image" content="${safeImage}">` : ""}`);
    toast.success("Meta tags generated.");
  }

  async function copy() {
    await navigator.clipboard.writeText(output);
    toast.success("Copied.");
  }

  return (
    <ToolLayout toolId="meta-tags-generator">
      <div className="mx-auto max-w-5xl space-y-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Tags className="h-5 w-5" />Meta Tags Generator</CardTitle></CardHeader>
          <CardContent className="grid gap-4">
            <div className="space-y-2"><Label>Page Title</Label><Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Enter page title" /></div>
            <div className="space-y-2"><Label>Description</Label><Textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Enter page description" /></div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2"><Label>Keywords</Label><Input value={keywords} onChange={(event) => setKeywords(event.target.value)} placeholder="seo, tools, website" /></div>
              <div className="space-y-2"><Label>Canonical URL</Label><Input value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://example.com/page" /></div>
            </div>
            <div className="space-y-2"><Label>Social Image URL</Label><Input value={image} onChange={(event) => setImage(event.target.value)} placeholder="https://example.com/og-image.jpg" /></div>
            <Button onClick={generate}>Generate Meta Tags</Button>
          </CardContent>
        </Card>
        {output && <Card><CardHeader><CardTitle className="flex items-center justify-between gap-3">Generated Meta Tags<Button variant="outline" size="sm" onClick={copy}><Copy className="mr-2 h-4 w-4" />Copy</Button></CardTitle></CardHeader><CardContent><pre className="overflow-x-auto rounded-md bg-muted p-4 text-sm"><code>{output}</code></pre></CardContent></Card>}
      </div>
    </ToolLayout>
  );
}
