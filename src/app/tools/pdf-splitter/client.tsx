"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { toast } from "sonner";
import { Scissors, Upload } from "lucide-react";

import { ToolLayout } from "@/components/layouts/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { downloadBlob, pdfBytesBlob } from "../_shared/pdf-helpers";

export default function Client() {
  const [file, setFile] = useState<File | null>(null);
  const [from, setFrom] = useState(1);
  const [to, setTo] = useState(1);

  async function split() {
    if (!file) return toast.error("Select a PDF.");
    const source = await PDFDocument.load(await file.arrayBuffer());
    const start = Math.max(1, from);
    const end = Math.min(source.getPageCount(), Math.max(to, start));
    const output = await PDFDocument.create();
    const pages = await output.copyPages(source, Array.from({ length: end - start + 1 }, (_, i) => start - 1 + i));
    pages.forEach((page) => output.addPage(page));
    downloadBlob(pdfBytesBlob(await output.save()), `pages-${start}-${end}.pdf`);
    toast.success("PDF split.");
  }

  return (
    <ToolLayout toolId="pdf-splitter">
      <div className="mx-auto max-w-4xl space-y-6">
        <Card><CardHeader><CardTitle className="flex items-center gap-2"><Scissors className="h-5 w-5" />PDF Splitter</CardTitle></CardHeader><CardContent className="space-y-4">
          <Label className="flex cursor-pointer items-center gap-2 rounded-md border p-3"><Upload className="h-4 w-4" />{file ? file.name : "Select PDF"}<input type="file" accept="application/pdf" className="hidden" onChange={(event) => setFile(event.target.files?.[0] ?? null)} /></Label>
          <div className="grid grid-cols-2 gap-3"><div className="space-y-2"><Label>From Page</Label><Input type="number" min="1" value={from} onChange={(event) => setFrom(Number(event.target.value) || 1)} /></div><div className="space-y-2"><Label>To Page</Label><Input type="number" min="1" value={to} onChange={(event) => setTo(Number(event.target.value) || 1)} /></div></div>
          <Button onClick={split}>Extract Page Range</Button>
        </CardContent></Card>
      </div>
    </ToolLayout>
  );
}
