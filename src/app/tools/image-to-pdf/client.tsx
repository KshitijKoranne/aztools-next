"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { toast } from "sonner";
import { FileImage, Upload } from "lucide-react";

import { ToolLayout } from "@/components/layouts/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { downloadBlob, pdfBytesBlob } from "../_shared/pdf-helpers";

export default function Client() {
  const [files, setFiles] = useState<File[]>([]);

  async function convert() {
    if (files.length === 0) return toast.error("Select images.");
    const pdf = await PDFDocument.create();
    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const image = file.type === "image/png" ? await pdf.embedPng(bytes) : await pdf.embedJpg(bytes);
      const page = pdf.addPage([image.width, image.height]);
      page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
    }
    downloadBlob(pdfBytesBlob(await pdf.save()), "images.pdf");
    toast.success("PDF created.");
  }

  return (
    <ToolLayout toolId="image-to-pdf">
      <div className="mx-auto max-w-4xl space-y-6"><Card><CardHeader><CardTitle className="flex items-center gap-2"><FileImage className="h-5 w-5" />Image to PDF</CardTitle></CardHeader><CardContent className="space-y-4">
        <Label className="flex cursor-pointer items-center gap-2 rounded-md border p-3"><Upload className="h-4 w-4" />Select Images<input type="file" accept="image/png,image/jpeg" multiple className="hidden" onChange={(event) => setFiles(Array.from(event.target.files ?? []))} /></Label>
        <div className="space-y-2 text-sm">{files.map((file) => <div key={file.name} className="rounded-md border p-2">{file.name}</div>)}</div>
        <Button onClick={convert}>Create PDF</Button>
      </CardContent></Card></div>
    </ToolLayout>
  );
}
