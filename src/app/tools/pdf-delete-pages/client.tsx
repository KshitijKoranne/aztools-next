"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { FileMinus, Upload } from "lucide-react";
import { toast } from "sonner";

import { ToolLayout } from "@/components/layouts/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { baseName, downloadBlob, parsePageSelection, pdfBytesBlob } from "../_shared/pdf-helpers";

export default function Client() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [selection, setSelection] = useState("1");
  const [busy, setBusy] = useState(false);

  async function selectFile(nextFile: File | null) {
    setFile(nextFile);
    setPageCount(null);
    if (!nextFile) return;
    try {
      const pdf = await PDFDocument.load(await nextFile.arrayBuffer());
      setPageCount(pdf.getPageCount());
    } catch {
      toast.error("Could not read this PDF.");
    }
  }

  async function deletePages() {
    if (!file || !pageCount) return toast.error("Select a PDF.");
    const pages = parsePageSelection(selection, pageCount);
    if (!pages?.length) return toast.error("Enter valid pages, like 1,3,5-7.");
    if (pages.length >= pageCount) return toast.error("At least one page must remain.");

    setBusy(true);
    try {
      const pdf = await PDFDocument.load(await file.arrayBuffer());
      [...pages].sort((a, b) => b - a).forEach((page) => pdf.removePage(page - 1));
      downloadBlob(pdfBytesBlob(await pdf.save({ useObjectStreams: true })), `${baseName(file.name)}_pages_removed.pdf`);
      toast.success(`Removed ${pages.length} page${pages.length === 1 ? "" : "s"}.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete pages.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <ToolLayout toolId="pdf-delete-pages">
      <div className="mx-auto max-w-4xl space-y-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><FileMinus className="h-5 w-5" />Delete PDF Pages</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Label className="flex cursor-pointer items-center gap-2 rounded-md border p-3">
              <Upload className="h-4 w-4" />
              {file ? `${file.name}${pageCount ? ` (${pageCount} pages)` : ""}` : "Select PDF"}
              <input type="file" accept="application/pdf" className="hidden" onChange={(event) => selectFile(event.target.files?.[0] ?? null)} />
            </Label>
            <div className="space-y-2">
              <Label>Pages to delete</Label>
              <Input value={selection} onChange={(event) => setSelection(event.target.value)} placeholder="1,3,5-7" />
            </div>
            <Button onClick={deletePages} disabled={!file || busy}>{busy ? "Processing..." : "Delete Pages"}</Button>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
