"use client";

import { useState } from "react";
import { degrees, PDFDocument } from "pdf-lib";
import { toast } from "sonner";
import { RotateCw, Upload } from "lucide-react";

import { ToolLayout } from "@/components/layouts/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { downloadBlob, pdfBytesBlob } from "../_shared/pdf-helpers";

export default function Client() {
  const [file, setFile] = useState<File | null>(null);
  const [angle, setAngle] = useState("90");

  async function rotatePdf() {
    if (!file) return toast.error("Select a PDF.");
    const pdf = await PDFDocument.load(await file.arrayBuffer());
    const rotation = Number(angle);
    pdf.getPages().forEach((page) => page.setRotation(degrees(rotation)));
    downloadBlob(pdfBytesBlob(await pdf.save()), "rotated.pdf");
    toast.success("PDF rotated.");
  }

  return (
    <ToolLayout toolId="pdf-rotator">
      <div className="mx-auto max-w-4xl space-y-6"><Card><CardHeader><CardTitle className="flex items-center gap-2"><RotateCw className="h-5 w-5" />PDF Rotator</CardTitle></CardHeader><CardContent className="space-y-4">
        <Label className="flex cursor-pointer items-center gap-2 rounded-md border p-3"><Upload className="h-4 w-4" />{file ? file.name : "Select PDF"}<input type="file" accept="application/pdf" className="hidden" onChange={(event) => setFile(event.target.files?.[0] ?? null)} /></Label>
        <Select value={angle} onValueChange={setAngle}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="90">90 degrees</SelectItem><SelectItem value="180">180 degrees</SelectItem><SelectItem value="270">270 degrees</SelectItem></SelectContent></Select>
        <Button onClick={rotatePdf}>Rotate PDF</Button>
      </CardContent></Card></div>
    </ToolLayout>
  );
}
