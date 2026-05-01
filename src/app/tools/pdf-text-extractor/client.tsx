"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Copy, FileText, Upload } from "lucide-react";

import { ToolLayout } from "@/components/layouts/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { loadPdfJs } from "../_shared/pdf-helpers";

export default function Client() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [isReading, setIsReading] = useState(false);

  async function extract() {
    if (!file) return toast.error("Select a PDF.");
    setIsReading(true);
    try {
      const pdfjs = await loadPdfJs();
      const bytes = new Uint8Array(await file.arrayBuffer());
      const pdf = await pdfjs.getDocument({ data: bytes }).promise;
      const pages: string[] = [];
      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
        const page = await pdf.getPage(pageNumber);
        const content = await page.getTextContent();
        pages.push(content.items.map((item) => ("str" in item ? item.str : "")).join(" "));
      }
      setText(pages.join("\n\n"));
      toast.success("Text extracted.");
    } catch {
      toast.error("Could not extract PDF text.");
    } finally {
      setIsReading(false);
    }
  }

  async function copy() {
    await navigator.clipboard.writeText(text);
    toast.success("Copied.");
  }

  return (
    <ToolLayout toolId="pdf-text-extractor">
      <div className="mx-auto max-w-4xl space-y-6">
        <Card><CardHeader><CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" />PDF Text Extractor</CardTitle></CardHeader><CardContent className="space-y-4">
          <Label className="flex cursor-pointer items-center gap-2 rounded-md border p-3"><Upload className="h-4 w-4" />{file ? file.name : "Select PDF"}<input type="file" accept="application/pdf" className="hidden" onChange={(event) => setFile(event.target.files?.[0] ?? null)} /></Label>
          <Button onClick={extract} disabled={isReading}>{isReading ? "Extracting..." : "Extract Text"}</Button>
        </CardContent></Card>
        <Card><CardHeader><CardTitle className="flex items-center justify-between">Extracted Text{text && <Button size="sm" variant="outline" onClick={copy}><Copy className="mr-2 h-4 w-4" />Copy</Button>}</CardTitle></CardHeader><CardContent><Textarea value={text} onChange={(event) => setText(event.target.value)} className="min-h-[360px]" /></CardContent></Card>
      </div>
    </ToolLayout>
  );
}
