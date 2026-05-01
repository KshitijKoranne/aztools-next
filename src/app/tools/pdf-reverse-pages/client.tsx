"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { ArrowDownUp, Upload } from "lucide-react";
import { toast } from "sonner";

import { ToolLayout } from "@/components/layouts/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { baseName, downloadBlob, pdfBytesBlob } from "../_shared/pdf-helpers";

export default function Client() {
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  async function reversePages() {
    if (!file) return toast.error("Select a PDF.");
    setBusy(true);
    try {
      const source = await PDFDocument.load(await file.arrayBuffer());
      const total = source.getPageCount();
      if (total < 2) return toast.error("PDF needs at least two pages.");
      const output = await PDFDocument.create();
      const indices = Array.from({ length: total }, (_, index) => total - 1 - index);
      const pages = await output.copyPages(source, indices);
      pages.forEach((page) => output.addPage(page));
      downloadBlob(pdfBytesBlob(await output.save({ useObjectStreams: true })), `${baseName(file.name)}_reversed.pdf`);
      toast.success("Page order reversed.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to reverse pages.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <ToolLayout toolId="pdf-reverse-pages">
      <div className="mx-auto max-w-4xl space-y-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><ArrowDownUp className="h-5 w-5" />Reverse PDF Pages</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Label className="flex cursor-pointer items-center gap-2 rounded-md border p-3">
              <Upload className="h-4 w-4" />
              {file ? file.name : "Select PDF"}
              <input type="file" accept="application/pdf" className="hidden" onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
            </Label>
            <Button onClick={reversePages} disabled={!file || busy}>{busy ? "Processing..." : "Reverse Pages"}</Button>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
