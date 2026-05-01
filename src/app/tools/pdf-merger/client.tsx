"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { toast } from "sonner";
import { FilePlus, Upload } from "lucide-react";

import { ToolLayout } from "@/components/layouts/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { downloadBlob, pdfBytesBlob } from "../_shared/pdf-helpers";

export default function Client() {
  const [files, setFiles] = useState<File[]>([]);

  async function merge() {
    if (files.length < 2) return toast.error("Select at least two PDFs.");
    const merged = await PDFDocument.create();
    for (const file of files) {
      const source = await PDFDocument.load(await file.arrayBuffer());
      const pages = await merged.copyPages(source, source.getPageIndices());
      pages.forEach((page) => merged.addPage(page));
    }
    downloadBlob(pdfBytesBlob(await merged.save()), "merged.pdf");
    toast.success("PDFs merged.");
  }

  return (
    <ToolLayout toolId="pdf-merger">
      <div className="mx-auto max-w-4xl space-y-6">
        <Card><CardHeader><CardTitle className="flex items-center gap-2"><FilePlus className="h-5 w-5" />PDF Merger</CardTitle></CardHeader><CardContent className="space-y-4">
          <Label className="flex cursor-pointer items-center gap-2 rounded-md border p-3"><Upload className="h-4 w-4" />Select PDFs<input type="file" accept="application/pdf" multiple className="hidden" onChange={(event) => setFiles(Array.from(event.target.files ?? []))} /></Label>
          <div className="space-y-2 text-sm">{files.map((file) => <div key={file.name} className="rounded-md border p-2">{file.name}</div>)}</div>
          <Button onClick={merge}>Merge PDFs</Button>
        </CardContent></Card>
      </div>
    </ToolLayout>
  );
}
