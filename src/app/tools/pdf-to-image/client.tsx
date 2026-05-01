"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { Download, FileImage, Upload } from "lucide-react";

import { ToolLayout } from "@/components/layouts/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loadPdfJs } from "../_shared/pdf-helpers";

export default function Client() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [isRendering, setIsRendering] = useState(false);

  async function renderPage() {
    if (!file || !canvasRef.current) return toast.error("Select a PDF.");
    setIsRendering(true);
    try {
      const pdfjs = await loadPdfJs();
      const pdf = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
      const page = await pdf.getPage(Math.min(Math.max(1, pageNumber), pdf.numPages));
      const viewport = page.getViewport({ scale: 2 });
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      await page.render({ canvas, canvasContext: ctx, viewport }).promise;
      toast.success("Page rendered.");
    } catch {
      toast.error("Could not render PDF page.");
    } finally {
      setIsRendering(false);
    }
  }

  function download() {
    const url = canvasRef.current?.toDataURL("image/png");
    if (!url) return;
    const link = document.createElement("a");
    link.href = url;
    link.download = `pdf-page-${pageNumber}.png`;
    link.click();
  }

  return (
    <ToolLayout toolId="pdf-to-image">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[360px_1fr]">
        <Card><CardHeader><CardTitle className="flex items-center gap-2"><FileImage className="h-5 w-5" />PDF to Image</CardTitle></CardHeader><CardContent className="space-y-4">
          <Label className="flex cursor-pointer items-center gap-2 rounded-md border p-3"><Upload className="h-4 w-4" />{file ? file.name : "Select PDF"}<input type="file" accept="application/pdf" className="hidden" onChange={(event) => setFile(event.target.files?.[0] ?? null)} /></Label>
          <div className="space-y-2"><Label>Page Number</Label><Input type="number" min="1" value={pageNumber} onChange={(event) => setPageNumber(Number(event.target.value) || 1)} /></div>
          <Button onClick={renderPage} disabled={isRendering}>{isRendering ? "Rendering..." : "Render Page"}</Button>
          <Button variant="outline" onClick={download}><Download className="mr-2 h-4 w-4" />Download PNG</Button>
        </CardContent></Card>
        <Card><CardHeader><CardTitle>Preview</CardTitle></CardHeader><CardContent><canvas ref={canvasRef} className="max-h-[620px] max-w-full rounded-md border" /></CardContent></Card>
      </div>
    </ToolLayout>
  );
}
